import { Request, Response } from 'express';
import { sendEmailOTP } from '../utils/email';

// Temporary store for mock OTPs (In production, use Redis or a DB field with expiration)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export const requestOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        // Generate a 6-digit random code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store with 10-minute expiration
        otpStore.set(email, {
            code: otp,
            expiresAt: Date.now() + 10 * 60 * 1000
        });

        // Send the email (or mock log it)
        await sendEmailOTP(email, otp);

        res.status(200).json({ message: 'OTP sent successfully. Please check your email/console.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        const storedData = otpStore.get(email);

        if (!storedData) {
            res.status(400).json({ message: 'No OTP requested for this email' });
            return;
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            res.status(400).json({ message: 'OTP has expired' });
            return;
        }

        if (storedData.code !== otp) {
            res.status(401).json({ message: 'Invalid OTP' });
            return;
        }

        // Success - clear the OTP
        otpStore.delete(email);

        // In a real app, you'd issue the JWT here or proceed to the next login step.
        res.status(200).json({ message: '2FA verification successful', verified: true });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};
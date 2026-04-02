import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Swagger documentation imports
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import meetingRoutes from './routes/meetingRoutes';
import documentRoutes from './routes/documentRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 1. Swagger API Documentation Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nexus API Documentation',
      version: '1.0.0',
      description: 'API endpoints for the Nexus Platform Collaboration Features',
    },
    servers: [
      { url: `http://localhost:${PORT}` }
    ]
  },
  apis: ['./src/routes/*.ts'], // Automatically generates docs from route comments
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Nexus API is running' });
});

// 2. Enhanced WebRTC Signaling Server
io.on('connection', (socket) => {
  console.log('User connected to WebRTC signal server:', socket.id);

  socket.on('join-room', (roomId: string, userId: string) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    // Broadcast audio toggle to others in the room
    socket.on('toggle-audio', (isMuted: boolean) => {
      socket.to(roomId).emit('user-toggled-audio', userId, isMuted);
    });

    // Broadcast video toggle to others in the room
    socket.on('toggle-video', (isVideoOff: boolean) => {
      socket.to(roomId).emit('user-toggled-video', userId, isVideoOff);
    });

    // Handle call ending cleanly
    socket.on('end-call', () => {
      socket.to(roomId).emit('user-ended-call', userId);
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

app.use(notFound);
app.use(errorHandler);
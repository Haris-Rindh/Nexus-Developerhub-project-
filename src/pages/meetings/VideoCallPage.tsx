import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const VideoCallPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) return;
    
    const appID = import.meta.env.VITE_ZEGO_APP_ID ? Number(import.meta.env.VITE_ZEGO_APP_ID) : 123456789;
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET || "PLACEHOLDER_SECRET";
    
    const initMeeting = async () => {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        "Nexus User " + Math.floor(Math.random() * 1000)
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      
      if (containerRef.current) {
        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showPreJoinView: true,
          showRoomTimer: true,
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          onLeaveRoom: () => {
            navigate('/meetings');
          }
        });
      }
    };
    
    initMeeting();
  }, [roomId, navigate]);

  return (
    <div className="flex flex-col h-screen w-full bg-black relative">
      <div className="absolute top-4 left-4 z-[999]">
        <button 
          onClick={() => navigate('/meetings')}
          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl border border-gray-700 transition shadow-lg backdrop-blur"
        >
          &larr; Back to Dashboard
        </button>
      </div>
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center border-none"
      />
    </div>
  );
};

export default VideoCallPage;

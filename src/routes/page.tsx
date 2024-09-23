import {
  encodeAudioOnlyRequest,
  genBotWSData,
  decodeWebSocketMessage,
  handleMessage,
} from '@/routes/utils';
import { Button } from '@arco-design/web-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import './index.css';
import VoiceBotService from '@/utils/voice_bot_service';

const Index = () => {
  const recorderRef = useRef<RecordRTC>();
  const mediaStream = useRef<MediaStream | null>(null);
  const [ASRResult, setASRResult] = useState<string>('');
  const webSocketRef = useRef<WebSocket>();
  const [voiceBotService, setVoiceBotService] = useState<VoiceBotService>();
  const getUserMedia = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          mediaStream.current = stream;
          resolve(stream);
        });
      } else {
        reject(null);
      }
    });
  }, []);

  const connectWebsocket = useCallback((): Promise<WebSocket> => {
    const botService = new VoiceBotService({
      ws_url: 'ws://localhost:8888/api/voice/chat',
    });
    setVoiceBotService(botService);
    return botService.connect();
  }, []);

  const startRecord = useCallback(async () => {
    try {
      const socket = await connectWebsocket();
      webSocketRef.current = socket;
      await getUserMedia();
      if (!mediaStream.current) {
        return;
      }
      recorderRef.current = new RecordRTC(mediaStream.current, {
        type: 'audio',
        recorderType: StereoAudioRecorder,
        mimeType: 'audio/wav',
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        disableLogs: true,
        timeSlice: 100,
        async ondataavailable(recordResult) {
          const socket = webSocketRef.current;
          if (!socket || !voiceBotService) {
            return;
          }
          const pcm = recordResult.slice(44);
          const data = encodeAudioOnlyRequest(pcm);
          if (socket.readyState === socket.OPEN) {
            voiceBotService.sendMessage({
              event: 'UserAudio',
              data,
            });
          }
        },
      });
      console.log(recorderRef);
      recorderRef.current.startRecording();
    } catch (e) {
      console.log(e);
    }
  }, [getUserMedia, connectWebsocket, voiceBotService]);

  return (
    <div className="root">
      <Button
        onClick={() => {
          startRecord();
        }}
      >
        开始对话
      </Button>
      <p>语音识别结果: {ASRResult}</p>
    </div>
  );
};

export default Index;

import {
  encodeAudioOnlyRequest,
  genBotWSData,
  decodeWebSocketResponse,
  handleJSONMessage,
} from '@/routes/utils';
import { Button } from '@arco-design/web-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import './index.css';
import VoiceBotService from '@/utils/voice_bot_service';
import { AwesomeCycleLines } from '@/conponents/AwesomeCycleLines';

const Index = () => {
  const recorderRef = useRef<RecordRTC>();
  const mediaStream = useRef<MediaStream | null>(null);
  const [ASRResult, setASRResult] = useState<string>('');
  const webSocketRef = useRef<WebSocket>();
  const voiceBotService = useRef<VoiceBotService>();
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
      // ws_url: 'ws://localhost:8888/api/voice/chat',
      ws_url: 'ws://10.254.198.22:8888/api/voice/chat',
    });
    voiceBotService.current = botService;
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
          const botService = voiceBotService.current;
          if (!socket || !botService) {
            return;
          }
          const pcm = recordResult.slice(44);
          const data = encodeAudioOnlyRequest(pcm);
          if (socket.readyState === socket.OPEN) {
            botService.sendMessage({
              event: 'UserAudio',
              data,
            });
          }
        },
      });
      recorderRef.current.startRecording();
    } catch (e) {
      console.error(e);
    }
  }, [getUserMedia, connectWebsocket]);

  return (
    <div className="root">
      <img
        className={
          'w-[100px] h-[100px] rounded-full select-none z-20 object-cover box-content absolute'
        }
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '150px',
          maxHeight: '150px',
          minWidth: '100px',
          minHeight: '100px',
          top: '26%',
          left: '43%',
        }}
        src={
          'https://ark-auto-2100000825-cn-beijing-default.tos-cn-beijing.volces.com/assistant_image/WrAtF2jBdl.png'
        }
        alt="bot avatar"
      />
      <AwesomeCycleLines
        style={{
          top: '33.7%',
          left: '49.8%',
        }}
        className={'absolute'}
        lineCount={80}
        eachLineProps={i => ({
          style: {
            width: 4,
            borderRadius: 999999,
            transitionDuration: '100ms',
            height: 90 * 1 ?? 0,
            backgroundColor: '#5629EE26',
          },
        })}
      />
      <div
        style={{
          left: '47%',
        }}
        className={'absolute top-1/2'}
      >
        <Button
          onClick={() => {
            startRecord();
          }}
        >
          打电话
        </Button>
        <p>语音识别结果: {ASRResult}</p>
      </div>
    </div>
  );
};

export default Index;

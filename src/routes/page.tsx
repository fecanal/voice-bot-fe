import {encodeAudioOnlyRequest} from "@/routes/utils";
import {Button} from "@arco-design/web-react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import RecordRTC, {StereoAudioRecorder} from "recordrtc";
import './index.css';

const Index = () => {
  const recorderRef = useRef<RecordRTC>();
  const mediaStream = useRef<MediaStream | null>(null);
  const [ASRResult,setASRResult] = useState<string>('');
  const webSocketRef = useRef<WebSocket>();

  const getUserMedia = useCallback(async () => {
    return new Promise(((resolve,reject) => {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          mediaStream.current=stream;
          resolve(stream);
        });
      } else {
        reject(null);
      }
    }))
  }, []);

  const connectWebsocket = useCallback(async () => {
    return new Promise((resolve => {
      const socket = new WebSocket('ws://localhost:8888/bot');
      socket.onopen = () => {
        console.log('WebSocket connected');
        webSocketRef.current = socket;
        resolve(socket);
      }
      socket.onmessage = (event) => {
        console.log('Received message:', event.data);
      };

      socket.onclose = () => {
        console.log('WebSocket closed');
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    }))
  }, []);

  const startRecord = useCallback(async() => {
    try{
      await connectWebsocket()
      await getUserMedia()
      if(!mediaStream.current){
        return
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
          if (!socket) {
            return;
          }
          const pcm = recordResult.slice(44);
          const data = encodeAudioOnlyRequest(pcm);
          if (socket.readyState === socket.OPEN) {
            /*socket.send(
                genBotWSData({
                    event: 'UserAudio',
                    data,
                }),
            );*/
            socket.send(data);
          }
        },
      })
      console.log(recorderRef)
      recorderRef.current.startRecording();
    }catch (e){
      console.log(e)
    }

  }, [getUserMedia,connectWebsocket]);

  return (<div className='root'>
    <Button
      onClick={()=>{
        startRecord();
      }}>开始对话
    </Button>
    <p>语音识别结果: {ASRResult}</p>
  </div>)
};

export default Index;

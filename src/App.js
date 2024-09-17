import logo from './logo.svg';
import './App.css';
import {useCallback, useEffect, useRef, useState} from "react";
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import {encodeAudioOnlyRequest, genBotWSData} from "./util";

function App() {
  const recorderRef = useRef();
  const mediaStream = useRef(null);

  const webSocketRef = useRef();

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
        try {
            const socket = new WebSocket('ws://localhost:8888/bot');
            socket.onopen = () => {
                console.log('WebSocket connected');
                webSocketRef.current = socket;
                return true;
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
        } catch (error) {
            console.error('Failed to get user media:', error);
            return false;
        }
    }, []);

    useEffect(() => {
        (async function (){
            await getUserMedia()
            await connectWebsocket()
        })().then(
            ()=>{
                console.log(mediaStream);
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
                        // handleRecordResult?.(recordResult);
                        //
                        const pcm = recordResult.slice(44);
                        const data = encodeAudioOnlyRequest(pcm);
                        if (socket.readyState === socket.OPEN) {
                            socket.send(
                                genBotWSData({
                                    event: 'UserAudio',
                                    data,
                                }),
                            );
                        }
                    },
                })
            }

        )
        }
    ,[])
  return (
    <div className="App">

    </div>
  );
}

export default App;

"use strict";(self.webpackChunkvoice_bot_fe=self.webpackChunkvoice_bot_fe||[]).push([["484"],{29529:function(e,n,r){r.r(n),r.d(n,{default:()=>N});var t=r("60387"),o=r("11527");r("2192");var a=r("58405"),s={PROTOCOL_VERSION:1,DEFAULT_HEADER_SIZE:1,HEADER_BITS:4,PAYLOAD_LENGTH_BYTES:4,CLIENT_FULL_REQUEST:1,CLIENT_AUDIO_ONLY_REQUEST:2,SERVER_FULL_RESPONSE:9,SERVER_AUDIO_ONLY_RESPONSE:11,NO_SEQUENCE:0,JSON:1,NO_COMPRESSION:0},i=e=>{var n=E(s.CLIENT_AUDIO_ONLY_REQUEST);return n.setUint32(4,e.size,!1),new Blob([n,e])},E=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.CLIENT_FULL_REQUEST,n=new DataView(new ArrayBuffer(8));return n.setUint8(0,s.PROTOCOL_VERSION<<4|s.DEFAULT_HEADER_SIZE),n.setUint8(1,e<<4|s.NO_SEQUENCE),n.setUint8(2,s.JSON<<4|s.NO_COMPRESSION),n.setUint8(3,0),n},c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.CLIENT_AUDIO_ONLY_REQUEST,n=new DataView(new ArrayBuffer(8));return n.setUint8(0,s.PROTOCOL_VERSION<<4|s.DEFAULT_HEADER_SIZE),n.setUint8(1,e<<4||s.NO_SEQUENCE),n.setUint8(2,s.JSON<<4|s.NO_COMPRESSION),n.setUint8(3,0),n},l=e=>{var n=new DataView(e),r=15&n.getUint8(0),t=_(n.getUint8(1)),o=e.slice(r*s.HEADER_BITS),a=new DataView(o).getUint32(0),i=o.slice(s.PAYLOAD_LENGTH_BYTES);return t===s.SERVER_AUDIO_ONLY_RESPONSE?{messageType:s.SERVER_AUDIO_ONLY_RESPONSE,payload:o.slice(s.PAYLOAD_LENGTH_BYTES,s.PAYLOAD_LENGTH_BYTES+a)}:{messageType:s.SERVER_FULL_RESPONSE,payload:JSON.parse(new TextDecoder().decode(i))}},u=e=>{var{event:n,payload:r}=e;if(console.log("handleMessage",n,r),!!n)switch(n){case"BotReady":console.log("BotReady",r);break;case"BotUpdateConfig":console.log("BotUpdateConfig",r);break;case"SentenceRecognized":console.log("SentenceRecognized",r);break;case"TTSSentenceStart":console.log("TTSSentenceStart",r);break;case"TTSDone":console.log("TTSDone",r);break;case"BotError":console.log("BotError",r);break;default:console.log("Unknown event",n,r)}},_=e=>e>>4&15,d=r("50959"),S=r("86228"),O=r.n(S);class R{connect(){var e=this;return(0,t._)(function*(){return new Promise((n,r)=>{var t=new WebSocket(e.ws_url);t.onopen=()=>{e.ws=t,n(t)},t.onerror=n=>{r(n),e.onError(n)},t.onmessage=n=>e.onMessage(n)})})()}sendMessage(e){var n;null===(n=this.ws)||void 0===n||n.send(function(e){if(e.payload){var n=c(s.CLIENT_FULL_REQUEST),r=JSON.stringify(e.payload),t=new TextEncoder().encode(r).length;return n.setUint32(4,t,!1),new Blob([n,r])}var o=c(),a=e.data||new Blob;return o.setUint32(4,a.size,!1),new Blob([o,a])}(e))}onMessage(e){try{e.data.arrayBuffer().then(e=>{var n=l(e);console.log("##resp",n),n.messageType===s.SERVER_FULL_RESPONSE&&u(n.payload),n.messageType===s.SERVER_AUDIO_ONLY_RESPONSE&&this.handleAudioOnlyResponse(n.payload)})}catch(e){this.onError(e)}}handleAudioOnlyResponse(e){var n=this;return(0,t._)(function*(){var r=yield n.audioCtx.decodeAudioData(new Uint8Array(e).buffer),t=n.audioCtx.createBufferSource();t.buffer=r,t.connect(n.audioCtx.destination),t.start(0)})()}onError(e){console.error(e),this.dispose()}dispose(){var e;null===(e=this.ws)||void 0===e||e.close()}constructor(e){this.ws_url=e.ws_url,this.audioCtx=new AudioContext}}let N=()=>{var e=(0,d.useRef)(),n=(0,d.useRef)(null),[r,s]=(0,d.useState)(""),E=(0,d.useRef)(),c=(0,d.useRef)(),l=(0,d.useCallback)((0,t._)(function*(){return new Promise((e,r)=>{navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia({audio:!0}).then(r=>{n.current=r,e(r)}):r(null)})}),[]),u=(0,d.useCallback)(()=>{var e=new R({ws_url:"ws://10.254.198.22:8888/api/voice/chat"});return c.current=e,e.connect()},[]),_=(0,d.useCallback)((0,t._)(function*(){try{var r=yield u();if(E.current=r,yield l(),!n.current)return;e.current=new(O())(n.current,{type:"audio",recorderType:S.StereoAudioRecorder,mimeType:"audio/wav",numberOfAudioChannels:1,desiredSampRate:16e3,disableLogs:!0,timeSlice:100,ondataavailable:e=>(0,t._)(function*(){var n=E.current,r=c.current;if(!!n&&!!r){var t=e.slice(44),o=i(t);n.readyState===n.OPEN&&r.sendMessage({event:"UserAudio",data:o})}})()}),e.current.startRecording()}catch(e){console.error(e)}}),[l,u]);return(0,o.jsxs)("div",{className:"root",children:[(0,o.jsx)(a.Z,{onClick:()=>{_()},children:"\u5F00\u59CB\u5BF9\u8BDD"}),(0,o.jsxs)("p",{children:["\u8BED\u97F3\u8BC6\u522B\u7ED3\u679C: ",r]})]})}}}]);
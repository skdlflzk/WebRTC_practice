# Noom

Zoom clone using NodeJ, WebRTC and WebSockets.



### 알아야한다
	document.getElementById()
	document.querySelector()
	createElemenet('태그')
	.innerText = ?
	append()
	.classList.add()

### 생성한다
	babel.config.json
	nodemon.json
	.gitignore

### 수행한다
	npm i nodemon -D
	git init
	npm i @babel/core @babel/cli @babel/node @babel/presets -D
	npm i express
	npm i pug



### 설정한다
	nodemon.json
	babel.config.json
	package.json에 "scripts":{"dev":"nodemon"}

이제 package.json 에 필요한 라이브러리가 모두 들어있다.


dev를 치면 nodemon이 호출될거고, nodemon.json의 exec을 수행
nodemon? exec-> server에 대해 babel-node 명령문을 수행
babel.config.json  우리가 사용할 유일한 preset이 수행


서버 수행은 npm run dev으로 수행.

------------

기본적으로 적용하는 디자인 - mvp css
	<link rel="stylesheet" href=""http://unpkg.com/mvp.css">

nodemon ? 변경이 있으면 자동으로 재시작
babel? 우리가 생서한 코드를 nodejs로 변경


------------


viewEngine pug설정
public폴더 ? FrontEnd와 BackEnd를 구분하는 폴더임.
	frontend는 제공, backend는 제공 금지
server.js 백엔드
app.js 는 프론트

app.get("/",...)? /으로 가면 홈으로 보내는 라인
app.get("/*,(req,res)=>res.redirect("/"))? 이상한접근은 모두 홈으로


nodemon 수행 시 nodemon.json 참조
nodemon.json 의 exec의 babel-node는 babel.config.json을 보고
babel.config.json는 코드에 적용되어야하는 preset을 선택한다.

------------

http stateless 상태가 없음
-> 쿠키를 가지고 나를 증명.
client가 먼저 트리거시킴

http://example.com
wss://example.com
프로토콜이 다름.

WebSocket
1. http로 WebSocket req <-> accept
2. wss 통신
0x~~~0xFF
UTF-8로 통신

3. 한쪽의 connection  종료

protocol? 규칙.
ws? 프로토콜을 구현한 라이브러리.
채팅방 등은 구현되어있지않음! 프로토콜에 포함이 안되어있는 feature일 뿐
그래서, ws를 활용한 framework가 있다.
채팅방기능이 있음!
ws는 WebSocket의 core library이며


express는 현재 http를 다루지만
ws://도 다루게 해야할 것 .


------------


브라우저의 WebSocket은 button의 .addEventListener("click", function())과 비슷하다.
연결이 되면 "connect", 콜백이 불린다.

------------


## Socket.io

실시간/양방향/이벤트 기반.
ws랑 똑같잖아? 아님!
ws도 쓰지만 ws으로 구현된게 아니다.

웹소켓 프로토콜에 따라 구현한 유연성있는 프레임워크임.
WebSocket 을 사용하지 못하는 경우도 지원함! as Long Polling
브라우저가 ws가능이면 사용
방화벽 + proxy가 있어도 사용할 수 있다.

automatic reconnection, reliabilty, ...

	const ioServer = SocketIO(httpServer);

하게되면 localhost:3000/socket.io/socket.io.js 로 접근할 수 있는 경로가 생긴다.
왜 생기냐? 내장된 WebSocket이 아니기 때문에 브라우저에서 실행할 수 있도록 코드를 제공하는 것임.
script(src="/socket.io/socket.io.js")
client에서는 io로 접근한다.

## room

채팅방! socketIO가 제공하는 feature.
``` javascript
	socket.on("connection, (socket)=>{
		socket.on(CUSTOM_EVENT, (msg..., callback)=>{
			console.log(msg, "처리하고");
			setTimeout(()=>callback(LONG_TIME_CONSUMING_RESULT), 1500); // 서버 작업이 끝나면 클라이언트가 실행대기중인 함수를 원격으로 수행시킨다!ㄷㄷ
		})
	})
```

함수를 전달해서 인자를 받을 수 있지만, 그 인자로 함수를 받을 수는 없나보다ㅋ.ㅋ

	socket.id //user는 id가 있는데 기본적으로 id에 속한 방에 들어있다.
	socket.rooms //현재 무슨 룸이 있는지 알 수 있다.
	socket.join([ROOM_NAME1, ...])
	socket.to(ROOM_NAME1).to(ROOM_NAME2).emit(CUSTOM_EVENT)
	socket.to(ID).emit(`${ID}에 개인메세지 보내기`)

	socket.on(EVENT, ()=>{socket./*... to(R1).to(R2)..*/.emit(CUSTOM_EVENT, `${R1} 내 ${R2}에 msg전송`)})
	socket.to 와 on으로 메세지 발송 대상, 발송 이벤트, 발송 메세지를 지정한다.

	const wsServer  = SocketIO(httpServer);
	wsServer.socketsJoin(ANNOUNCEMENT_ROOM);

강제로 채팅방에 참여시킬수도 있다.



------------

## Adapter

Adapter 다른 서버들 사이에 실시간 어플리케이션을 동기화 하는 것.
현재 메모리에서 Adapter를 구현하는 중.
(서버 restart 마다 room, socket들은 사라진다.)
-> backend에 db를 가져야한다.

또한, 모든 클라이언트의 connection을 간직해야한다.
브라우저는 서버로 단 한개의 connection을 열지만 서버는 많은 connection을 가지게 된다.
여러대의 서버가 있다면 메모리 Adapter는 다른 서버마다 다른 pool을 가지므로 서버간 공유가 안된다는 것!

*Connection에 대한 저장공간이 필요하다.*

### Adapter ? 누가 현재 어플리케이션에 접속되었는지 정보

아래와 같음.

``` javascript
	console.log(ioServer.sockets.adapter)
```

		<ref *2> Adapter {
		_events: [Object: null prototype] {},
		_eventsCount: 0,
		_maxListeners: undefined,
		nsp: <ref *1> Namespace {
			_events: [Object: null prototype] { connection: [Function (anonymous)] },       
			_eventsCount: 1,
			_maxListeners: undefined,
			sockets: Map(1) { 'yKPvII65gVMK8IuUAAAB' => [Socket] },
			_fns: [],
			_ids: 0,
			server: Server {
			_events: [Object: null prototype] {},
			_eventsCount: 0,
			_maxListeners: undefined,
			_nsps: [Map],
			parentNsps: Map(0) {},
			_path: '/socket.io',
			clientPathRegex: /^\/socket\.io\/socket\.io(\.msgpack|\.esm)?(\.min)?\.js(\.map)?(?:\?|$)/,
			_connectTimeout: 45000,
			_serveClient: true,
			_parser: [Object],
			encoder: Encoder {},
			_adapter: [class Adapter extends EventEmitter],
			sockets: [Circular *1],
			opts: {},
			eio: [Server],
			httpServer: [Server],
			engine: [Server],
			[Symbol(kCapture)]: false
			},
			name: '/',
			adapter: [Circular *2],
			[Symbol(kCapture)]: false
		},
		rooms: Map(2) {
			'yKPvII65gVMK8IuUAAAB' => Set(1) { 'yKPvII65gVMK8IuUAAAB' },
			'3' => Set(1) { 'yKPvII65gVMK8IuUAAAB' }
		},
		sids: Map(1) {
			'yKPvII65gVMK8IuUAAAB' => Set(2) { 'yKPvII65gVMK8IuUAAAB', '3' }
		},
		encoder: Encoder {},
		[Symbol(kCapture)]: false
		}

### 중요한 것?

``` javascript
const ioServer =  SocketIO(httpServer);
ioServer.sockets.adapter.rooms
ioServer.sockets.adapter.sids
```

1. rooms - 현재 열려있는 방(과 참여자들) Map.
2. sids(socket ids) - 현재 참여자들(과 그가 속한 방) Map

	rooms.containsKey(socket id) ? private room : public room 임.

------------

### SocketIO 는 Admin UI 관리자 화면이 있다.

[admin-ui](https://socket.io/docs/v4/admin-ui/)

현재 SocketIO 서버를 비쥬얼라이즈 해서 볼 수 있음.

1. 설치
	npm i @socket.io/admin-ui

2. 세팅
``` javascript
	import {instrument} from "@socket.io/admin-ui"

	...

	const ioServer = SocketIO(httpServer,{
			cors:{
				origin:["https://admin.socket.io"],
				credentials:true,
			},
		});

	instrument(ioServer,{
		auth:false, 
		namespaceName : "/"	// 나는 이 부분을 안해주면 데이터가 보이지 않더라
	})
```

https://admin.socket.io에 접속, 서버 주소 http://localhost:3000 만 입력해서 연결.


------------

## Video Call

``` pug
html#myFace(autoplay, playsinline)
```

playsinline? 웹사이트에서만 실행되는 옵션

``` javascript

	/* 카메라/오디오 미디어 가져오기 */
	const streams = await navigator.mediaDevices.getUserMedia({
		audio:true,
		video:true
		/* 추가로
		video:{deviceId:{exact:deviceId},} // 카메라 지정
		video:{facingMode :"user",} // 셀카 모드
		video:{facingMode:{exact:"environment"}} // 전면으로 촬영
		*/
	});
	myFace.srcObject = streams;

	console.log(streams.getVideoTracks());

	/* 연결된 기기 정보 가져오기 */
	const devices = await navigator.mediaDevices.enumerateDevices()
	const cameras = devices.filter(device =>{
			return device.kind === "videoinput" // "audioinput", 
		})
```

getVideoTracks()? 현재 비디오의 *track* 들을 가져오는 것
비디오, 오디오, 자막의 track도 있음!

	비디오 트랙의 id != 미디어의 deviceId
	but track.label ==  미디어.label

video:{deviceId:{exact:deviceId}} 에서 쓰이는 deviceId는 enumerateDevices()에서 받아온 기기정보값임.

------------


## webRTC? web RealTime Communication
 = p2p
서버가 서로의 위치를 알려줌

### RTC connection 생성하기
``` javascript
	// A와 B 서로 connection을 생성했다. 
	const conA = new RTCPeerConnection() //B의 경우 conB로 구분

	// 1. A가 A 쪽의 local 정보를 connection에 지정하고 offer를 서버를 통해 B에게제공
	const offer = conA.createOffer()
	conA.setLocalDescription(offer);
	socket.emit("offer", offer, roomName)

	// 2. B가 offer를 받기 위해 socket에서 "offer"이벤트 수신을 대기하고 있었다.
	socket.on("offer", (offer)=>{
		// offer를 받은 B는 conB객체에 offer를 지정하고
		conB.setRemoteDescription(offer);

		// 그리고 그 답변 answer를 생성한다.
		const answer = conB.createAnswer();
		// B는 B쪽의 정보를 local에 세팅하고 answer를 서버를 통해 A에게 제공
		conB.setLocalDescription(answer);
		socket.emit("answer", answer, roomName);
	})

	// 3. A는 B의 answer를 받기위해 "answer" 이벤트 수신을 대기하고 있었다.
	socket.on("answer", (answer)=>{
		conA.setRemoteDescription(answer);
	})
```

A와 B의 순서가 바뀌면 서로 대기하거나 제공하는 순서가 바뀔 뿐 원리는 같다.

### icecandidate
연결 합의점
이를 다른 브라우저로 전달해야함

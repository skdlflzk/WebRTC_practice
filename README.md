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
	socket.on("connection, (socket)=>{
		socket.on(CUSTOM_EVENT, (msg..., callback)=>{
			console.log(msg, "처리하고");
			setTimeout(()=>callback(LONG_TIME_CONSUMING_RESULT), 1500); // 서버 작업이 끝나면 클라이언트가 실행대기중인 함수를 원격으로 수행시킨다!ㄷㄷ
		})
	})


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




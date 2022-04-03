import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();
app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res)=>res.render("home"));
app.get("/*",(req,res)=>res.redirect("/"));

// app.listen(3000);

// node.js에 내장된 http package를 사용해본다
const server = http.createServer(app);
// express app으로 부터 http서버로 접근하게 만든 것!
// app.listen(3000);은 서버를 만들뿐 instance를 갖고오진 못했다.

const wss = new WebSocket.Server({server}); // .server(option)는 선택
//같은 포트로 쓰기 위해서 server 객체를 넘겨준 것이다.

const handleListen = ()=>console.log("server started");

server.listen(3000, handleListen); //app.listen(3000, eventHandler);
// 브라우져는 이미 ws 코드가 구현되어있으므로 따로 script lib이 필요하지 않음

// 웹소켓이 연결되었을 경우 콜백 함수를 지정
// 첫 파라메터 socket은 연결 정보를 반환해줌.
function handleConnection(socket){
	
	//연결되면 hello!!! 메세지를 보낸다.
	sockets.push(socket);
	//받은 socket 데이터에 기본 nickname 세팅
	socket.nickname ="Anon";
	socket.on("close", onSocketClosed)
	
	// 모든 수신한 데이터를 message로 수신하고 있다.
	socket.on("message", (msg)=>{
		const message = JSON.parse(msg);
		console.log(message.type)
		switch(message.type){
			case "new_message":
				sockets
				.filter(s=>s.nickname !== socket.nickname)
				.forEach((e)=>
					e.send(socket.nickname+":"+message.payload)				
				)
				break;
			case "nickname":
				console.log("set nick = " + message.payload)
				socket.nickname = message.payload
		}
	})
}

function onSocketClosed(s){
	console.log("Disconncted from client");
	// sockets = sockets.
}
wss.on("connection", handleConnection);


// 누군가가 연결해오면 DB에 연결 정보를 저장해서
// socket.send() <- send할 소켓 대상을 지정한다.
const sockets =[];
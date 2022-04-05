/**
 * SocketIO를 사용한 server
 */
import http, { Server } from "http";
import express from "express";
import SocketIO from "socket.io"

const app = express();
app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req,res)=>res.render("home"));
app.get("/*",(req,res)=>res.redirect("/"));

const httpServer = http.createServer(app);
const ioServer = SocketIO(httpServer);

function publicRooms(){
	const {
		sockets:{
			adapter:{sids, rooms}
		},
	} = ioServer
	const publicRooms = [];
	rooms.forEach((_, roomKey) =>{
		if (sids.get(roomKey) === undefined){
			publicRooms.push(roomKey)
		}
	})
	return publicRooms
}
ioServer.on("connection", (socket)=>{
	socket.nickname = 'Anon';


	// socket.rooms => 현재 접속한 socket의 방 참가정보
	socket.onAny((e)=>{
		console.log(`socket event:${e}`);
		console.log(ioServer.sockets.adapter);
	})
	
	socket.on("enter_room",(roomName,done)=>{
		// 룸에 입장
		socket.join(roomName);
		//client의 룸입장 성공 함수 실행
		done(roomName);

		//나를 제외한 사람에게 보낸다!!
		socket.to(roomName).emit("welcome")
		ioServer.sockets.emit("room_change", publicRooms());	//현재 공개방을 뿌린다
	})


	socket.on("disconnecting", ()=>{
		// 나가려고 하지만, 나가지는 않은 상태
		// 그래서 socket.rooms의 내부에 room 정보가 살아있다
		// 유종애미를 거두거라.

		socket.rooms.forEach((room)=>{
			console.log(`bye to ${room}`)
			socket.to(room).emit("bye", socket.nickname)
		});
	});
	
	socket.on("disconnect", ()=>{
		ioServer.sockets.emit("room_change", publicRooms());	//현재 공개방을 뿌린다
	})


	socket.on("new_msg", (msg, roomName, done)=>{
		console.log(`[${roomName}]<${msg}>`)
		// socket.to(roomName).emit(msg);
		socket.to(roomName).emit("new_msg",`${socket.nickname} : ${msg}`);
		
		done();
	})

	socket.on("nickname", (nick)=>{
		socket.nickname = nick;
	})

	socket.on("example", (msg, heavyFunction)=>{ // ,a,b,d,e,f,g, callback) => {
		//변수도 보내고 함수도 보낼 수 있다는 것.
		console.log(msg)
		setTimeout(()=>heavyFunction(Date.now()), 1000)
	});
})

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

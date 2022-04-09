import SocketIO from 'socket.io';
import http from "http";
import express from 'express';


const app = express();
app.set("view engine", "pug");	// pub로 작성한 파일을 html로 변환하여 보내줄 예정
app.set("views", __dirname + "/views"); //  템플릿이 있는 곳 지정
app.use("/public", express.static(__dirname + "/public")); // 정적 파일이 있는 곳 지정

app.get("/", (req,res)=>res.render("home"));	// 루트 위치는 views 이하 "home" 전송
app.get("/*",(req,res)=>res.redirect("/"));	//그 외엔 루트로=홈으로 이동


const httpServer = http.createServer(app);	// http 서버 생성
const socketServer = SocketIO(httpServer);	// ws 서버 생성


socketServer.on("connection",()=>{
	console.log('');

});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);	// 서버 시작

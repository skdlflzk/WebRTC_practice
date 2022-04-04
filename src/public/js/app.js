/**
 * SocketIO 버전의 client
 */

const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const h3 = document.querySelector("h3");

let roomName = "";

room.hidden = true;

function handleRoomSubmit(e){
	e.preventDefault();
	const input = form.querySelector("input");
	roomName = input.value;
	input.value = ""

	socket.emit("enter_room", roomName
	// 1,2,3,4,5,6,7,'여러개 데이터를 보낼 수 있다.', 
	// (valuableValue)=>{ //함수도 보낼 수 있따.
	// 	console.log("오래 기다린 후 ",valuableValue,"를 받았다.");
	// 	// 함수를 전달해서 인자를 받을 수 있지만, 그 인자로 함수를 받을 수는 없나보다ㅋ.ㅋ
	// })
	// <-> socket.send("only text")
	// 1. 이벤트를 선택할 수 있고
	// 2. object도 전달할 수 있다.
		,function showRoom(e){
			console.log(e)
			room.hidden = false;
			welcome.hidden = true;
			h3.innerText = roomName;
			const nameForm = room.querySelector("form#name");
			const chatForm = room.querySelector("form#msg");
			nameForm.addEventListener("submit", handleNick);
			chatForm.addEventListener("submit", handleChat);
		})
	
}

function handleNick(e){
	e.preventDefault();
	const input = room.querySelector("#name input")
	socket.emit("nickname", input.value);
}

function handleChat(e){
	e.preventDefault();
	console.log(`chat! ${e}` )
	const input = room.querySelector("#msg input");
	socket.emit("new_msg", input.value, roomName, ()=>{
		addMessage(`YOU : ${input.value}`)
		input.value = ""
	});
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", ()=>{
	addMessage("someone come")
})

socket.on("bye", (e)=>{
	addMessage(`${e} Left. say good bye`)
})

socket.on("new_msg", (msg)=>{
	console.log(msg)
	addMessage(msg)
})

function addMessage(msg){
	const ul = room.querySelector("ul")
	const li = document.createElement("li");
	li.innerText = msg;
	ul.appendChild(li);
}
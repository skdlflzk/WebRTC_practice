/**
 * WebSocket 버전의 client
 */
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form#message");
const nickForm = document.querySelector("form#nick");

const nickname = "";
function handleSubmit(e){
	e.preventDefault();
	const input = messageForm.querySelector("input");
	
	console.log(input.value)
	socket.send(JSON.stringify({
		type:"new_message",
		payload:input.value
	}));
	const item = document.createElement('li');
	item.innerText = input.value;
	messageList.append(item);

	input.value = "";
}
function handleNick(e){
	e.preventDefault();
	
	const input = nickForm.querySelector("input");
	// socket.send(input.value); // nick을 message처럼 전송
	
	socket.send(JSON.stringify({
		type:"nickname",
		payload:input.value
	}));
}

messageForm.addEventListener("submit", handleSubmit)
nickForm.addEventListener("submit",handleNick)

// ws://localhost:3000 이라고 하기 싫다. 하드코딩이니까
// const socket = new WebSocket("ws://./:3000")
// window.location.host
const socket = new WebSocket("ws://"+window.location.host)

//Socket을 생성함. socket도 Button처럼 이벤트를 받거나 일으킬 수 있다.
socket.addEventListener("open",()=>{
	console.log("connected to server");
})
socket.addEventListener("message", (message)=>{
	console.log("msg received : \n", message.data);
	const item = document.createElement('li');
	item.innerText = message.data;
	messageList.append(item);
})

socket.addEventListener("close",()=>{
	console.log("disconnected from server");
})
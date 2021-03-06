const socket = io();

const myFace = document.getElementById("myFace");
const cameraBtn = document.getElementById("camera");
const muteBtn = document.getElementById("mute");
const cameraSelector = document.getElementById("cameras");
const call = document.getElementById("call")
call.hidden = true;


let myStream;
let muted = true;
let camera = true

async function getMedia(deviceId){
	try{
		myStream = await navigator.mediaDevices.getUserMedia({
			audio:muted,
			video: deviceId ? 
			{ deviceId:{exact:deviceId},}
			:{facingMode :"user",} // 셀카 모드로 찍기 시작
					// facingMode:{exact:"environment"}	// 전면으로 촬영
		});
		//navigator.mediaDevices.enumerateDevices
		console.log(myStream)
		myFace.srcObject = myStream;
	}catch(e){
		console.log(e);
	}
	if(!deviceId){
		await getCameras()
	}
}

async function handleCameraChange(){
	console.log(cameraSelector.value)
	myStream = await getCameras(cameraSelector.value)

}

async function getCameras(){
	try{
		const devices = await navigator.mediaDevices.enumerateDevices()
		const cameras = devices.filter(device =>{
			return device.kind === "videoinput"
		})

		const currentCamera = myStream.getVideoTracks()[0]
		cameraSelector.innerText = "";
		cameras.forEach(c=>{
			const option = document.createElement("option");
			option.value = c.deviceId;
			option.innerText = c.label;
			if(currentCamera.label == c.label){
				option.selected = true;
			}
			cameraSelector.appendChild(option);
		})
		console.log(devices)
	}catch(e){
		console.log(e);
	}
}

function handleCamera(){
	
	if (!camera){
		cameraBtn.innerText = "Turn Camera ON";
	}else{
		cameraBtn.innerText = "Turn Camera Off";
	}
	camera = !camera
	
	myStream.getVideoTracks().forEach((video)=> {
		video.enabled = camera
	});
}

function handleMute(){
	if (!muted){
		muteBtn.innerText = "Unmute";
	}else{
		muteBtn.innerText = "Mute";
	}
	muted = !muted
	
	myStream.getAudioTracks().forEach((audio)=> {
		audio.enabled = muted
	});
}
muteBtn.addEventListener("click", handleMute);
cameraBtn.addEventListener("click", handleCamera);
cameraSelector.addEventListener("input", handleCameraChange);




// Welcome Form (Join a Room)


const welcome = document.getElementById("welcome")
welcomeForm = welcome.querySelector("form");
let roomName;

async function startMedia(){
	welcome.hidden = true;
	call.hidden = false;
	await getMedia(); //cam, mic , stream등을 호출
	makeConnection();
}

async function handleWelcomeSubmit(e){
	e.preventDefault();
	const input = welcomeForm.querySelector("input")
	await startMedia()
	socket.emit("join_room", input.value);
	roomName = input.value;
	input.value = ""; 
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// 누군가 접속함. A는 로컬 정보 세팅 "offer" 발행
socket.on("welcome", async ()=>{
	console.log("somebody joined");
	const offer = myPeerConnection.createOffer()
	myPeerConnection.setLocalDescription(offer);
	socket.emit("offer", offer, roomName)
})

// B가 "offer" 수신. 로컬/원격 정보 세팅 후 "answer" 발행
socket.on("offer", (offer)=>{
	myPeerConnection.setRemoteDescription(offer);
	const answer =  myPeerConnection.createAnswer();
	myPeerConnection.setLocalDescription(answer);
	socket.emit("answer", answer, roomName);
})

//  A는 "answer" 수신. welcome에서 로컬 세팅만 했으므로 원격 정보도 세팅.
socket.on("answer", (anwer)=>{
	myPeerConnection.setRemoteDescription(offer);
})

//RTC Code;
let myPeerConnection
function makeConnection(){
	const myPeerConnection = new RTCPeerConnection();
	myPeerConnection.addEventListener("icecandidate", handleIce)
	//addStream은 오래된 코드임! 대신..
	myStream.getTracks()
		.forEach((track)=>{
			myPeerConnection.addTrack(track, myStream);
			
		})
}

//icd candidate
function handleIce(data){
	console.log(data);
}
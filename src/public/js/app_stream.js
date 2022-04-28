const socket = io();

const myFace = document.getElementById("myFace");
const cameraBtn = document.getElementById("camera");
const muteBtn = document.getElementById("mute");
const cameraSelector = document.getElementById("cameras");

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


getMedia()

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
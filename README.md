# Noom

Zoom clone using NodeJ, WebRTC and WebSockets.



알아야한다
document.getElementById()
document.querySelector()
createElemenet('태그')
.innerText = ?
append()
.classList.add()

생성한다
babel.config.json
생성한다
nodemon.json

수행한다
npm i nodemon -D
git init
npm i @babel/core @babel/cli @babel/node @babel/presets -D

생성한다
.gitignore

설정한다
nodemon.json
babel.config.json
package.json에 "scripts":{"dev":"nodemon"}

이제 package.json 에 필요한 라이브러리가 모두 들어있다.


dev를 치면 nodemon이 호출될거고, nodemon.json의 exec을 수행
nodemon? exec-> server에 대해 babel-node 명령문을 수행
babel.config.json  우리가 사용할 유일한 preset이 수행


+
npm i express
npm i pug

서버 수행은 npm run dev으로 수행.


ㅡ

기본적으로 적용하는 디자인 - mvp css
<link rel="stylesheet" href=""http://unpkg.com/mvp.css">

nodemon ? 변경이 있으면 자동으로 재시작
babel? 우리가 생서한 코드를 nodejs로 변경



ㅡ



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


ㅡ
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



ㅡ


브라우저의 WebSocket은 button의 .addEventListener("click", function())과 비슷하다.
연결이 되면 "connect", 콜백이 불린다.

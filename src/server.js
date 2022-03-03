import http from 'http'
import express from "express";
import WebSocket from 'ws';
import { SocketAddress } from 'net';

const app = express();

//! 렌더링
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

//! 유저가 서버를 보면 안되기 때문에, 유저가 볼 수 있는 폴더만 공유해주는 일이 express.static
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req,res)=>res.redirect("/"))

const handleListen = () => console.log("Listening on http://localhost:5000")

const server = http.createServer(app)
const wss = new WebSocket.Server({ server})

const sockets = []

wss.on("connection", (socket)=>{
  sockets.push(socket)
  socket["nickname"] = "Anon"
  console.log('sockets',sockets)
  console.log('Connected to Browser')
  socket.send('helloooooo!!')
  socket.on("close", ()=> console.log("Disconnected from the Broswer"))
  socket.on("message", msg =>{
    const message = JSON.parse(msg)
    switch(message.type){
      case "new_message":
        sockets.forEach(aSocket =>{
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        }) 
      case "nickname":
        socket["nickname"] = message.payload
    } 
  })
})
server.listen(5000, handleListen)

import http from 'http'
import express from "express";
import WebSocket from 'ws';

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
const wss = new WebSocket.server({ server})

const handleConnection(socket){
  console.log(socket)
}

wss.on("connection", handleConnection)

server.listen(5000, handleListen)

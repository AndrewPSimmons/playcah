import express, { Express, Request, Response } from "express";
import DB from "./db";
import dotenv from 'dotenv';
const cors = require("cors");
import { Socket, Server } from "socket.io"
import { validateUsername } from "./functions";
import { RoomType, UserType } from "./types";
const APP_PORT = 3001
const SOCKET_PORT = 3002
const ROOM_CODE_LENGTH = 4

const io = new Server(SOCKET_PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
dotenv.config();

const app = express();
app.use(cors())
app.get('/', async (req: Request, res: Response) => {
  res.send('Express + TypeScript Serveee!');
});

app.get("/api/test", async (req: Request, res: Response) => {
  //Req Body will have userName="USENAME"
  const roomCode = await DB.RoomCreate("111", "testing", {}, false)
  res.json(roomCode)
})

app.get("/api/createRoom", async (req: Request, res: Response) => {
  const response: any = {}
  const { username, password } = Object(req.query)

  const with_password = password.length > 0 
  //If a password is present then we set with_password to true
  //Check to see that we have usename
  if (!('username' in req.query)) {
    response["error"] = true
    response["error_code"] = "0000"
    response["message"] = "Missing Username"
    response["data"] = {}
    res.json(response)
    return
  }
  validateUsername(username, res, "1xxx")

  const newUser: UserType = await DB.UserCreate(username)

  //Check to see if user was created succesfully
  if (newUser == null) {
    response["error"] = true
    response["error_code"] = "0000"
    response["message"] = "Issue Creating User"
    response["data"] = {}
    res.json(response)
    return
  }

  //With a new user created we can create the room now
  const newRoom: RoomType = await DB.RoomCreate(newUser._id, username, {}, with_password, password)
  if (newRoom == null) {
    response["error"] = true
    response["error_code"] = "0000"
    response["message"] = "Issue Creating Room"
    response["data"] = {}
    res.json(response)
    return
  }

  response["error"] = false
  response["error_code"] = "0000"
  response["message"] = "User and Room Created Successfully"
  response["data"] = {
    newUser,
    newRoom
    // room_code: newRoom._id,
    // username: username,
    // user_id: userId,
    // host: true
  }
  res.json(response)
})

app.get("/api/joinRoom", async (req: Request, res: Response) => {

})

app.get("/api/validRoomCode", async (req: Request, res: Response) => {
  const roomCode: string = req.query.roomCode as string
  const room = await DB.RoomFindOneById(roomCode.toUpperCase())
  res.json(room !== null)
})


app.listen(APP_PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${APP_PORT}`);
});


io.on("connection", async (socket: Socket) => {
  const data = socket.handshake.query
  const userId = ""
  console.log("new socket connected")
  //Set socketID in user
  await DB.UserUpdateSocketId(userId, socket.id)
})
import express, { Express, query, Request, Response } from "express";
import path from "path";
import DB from "./db";
import dotenv from 'dotenv';
const cors = require("cors");
import { Socket, Server } from "socket.io"
import { drawPlayerNewCards, filterGameDataForPlayer, gameEnd, getGameData, socketRoomEmit, updateGameData, updateRoomData, userLeave, validateUsername } from "./functions";
import { BCardType, BlankWCardType, GamePlayerType, GameSettingsType, GameType, PackNoCardsType, PackWithCardsType, RoomMemberType, RoomType, SubmittedCardObject, UserType, WCardType } from "./types";
import { Document } from "mongoose"
const fs = require('fs')
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
app.get("/.well-known/pki-validation", async (req:Request, res:Response) => {
  fs.readFile(path.join(__dirname, '6D47F73B3DAA2C4244DB6A2D392BDEC5.txt'), 'utf8', (err:Error, data:any) => {
    if (err) {
      throw err;
    }
    res.send(data)
  })
})

const client_urls = ["/room", "/room/*"]
app.get("/", (req, res) => {
  //res.send(path.join(__dirname, "..", "client", "build", "index.html"))
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
 });

 client_urls.forEach((url) => {
  app.use(url, express.static(path.join(__dirname, '../client/build')))
})

app.use(cors())
app.use(express.static(path.join(__dirname, "../client/build")))
// app.use("/static/js", express.static(path.join(__dirname, "../client/build/static/js")))
// app.use("/static/css", express.static(path.join(__dirname, "../client/build/static/css")))
// app.use("/maifest.json", express.static(path.join(__dirname, "../client/build/manifest.json")))

app.get("/api/createRoom", async (req: Request, res: Response) => {
  console.log("creating")
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
  await DB.UserUpdate(newUser._id, "roomCode", newRoom._id)
  response["error"] = false
  response["error_code"] = "0000"
  response["message"] = "User and Room Created Successfully"
  response["data"] = {
    newUser,
    newRoom,
    roomCode: newRoom._id
  }
  console.log("new room", newRoom)
  res.json(response)
})

app.get("/api/joinRoom", async (req: Request, res: Response) => {
  const response: any = {}
  const { roomCode, username, password } = Object(req.query)
  if (roomCode.length == 0) {
    res.send("Bad Room Code")
    return
  }
  if (username.length == 0) {
    res.send("Bad Username")
    return
  }
  const room: RoomType = await DB.RoomFindOneById(roomCode)
  if (room.with_password) {
    if (room.password != password) {
      response["error"] = true
      response["error_code"] = "0000"
      response["message"] = "Incorrect Password"
      response["data"] = {}
      res.json(response)
      return
    }
  }

  const [newUser, hasDupelicate] = await DB.UserCreateUniqueInRoom(username, roomCode)
  console.log("Had dupe",)
  if (hasDupelicate) {
    response["error"] = true
    response["error_code"] = "0000"
    response["message"] = "Duplicate Username"
    response["data"] = {}
    res.json(response)
    return
  }
  const existingRoom = await DB.RoomAddMember(roomCode, newUser._id, newUser.username)

  await DB.UserUpdate(newUser._id, "roomCode", existingRoom._id)

  response["error"] = false
  response["message"] = "User Created and Room Joined Successfully"
  response["data"] = {
    room: existingRoom,
    newUser: newUser,
    roomCode: existingRoom._id
  }
  res.json(response)
})

app.get("/api/validRoomCode", async (req: Request, res: Response) => {
  const roomCode: string = req.query.roomCode as string
  const room = await DB.RoomFindOneById(roomCode.toUpperCase())
  res.json(room !== null)
})
app.get("/api/validUser", async (req: Request, res: Response) => {
  const userId: string = req.query.id as string
  const user = await DB.UserFindOneById(userId)
  res.json(user !== null)
})
app.get("/api/showSocketRooms", (req: Request, res: Response) => {
  console.log(io.sockets.adapter.rooms)
  console.log("====")
  const socketRoomSet = io.sockets.adapter.rooms.get(req.query.roomCode as string)
  if (socketRoomSet == undefined) {
    return
  }
  const socketRoomArr = Array.from(socketRoomSet)

  socketRoomArr.forEach((socketId: string) => {
    const socket = io.sockets.sockets.get(socketId);
  })

  const matchedUsers = socketRoomArr.filter((socketId: string) => {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) return false
    return socket.data.queryData.userId = ""
  })
  res.send(JSON.stringify(io.sockets.adapter.rooms))
})
app.get("/api/roomCodeFromUser", async (req: Request, res: Response) => {
  const userId: string = req.query.userId as string
  const user: UserType = await DB.UserFindOneById(userId)
  if (user === null) {
    res.json(null)
    return
  }
  res.send(user.roomCode)
  //Left off here... Might wantto add roomCode to user. Or find another descrete way use invite links that isnt roomcode
})
app.get("/api/getPackMeta", async (req: Request, res: Response) => {

  const packs = await DB.PackGetMetaInfo()
  packs.sort(function (a, b) {
    return b.card_count - a.card_count;
  });
  res.json(packs)
})

app.get("/api/getGameLog", async (req: Request, res: Response) => {
  try {

    const roomCode = req.query.roomCode as string
    const log = await DB.GameGetVal(roomCode, "log")
    res.json(log)
  } catch (error) {
    res.send("error")
  }
})
// app.get("/api/getPacks", async (req: Request, res: Response)=> {
//   const official = req.query.official
//   if(official === undefined){
//     res.send("Official is blank")
//     return
//   }

//   const packs = await DB.PackGetMetaInfo(official == 'true')
//   res.json(packs)
// })
app.listen(APP_PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${APP_PORT}`);
});

type socketQueryType = {
  userId: string,
  roomCode: string
}



//SOCKET
//
//
//
//
//


interface CustomSocketType extends Socket {

}
io.on("connection", async function (socket: Socket) {
  const socketData: socketQueryType = socket.handshake.query as socketQueryType
  socket.data.queryData = socketData
  socket.join(socketData.roomCode)
  const userId = socketData.userId

  //Set socketID in user
  await DB.UserUpdateSocketId(userId, socket.id)


  io.to(socketData.roomCode).emit("roomData", await DB.RoomFindOneById(socketData.roomCode))

  socket.on("getRoomData", async data => {
    console.log("Getting room data")
    const currentRoomData = await DB.RoomFindOneById(socketData.roomCode)
    socket.emit("roomData", currentRoomData)
  })
  socket.on("doDisconnect", data => {
    socket.disconnect(true)
  })
  socket.on("disconnect", data => {
    const checkExOut = async (userId: string, roomCode: string) => {
      //Get the socket room sockets so we can loop through it later
      const socketRoomSet = io.sockets.adapter.rooms.get(roomCode)

      if (socketRoomSet == undefined) {
        /* 
        This use case is for when only one person is in the room (host) and they leave... leaving the roomCode to not exist anymore in the socket rooms
        This causes an error since it's undefined
        */
        console.log("[Alert] Socket RoomSet is undefined in 'socket.on(dosconnect)'")
        await DB.RoomDeleteById(roomCode)
        await DB.UserDeleteById(userId)
        return
      }

      //If the socket room exists them we find a socket that has the same userId as the socket that disconnected
      const socketRoomArray = Array.from(socketRoomSet)
      const matchedUsers = socketRoomArray.filter((socketId: string) => {
        const socket = io.sockets.sockets.get(socketId);
        if (!socket) return false
        return socket.data.queryData.userId == userId
      })
      //If there is a socket match... mening the length of matched users is > 0 then we just return since the user is still playing aka a refresh
      if (matchedUsers.length > 0) {
        return
      }


      //Since there is no matched user we need to now go to the DB and grab the user from the room.
      const room: RoomType = await DB.RoomFindOneById(roomCode)
      const memberArray: RoomMemberType[] = room.members.filter((member: RoomMemberType) => {
        return member._id == userId
      })

      const member = memberArray[0] //Member from room


      switch (member.is_host) {

        /*
          If member is host them close the whole room
          If member is not host then just leave
        */
        case true:
          io.to(roomCode).emit("roomClosed")
          room.members.forEach(async (member: RoomMemberType) => {
            await DB.UserDeleteById(member._id)
          })
          await DB.RoomDeleteById(roomCode)

        case false:
          await userLeave(io, roomCode, userId)
          await updateRoomData(io, roomCode)
          console.log("updating room data")
        default:
          break;
      }
    }
    setTimeout(() => {
      checkExOut(socketData.userId, socketData.roomCode)
    }, 3500)
  })
  socket.on("test", data => {
    console.log("test socket.on in server: ", data)
  })
  socket.on("closingRoom", async (data) => {
    const room: RoomType = await DB.RoomFindOneById(socketData.roomCode)
    if (room.inGame) {
      await gameEnd(socketData.roomCode)
    }
    room.members.forEach(async (member: RoomMemberType) => {
      await DB.UserDeleteById(member._id)
    })
    await DB.RoomDeleteById(socketData.roomCode)
    io.to(socketData.roomCode).emit("roomClosed")
  })
  socket.on("leavingRoom", async data => {
    console.log("recieved emit to lvae room")
    await userLeave(io, socketData.roomCode, socketData.userId)
    await updateRoomData(io, socketData.roomCode)
  })

  socket.on("sendingMessage", data => {
    console.log(`[CHAT: ${socketData.roomCode}] ${data.username} - ${data.message}`)
    io.to(socketData.roomCode).emit("newMessage", data)
  })

  socket.on("updatingPacks", async data => {
    if (data.retain == true) {
      //Add pack
      console.log("adding data")
      await DB.RoomAddPack(socketData.roomCode, data)
      updateRoomData(io, socketData.roomCode)
    }
    else {
      //Remove pack
      console.log("removing data")
      await DB.RoomRemovePack(socketData.roomCode, data)
      updateRoomData(io, socketData.roomCode)
    }
  })

  socket.on("updatingGameSettings", async data => {
    await DB.RoomUpdateKey(socketData.roomCode, "gameSettings", data)
    updateRoomData(io, socketData.roomCode)
  })

  socket.on("updatingRoomSettings", async data => {
    await DB.RoomUpdateKey(socketData.roomCode, "roomSettings", data)
    updateRoomData(io, socketData.roomCode)
  })
  /* 
    Player contains {
      _id: userId,
      username: string,
      is_host: boolean,
      hand: WCardType[],
      score: number,

    }
  */
  //Creates the game object in database then emits the gameId go client
  socket.on("startingGame", async data => {
    //Methods for Drawing (drawCards(maxCardLimit, numberofplayers, deck, only1) => 2d array [[play1Cards], [player2Cards]])
    let initJudgeId = ""
    //console.log(data)
    //Genereate Black Cards
    const [firstBlackCard, BCardID] = await DB.BCardDraw(data.packs.map((pack: any) => pack.pack_id), [], data.gameSettings.blackCardOnlyPickOne)
    console.log("black card", firstBlackCard)
    //Generate White Cards
    const [firstHands, usedIDs] = await DB.WCardDrawHands(data.members.length, data.gameSettings.handLimit, data.packs.map((pack: any) => pack.pack_id), [])
    //Generate Players
    const players = data.members.map((member: RoomMemberType, i: number) => {
      if (member.is_host) {
        console.log("===Settings judge id to: ", member._id)
        initJudgeId = member._id
      }
      return { ...member, hand: firstHands[i], score: 0, blanksUsed: 0 }
    })
    let BCardSum = 0
    let WCardSum = 0
    const packs: PackNoCardsType[] = data.packs.map((pack: any) => {
      BCardSum += pack.black_card_count
      WCardSum += pack.white_card_count
      delete pack["retain"]
      return pack
    })

    const packIDArray = packs.map((pack: PackNoCardsType) => {
      return pack.pack_id
    })

    const gameId = await DB.GameCreate(
      socketData.roomCode,
      players,
      data.gameSettings,
      initJudgeId,
      firstBlackCard,
      packs,
      WCardSum,
      BCardSum,
      packIDArray,
      usedIDs as number[],
      BCardID as number
    )
    console.log("gameId: ", gameId)
    await DB.RoomUpdateKey(socketData.roomCode, "inGame", true)
    await DB.RoomUpdateKey(socketData.roomCode, "gameID", gameId)
    updateRoomData(io, socketData.roomCode)
    //socketRoomEmit(io, socketData.roomCode, "gameStart", gameId)
  })

  socket.on("endingGame", async data => {
    await gameEnd(socketData.roomCode)
    updateRoomData(io, socketData.roomCode)
    socketRoomEmit(io, socketData.roomCode, "gameEnded")

  })
  //Once client recieves game id... state changes and <Game/> comp renders... wich will trigger
  //A use effect which will emit "enteringGame" and grab game state and appropriate data
  socket.on("enteringGame", async data => {
    const game: GameType = await DB.GameFindOneById(data)
    const filteredData = await filterGameDataForPlayer(game, socketData.userId)
    socket.emit("gameEntered", filteredData)
    //getGameData(io, socket.id, socketData.userId)
  })
  socket.on("submittingCards", async (data: SubmittedCardObject) => {
    await DB.GameAddSubmitedCards(socketData.roomCode, data)
    await DB.GameRemoveSummitedCardsFromPlayerHand(socketData.roomCode, data)
    await drawPlayerNewCards(data, socketData.roomCode)
    const players: any = await DB.GameGetVal(socketData.roomCode, "players")
    const allSub: any = await DB.GameGetVal(socketData.roomCode, "submittedCards")
    if (allSub.length == players.length - 1) {
      //We now change it up to judge time
      console.log("all cards submitted")
      await DB.GameUpdateKey(socketData.roomCode, "gameState", "judge")
    }

    await updateGameData(io, socketData.roomCode)

  })
  socket.on("selectingWinner", async data => {

    
    await DB.GameLogRound(socketData.roomCode, data)
    await DB.GameUpdateBlankCards(socketData.roomCode)
    await DB.GameIncrementWinnerScore(socketData.roomCode, data)
    await DB.GameNewBlackCard(socketData.roomCode)

    await DB.GameUpdateKey(socketData.roomCode, "gameState", "submit")
    await DB.GameUpdateJudge(socketData.roomCode)

    await updateGameData(io, socketData.roomCode)

    //
  })
})
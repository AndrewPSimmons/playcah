import { Express, Request, Response } from "express";
import { Server } from "socket.io"
import DB from "./db";
import { BlankWCardType, GamePlayerType, GameType, SubmittedCardObject, UserType, WCardType } from "./types";
import {  Document } from 'mongoose';

/* 

_id: null,
roomCode: null,
settings: null,
round: null,
gameState: null,
cardsOnTable: null,
judgeId: null,
blackCard: null,
players: null,
*/

// left off getting data filtered out for a specific userid
export const drawPlayerNewCards = async (submitted: SubmittedCardObject, roomCode: string) => {
    const game:GameType & Document = await DB.GameFindOneByRoomCode(roomCode)
    const cardCount = submitted.cards.length
    const [newCards, cardIDs] = await DB.WCardDrawCards(cardCount, game.packIDArray, game.usedWhiteCards)

    const oldPlayers = game.players
    const newPlayers = oldPlayers.map((player)=> {
        if(player._id != submitted.userId){
            return player
        }
        const newHand = [...player.hand, ...newCards]
        player.hand = newHand
        return player
    })

    game.usedWhiteCards = [...game.usedWhiteCards, ...cardIDs]
    game.players = []
    game.players = newPlayers
    await game.save()
    return
}
export const gameEnd = async (roomCode: string) => {
    await DB.RoomUpdateKey(roomCode, "inGame", false)
    await DB.RoomUpdateKey(roomCode, "gameID", null)
    await DB.GameDeleteByRoomCode(roomCode)
}
export const filterGameDataForPlayer = async (game: GameType, userId: string, spliceEndPoint: number = 0) => {
    const newPlayers = game.players.map((player: GamePlayerType) => {
        if (player._id != userId) {
            return { ...player, hand: "hidden" }
        }
        return player
    })

    let calculatedCardsOnTable = {}
    if (game.gameState == "submit") {
        calculatedCardsOnTable = game.submittedCards.map((cardSet: SubmittedCardObject) => {
            //Loop through cardSet for each card and hide text
            const hiddenCards: (WCardType | BlankWCardType)[] = cardSet.cards.map((card: any) => {
                return { ...card, text: "hidden" }
            })
            return { ...cardSet, cards: hiddenCards }
        })
    }

    //Randomize order so no one can predict it
    if (game.gameState == "judge") {
        const submitted = [...game.submittedCards]
        const removed = submitted.splice(0, spliceEndPoint)
        calculatedCardsOnTable = submitted.concat(removed)
    }
    const gameData = {
        _id: game._id,
        roomCode: game.roomCode,
        settings: game.settings,
        round: game.round,
        gameState: game.gameState,
        cardsOnTable: calculatedCardsOnTable,
        judgeId: game.judgeId,
        blackCard: game.blackCard,
        players: newPlayers
    }
    //const newPlayers = game.players.filter
    return gameData
}
export const getGameData = async (io: Server, socketID: string, userId: string) => {
}

export const updateGameData = async (io: Server, roomCode: string) => {
    //Get socketId and userId for each member in room
    //Emit filterGameDataForPlayer to each socket
    const game:GameType = await DB.GameFindOneByRoomCode(roomCode)
    console.log("game in updateGameData", game)
    const users: any = await DB.UserFindManyByRoomCode(roomCode)
    const randomFirstIndex = Math.floor(Math.random() * (game.players.length))
    users.forEach(async (user: UserType) => {
        const dataToEmit = await filterGameDataForPlayer(game, user._id, randomFirstIndex)
        io.to(user.socket_id).emit("gameNewData", dataToEmit)
    })

}
export const socketRoomEmit = async (io: Server, roomCode: string, msg: string, data: any = {}) => {
    console.log("emit to", roomCode, msg, data)
    io.to(roomCode).emit(msg, data)
}
export const updateRoomData = async (io: Server, roomCode: string) => {
    io.to(roomCode).emit("roomData", await DB.RoomFindOneById(roomCode))
}
export const userLeave = async (io: Server, roomCode: string, userId: string) => {
    const user: UserType = await DB.UserFindOneById(userId)
    const socketById = io.sockets.sockets.get(user.socket_id);
    await DB.RoomRemoveMember(roomCode, userId)
    await DB.UserDeleteById(userId)
    if (socketById == undefined) {
        console.log("[ERROR] in userLeave no matching socket",)
        return "no socket"
    }
    socketById.emit("roomLeft")
    return

}
export const validateUsername = (username: string, res: Response, error_code: string) => {
    let response: any = {}
    if (username.length == 0) {
        response["error"] = true
        response["error_code"] = error_code
        response["massage"] = "Empty Username"
        response["data"] = { "room_created": false }
    }

    if (response["error"]) {
        res.send(JSON.stringify(response))
    }
}

export const getSocketRoomData = async (roomCode: string) => {
    let roomData = {
        members: [],
        settings: {}
    }
    /* 
    In this function we are going to update the room data
    Data to update:
    1. Members
    2. Settings
    */
    const room = await DB.RoomFindOneById(roomCode)
    return room

    // Room.findOne({ _id: room_code }, (err, doc) => {
    //     if (err) { console.error(err); return }
    //     room_data.members = doc.members
    //     room_data.settings = doc.settings
    //     io.to(room_code).emit("update_room_data", room_data)
    //     //console.log("NEW ROOM DATA: ", room_data)
    // })

}
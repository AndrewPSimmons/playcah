import { model, Schema, Model, Document, connect, connection, Types, Error, ObjectId } from 'mongoose';

import models, { User, Game, Room, Pack, Bcard, Wcard } from './models';
import { UserType, RoomType, PackWithCardsType, PackNoCardsType, WCardType, BCardType, GameType, SubmittedCardObject, BlankWCardType, GamePlayerType } from './types';
class DatabaseClass {
    db: typeof connection
    constructor() {
        const dbURI = "mongodb+srv://andrewDBMaster:7242acSimmons@cluster0.edqxy.mongodb.net/cah"
        connect(dbURI)
        const db = connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log("DATABASE CONNECTED")
        });
        this.db = db
    }
    newObjectId() {
        const id = new Types.ObjectId().toString()
        return id
    }

    async newRoomCode(length: number = 6) {
        let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        while (!Room.exists({ _id: result })) {
            result = await this.newRoomCode()
        }
        return result;
    }
    //User Functions
    //==============
    async UserCreate(username: string) {
        try {
            const id = this.newObjectId()
            console.log("ID!!!\n======", id)
            const newUser: any = new User({ _id: id, username: username, socket_id: null })
            const saveUser = await newUser.save()
            return newUser
        } catch (err) {
            return null
        }
    }
    async UserCreateUniqueInRoom(username: string, roomCode: string) {
        const room = await this.RoomFindOneById(roomCode)
        const roomMembes = room.members
        const dupes = roomMembes.filter((member: any) => {
            return member.username == username
        })
        if (dupes.length > 0) {
            return [null, true]
        }
        const newUser = await this.UserCreate(username)
        return [newUser, false]
    }
    async UserDeleteById(userId: string) {
        async function doDelete() {
            return await User.deleteOne({ _id: userId }, (err: Error, user: UserType) => {
                if (err) { console.error(err) }
            }).clone()
        }
        const resp = await doDelete()
        return resp.deletedCount == 1
    }
    async UserFindManyByRoomCode(roomCode: string) {
        try {
            const users = await User.find({ roomCode: roomCode }, (err: Error, doc: UserType[]) => {
                if (err) { console.error(err) }
                return doc
            }).clone()
            return users
        } catch (error) {
            console.log("[ERROR]", error)
        }
    }
    async UserFindOneById(userId: string) {
        try {
            const user = await User.findOne({ _id: userId }, (err: Error, doc: UserType) => {
                if (err) { console.error(err) }
                return doc
            }).clone()
            return user
        } catch (err) {
            return null
        }
    }
    async UserFindOneByUsername(username: string) {
        const user = await User.findOne({ username: username }, (err: Error, doc: UserType) => {
            if (err) { console.error(err) }
            return doc
        }).clone()
        return user
    }
    async UserUpdate(userId: string, key: string, val: any) {
        const user = await this.UserFindOneById(userId)
        user[key] = val
        await user.save()
    }
    async UserUpdateSocketId(userId: string, socketId: string) {
        const user = await this.UserFindOneById(userId)
        user.socket_id = socketId
        await user.save()
    }
    //Room Functions
    //==============
    async RoomCreate(userId: string, username: string, settings: any, with_password: boolean, password: string = "") {
        try {
            const roomCode = await this.newRoomCode()
            const newRoom: any = new Room({
                _id: roomCode,
                inGame: false,
                gameID: null,
                host: userId,
                with_password: with_password,
                password: password,
                members: [
                    {
                        _id: userId,
                        username: username,
                        is_host: true
                    }
                ],
                gameSettings: {
                    handLimit: 8,
                    useBlankCards: true,
                    blankCardCount: 5,
                    victoryLimit: 10,
                    blackCardOnlyPickOne: false
                },
                roomSettings: {
                    muteNonPlayers: false,
                },
                settings: settings
            })
            const saveRoom = await newRoom.save()
            return newRoom
        } catch (err) {
            return null
        }
    }
    async RoomAddMember(roomCode: string, userId: string, username: string) {
        const room = await this.RoomFindOneById(roomCode)
        room.members.push({
            _id: userId,
            username: username,
            is_host: false
        })
        await room.save()
        return room
    }
    async RoomRemoveMember(roomCode: string, userId: string) {
        console.log(roomCode, "room code -<")
        const room = await this.RoomFindOneById(roomCode)
        console.log("\n\nroom", room, "\n\n")
        const newMembers = room.members.filter((member: any) => {
            return member._id !== userId
        })
        console.log("\n\n\nNew Members\n=====\n", newMembers)
        room.members = newMembers
        console.log("\n\n\nNew Room\n=====\n", room)
        await room.save()
    }

    async RoomFindOneById(_id: string) {
        let room = undefined
        try {
            room = await Room.findOne({ _id: _id }, (err: Error, doc: UserType) => {
                if (err) { console.error(err) }
                return doc
            }).clone()
        } catch (error) {
            console.error(error)
            return null
        }
        return room
    }
    async RoomDeleteById(_id: string) {
        async function doDelete() {
            return await Room.deleteOne({ _id: _id }, (err: Error, room: UserType) => {
                if (err) { console.error(err) }
            }).clone()
        }
        const resp = await doDelete()
        return resp.deletedCount == 1
    }

    async RoomAddPack(roomCode: string, pack: PackWithCardsType) {
        const room = await this.RoomFindOneById(roomCode)
        room.packs.push(pack)
        //room.markModified("packs")
        await room.save()
    }
    async RoomRemovePack(roomCode: string, packToRemove: PackWithCardsType) {
        const room = await this.RoomFindOneById(roomCode)
        const packs = room.packs
        const newPacks = packs.filter((pack: PackWithCardsType) => {
            return pack.pack_id != packToRemove.pack_id
        })
        room.packs = newPacks
        await room.save()
    }

    async RoomUpdateKey(roomCode: string, key: string, val: any) {
        const room = await this.RoomFindOneById(roomCode)
        room[key] = val
        await room.save()
    }

    //Game Functions
    async GameCreate(roomCode: string, players: any, settings: any, initJudgeId: string, initBlackCard: any, packs: PackNoCardsType[], WCardSum: number, BCardSum: number, packIDArray: number[], usedWCardsIDArray: number[], firstBlackCardID: number) {
        console.log("In game create")
        try {
            const id = this.newObjectId()
            const newGame: any = new Game(
                {
                    _id: id,
                    roomCode,
                    players,
                    settings: settings,
                    round: 1,
                    gameState: "submit",
                    judgeId: initJudgeId,
                    blackCard: initBlackCard,
                    submittedCards: [],
                    WCardCount: WCardSum,
                    BCardCount: BCardSum,
                    usedWhiteCards: usedWCardsIDArray,
                    usedBlackCards: [firstBlackCardID],
                    packs,
                    packIDArray
                }
            )
            const saveGame = await newGame.save()
            return id
        } catch (err) {
            return null
        }
    }
    async GameFindOneById(gameId: string) {
        let game = undefined
        try {
            game = await Game.findOne({ _id: gameId }, (err: Error, doc: UserType) => {
                if (err) { console.error(err) }
                return doc
            }).clone()
        } catch (error) {
            console.error(error)
            return null
        }
        return game
    }
    async GameFindOneByRoomCode(roomCode: string) {
        let game = undefined
        try {
            game = await Game.findOne({ roomCode: roomCode }, (err: Error, doc: UserType) => {
                if (err) { console.error(err) }
                return doc
            }).clone()
        } catch (error) {
            console.error(error)
            return null
        }
        return game
    }
    async GameDeleteById(gameId: string) {
        async function doDelete() {
            return await Game.deleteOne({ _id: gameId }, (err: Error, doc: any) => {
                if (err) { console.error(err) }
                return doc.deletedCount == 1
            }).clone()
        }
        const resp = await doDelete()
        return resp.deletedCount == 1
    }
    async GameDeleteByRoomCode(roomCode: string) {
        async function doDelete() {
            return await Game.deleteOne({ roomCode: roomCode }, (err: Error, doc: any) => {
                if (err) { console.error(err) }
                return doc.deletedCount == 1
            }).clone()
        }
        const resp = await doDelete()
        return resp.deletedCount == 1
    }
    async GameAddSubmitedCards(roomCode: string, cardObject: SubmittedCardObject) {
        const game: GameType & Document = await this.GameFindOneByRoomCode(roomCode)
        game.submittedCards.push(cardObject)
        await game.save()
        // room[key] = val
        // await room.save()
    }
    
    async GameNewBlackCard(roomCode: string){
        try {
            const game: GameType & Document = await this.GameFindOneByRoomCode(roomCode)
            const [card, id]: any= await this.BCardDraw(game.packIDArray, game.usedBlackCards, game.settings.blackCardOnlyPickOne)
            game.blackCard = card 
            game.usedBlackCards.push(id)

            game.save()
        } catch (error) {
            
        }
    }
    async GameUpdateJudge(roomCode:string){
        try {
            const game: GameType & Document = await this.GameFindOneByRoomCode(roomCode)
            const newJudge = game.players[game.round%game.players.length]
            console.log(newJudge.username)

            game.round += 1
            game.judgeId = newJudge._id

            game.submittedCards = []
            game.markModified("round")
            game.markModified("submittedCards")
            game.markModified("judgeId")
            await game.save()
            return 

        } catch (error) {
            
        }
    }
    async GameIncrementWinnerScore(roomCode: string, winningCards: SubmittedCardObject){
        try {
            const game:GameType & Document = await this.GameFindOneByRoomCode(roomCode)
            const oldPlayers = game.players
            const newPlayers = oldPlayers.map((player: GamePlayerType)=> {
                if(player._id != winningCards.userId){return player}
                player.score += 1
                return player
            })
            game.players = []
            game.players = newPlayers
            game.markModified("players")
            await Game.updateOne({roomCode: roomCode},   {'$set': {
                'players': newPlayers
            }}, function(err: Error) {
               console.log(err)
            }).clone()

        } catch (error) {
            console.log("Error in GameIncrementWinnerScore")
            console.error(error)
        }
    }
    async GameUpdateBlankCards(roomCode: string) {
        try {
            const game: GameType & Document = await this.GameFindOneByRoomCode(roomCode)
            const subCards = game.submittedCards
            const oldPlayers = game.players
            //Loop through old players and return player object with updated blanksUsed field based on number of blanks in submitted cards field on game
            const newPlayers = oldPlayers.map((player: GamePlayerType) => {
                const handWithBlanks = subCards.find(el => el.userId == player._id && el.cards.filter(card => card._id == "blank").length > 0)
                if (!handWithBlanks) {
                    return player
                }
                const blankCount = handWithBlanks.cards.filter((card: WCardType) => card._id == "blank").length

                player.blanksUsed += blankCount
                return player
            })
            game.players = []
            game.players = newPlayers

            await game.save()
            return
        } catch (error) {
            console.log("Error in GameUpdateBlankCards")
            console.error(error)
        }
        // subCards.forEach((subs:SubmittedCardObject)=>{
        //    subs.cards.forEach((card:WCardType)=>{
        //        if(card._id=="blank"){
        //            blankMap[subs.userId] += 1
        //        }
        //    })
        // })
        // console.log(blankMap)
        // const newPlayers = oldPlayers.map((player: GamePlayerType) => {
        //     // console.log("cardss", subCards.map((subObj: SubmittedCardObject) => subObj.cards).map((cardArray) => cardArray.map((card) => card._id)).map(arr => arr[0]))
        // })
    }
    async GameRemoveSummitedCardsFromPlayerHand(roomCode: string, cardObject: SubmittedCardObject) {
        const cardIds = cardObject.cards.map((card: WCardType) => {
            return card.id
        })
        const game: GameType & Document = await this.GameFindOneByRoomCode(roomCode)
        const oldPlayers = game.players
        const newPlayers = oldPlayers.map((player) => {
            if (player._id != cardObject.userId) {
                return player
            }
            const newHand = player.hand.filter((card) => {
                return !cardIds.includes(card.id)
            })
            player.hand = newHand
            return player
        })
        game.players = []
        game.players = newPlayers

        await game.save()
    }

    async GameGetVal(roomCode: string, key: keyof GameType) {
        const game: GameType = await this.GameFindOneByRoomCode(roomCode)
        return game[key]
    }

    async GameUpdateKey(roomCode: string, key: string, val: any) {
        const game = await this.GameFindOneByRoomCode(roomCode)
        game[key] = val
        await game.save()
    }
    async GameLogRound(roomCode: string, winningData: any) {
        const game: GameType & Document = await this.GameFindOneByRoomCode(roomCode)

        const newEntry = {
            judge: game.players.filter((player: GamePlayerType) => player._id == game.judgeId)[0],
            winningData: winningData,
            table: game.submittedCards
        }
        game.log.push(newEntry)
        await game.save()
        return

    }
    //Pack Function
    //=============
    async PackGetMetaInfo() {
        let filter = {}
        //"name pack_id card_count official white_card_count black_card_count"
        const packs = await Pack.find(filter, 'name pack_id card_count official white_card_count black_card_count', (err: Error, doc: any) => {
            if (err) { console.error(err) }
            return doc
        }).clone()
        return packs
    }
    //Black Card FUncions
    async BCardDraw(packIDArray: number[], usedBCards: number[], onlyPickOne: boolean) {
        const match: any = {
            pack: { $in: packIDArray },
            id: { $nin: usedBCards }
        }
        if (onlyPickOne) {
            match.pick = 1
        }
        const blackCard: BCardType[] = await Bcard.aggregate([
            {
                $match: match
            }, {
                $sample: { size: 1 }
            }
        ], (err: Error, doc: BCardType) => {
            if (err) { console.error(err) }
            return doc
        })
        return [blackCard[0], blackCard[0].id]
    }

    //White Card Function
    async WCardDraw() {
        const whiteCard = await Wcard.findOne({}, (err: Error, doc: any) => {
            if (err) { console.error(err) }
            return doc
        }).clone()
        return whiteCard
    }
    async WCardDrawCards(cardsNeeded: number, packIDArray: number[], usedWCards: number[]) {
        //db.wcards.aggregate([{$match: {pack: {$in: [1]}}}, { $sample: { size: 3 } }])
        /* 
        db.wcards.aggregate(
            [
                {
                    $match: {
                        pack: {
                            $in: [1]
                        },
                        id: {
                            $nin: usedWCards
                        }
                    }
                }, 
                { 
                    $sample: { 
                        size: 3 
                    } 
                }
            ]
            )
        */
        const whiteCards = await Wcard.aggregate([
            {
                $match: {
                    pack: { $in: packIDArray },
                    id: { $nin: usedWCards }
                }
            }, {
                $sample: { size: cardsNeeded }
            }
        ], (err: Error, doc: any) => {
            if (err) { console.error(err) }
            return doc
        })

        //[1,2,3,4,5,6]
        //[[1,2,3], [4,5,6]]
        //[[1,3,5],[2,4,6]]
        const usedIDs = whiteCards.map((card: WCardType) => card.id)
        return [whiteCards, usedIDs]
    }
    async WCardDrawHands(playerCount: number, cardsPerHand: number, packIDArray: number[], usedWCards: number[]) {
        //db.wcards.aggregate([{$match: {pack: {$in: [1]}}}, { $sample: { size: 3 } }])
        /* 
        db.wcards.aggregate(
            [
                {
                    $match: {
                        pack: {
                            $in: [1]
                        },
                        id: {
                            $nin: usedWCards
                        }
                    }
                }, 
                { 
                    $sample: { 
                        size: 3 
                    } 
                }
            ]
            )
        */
        const cardsNeeded = playerCount * cardsPerHand
        const whiteCards = await Wcard.aggregate([
            {
                $match: {
                    pack: { $in: packIDArray },
                    id: { $nin: usedWCards }
                }
            }, {
                $sample: { size: cardsNeeded }
            }
        ], (err: Error, doc: any) => {
            if (err) { console.error(err) }
            return doc
        })

        //[1,2,3,4,5,6]
        //[[1,2,3], [4,5,6]]
        //[[1,3,5],[2,4,6]]
        const hands: Array<WCardType[]> = []
        for (let index = 0; index < playerCount; index++) {
            hands.push([])
        }
        for (let index = 0; index < whiteCards.length; index++) {
            const card = whiteCards[index];
            const handIDX = index % playerCount

            hands[handIDX].push(card as never)
        }
        const usedIDs = whiteCards.map((card: WCardType) => card.id)
        return [hands, usedIDs]
    }
}
const DB = new DatabaseClass
export default DB
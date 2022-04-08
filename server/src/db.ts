
import { model, Schema, Model, Document, connect, connection, Types, Error, ObjectId } from 'mongoose';
import models, { User, Game, Room } from './models';
import { UserType } from './types';
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
            const newUser: any = new User({ _id: id, username: username, socket_id: null })
            const saveUser = await newUser.save()
            return newUser
        } catch (err) {
            return null
        }
    }
    async UserCreateUnique(username: string) {
        const alreadyExistingUser = await this.UserFindOneByUsername(username)
        if (alreadyExistingUser) {
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
    async UserFindOneById(userId: string) {
        const user = await User.findOne({ _id: userId }, (err: Error, doc: UserType) => {
            if (err) { console.error(err) }
            return doc
        }).clone()
        return user
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
                current_game_id: null,
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
                settings: settings
            })
            const saveRoom = await newRoom.save()
            console.log("saveRoom:", saveRoom)
            return newRoom
        } catch (err) {
            return null
        }
    }
    async RoomFindOneById(_id: string) {
        const room = await Room.findOne({ _id: _id }, (err: Error, doc: UserType) => {
            if (err) { console.error(err) }
            return doc
        }).clone()
        return room
    }
    //Game Function
    //=============
    async GameCreate() {
        try {
            const id = this.newObjectId()
            const newGame: any = new User({ _id: id })
            const saveGame = await newGame.save()
            return id
        } catch (err) {
            return null
        }
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


}
const DB = new DatabaseClass
export default DB
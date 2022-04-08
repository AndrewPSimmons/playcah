import { model, Schema, Model, Document, connect, connection, Types, Error, ObjectId } from 'mongoose';

export type RoomMemberType = {
    _id: string,
    username: string,
    is_host: boolean
}

export type RoomType = {
    _id: string,
    current_game_id: string,
    host: string,
    with_passwords: boolean,
    members: Array<RoomMemberType>,
    settings: {
        game_settings: any,
        mute_nonplayers: boolean
    }
}

export type GameType = {
    _id: string,

}


export type UserType = {
    _id: string,
    username: string,
    socket_id: string,
    createdAt: string,
    updatedAt: string
}

export type WCardType = {
    _id: ObjectId | string,
    text: string,
    pack: number,
    id: number

}

export type BCardType = {
    _id: ObjectId | string,
    pick: number,
    pack: number,
    id: number
}


export type PackWithCardsType = {
    _id: ObjectId | string,
    name: string,
    white: Array<WCardType>,
    black: Array<BCardType>,
    official: boolean,
    pack_id: number,
    card_count: number,
    white_card_count: number,
    black_card_count: number
}


export type PackNoCardsType = {
    _id: ObjectId | string,
    name: string,
    pack_id: number,
    card_count: number,
    white_card_count: number,
    black_card_count: number
}

import { model, Schema, Model, Document, connect, connection, Types, Error, ObjectId } from 'mongoose';

export type GameSettingsType = {
    handLimit: number,
    useBlankCards: boolean,
    blankCardCount: number,
    victoryLimit: number,
    blackCardOnlyPickOne: boolean,
}
enum GameStateEnum {
    submit = "submit",
    judge = "judge"
}
export interface GamePlayerType extends RoomMemberType {
    score: number,
    hand: WCardType[],
    blanksUsed: number
}
export type SubmittedCardObject = {
    userId: string,
    uesrname: string,
    cards: (WCardType | BlankWCardType)[]
}
export type GameLogType = {
    judge: GamePlayerType,
    winningData: SubmittedCardObject,
    table: SubmittedCardObject[]
}
/* 
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
*/
export type GameType = {
    _id: string,
    roomCode: string,
    players: GamePlayerType[],
    settings: GameSettingsType,
    round: number,
    gameState: GameStateEnum,
    judgeId: string,
    blackCard: BCardType,
    submittedCards: SubmittedCardObject[],
    WCardCount: number,
    BCardCount: number,
    usedWhiteCards: number[],
    usedBlackCards: number[],
    packs: GameLogType[],
    packIDArray: number[],
    log: GameLogType[]
}

export type RoomMemberType = {
    _id: string,
    username: string,
    is_host: boolean
}

export type RoomType = {
    _id: string,
    inGame: boolean,
    gameID: string,
    host: string,
    with_password: boolean,
    password: string,
    members: Array<RoomMemberType>,
    settings: {
        game_settings: any,
        mute_nonplayers: boolean
    }
}


export type UserType = {
    _id: string,
    username: string,
    roomCode: string
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
export interface BlankWCardType extends WCardType {
    isBlank: boolean,
    oldId: number
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
    official: boolean,
    card_count: number,
    white_card_count: number,
    black_card_count: number
}


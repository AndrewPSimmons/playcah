import { BCardType } from "../../src/types"

export type gameSettingsType = {
    blackCardOnlyPickOne: false
    blankCardCount: 5,
    handLimit: 8,
    useBlankCards: true
    victoryLimit: 10        
}//"_id","text","pick","pack","id"]
export type blackCardType = {
    _id: string,
    text: string,
    pick: number,
    pack: number,
    id: number
}
export type whiteCardType = {
    _id: string,
    text: string,
    pack: number,
    id: number,
    isBlank?: boolean,
    oldId?: number
}
export enum gameStateEnum{
    submit = "submit",
    judge = "judge"
}
export interface blankCardType extends whiteCardType{
    isBlank: boolean,
    oldId: number
}
export interface playerType extends memberType {
    hand: whiteCardType[],
    score: number
}
export type gameType = {
    _id: string | null,
    roomCode: string | null,
    settings: gameSettingsType | null,
    round: number | null,
    gameState: gameStateEnum | null,
    cardsOnTable: whiteCardType[][] | null,
    judgeId: string | null,
    blackCard: blackCardType | null,
    players: playerType[] | null,
}
export type packType = any
export type memberType = {
    _id: string,
    username: string,
    is_host: boolean,
    roomCode: string
}
export type messageType = {
    username: string,
    message: string
}
export type userType = {
    _id: string,
    username: string,
    isHost: boolean,
    roomCode: string
}
export type roomType = {
    roomCode: string,
    members: memberType[],
    inGame: boolean,
    gameID: string,
    packs: packType[],
    gameSettings: {
        handLimit: number,
        useBlankCards: boolean,
        blankCardCount: number,
        victoryLimit: number,
        blackCardOnlyPickOne: boolean
    },
    roomSettings: {
        muteNonPlayers: boolean
    }
}
export type stateType = {
    user: userType,
    room: roomType,
    game: gameType,
    chat: {
        messages: messageType[]
    }
}
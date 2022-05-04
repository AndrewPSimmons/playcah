import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    socket_id: String,
    roomCode: String
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)

const roomSchema = new mongoose.Schema({
    _id: String,
    host: String,
    with_password: Boolean,
    password: String,
    members: [{ _id: String, username: String, is_host: Boolean }],
    packs: Array,
    gameSettings: Object,
    roomSettings: Object,
    inGame: Boolean,
    gameID: String,
    settings: { game_settings: Object, room_settings: Object }
    // {
    //     mute_nonplayers: Boolean,
    //     blank_card_limit: Number,
    //     hand_limit: Number,
    //     victory_number: Number,
    //     round_limit: Number
    // }
})
export const Room = mongoose.model("Room", roomSchema)
/*

[1]     handLimit: 6,
[1]     useBlankCards: true,
[1]     blankCardCount: 6,
[1]     victoryLimit: 13,
[1]     blackCardOnlyPickOne: true */
const gameSchema = new mongoose.Schema({
    _id: String,
    roomCode: String,
    settings: Object,
    // {
    //     handLimit: Number,
    //     useBlankCards: Boolean,
    //     blankCardCount: Number,
    //     victoryLimit: Number,
    //     blackCardOnlyPickOne: Boolean,
    // },
    round: Number,
    gameState: String,
    judgeId: String,
    blackCard: Object, //BCardType
    players: [Object], //This will be an array of objects
    /*Players contains 
        Hands
        Score
    */
    submittedCards: Array,
    //Card Info
    WCardCount: Number,
    BCardCount: Number,
    whiteCards: Array,
    usedWhiteCards: [Number], //Array of used white card ids
    usedBlackCards: [Number], //Array of used black card ids
    packs: [Object],
    packIDArray: [Number],
    log: [Object]
    //settings: Object //Leaving undefined unti I know all that has to go into the settings
    /* 
    settings: {
        hand_immit: Number,
        blank_card_limit: Number,
        is_blank_cards: Bool
    
    }
    */
})
export const Game = mongoose.model("Game", gameSchema)

const packSchema = new mongoose.Schema({
    _id: String,
    name: String,
    white: Array,
    black: Array,
    official: Boolean,
    pack_id: Number,
    card_count: Number,
    white_card_count: Number,
    black_card_count: Number

})
export const Pack = mongoose.model("Pack", packSchema)
const black_cardSchema = new mongoose.Schema({

})
const wcardSchema = new mongoose.Schema({
    _id: String,
    text: String,
    pack: Number,
    id: Number
})
export const Wcard = mongoose.model("Wcard", wcardSchema)

const bcardSchema = new mongoose.Schema({
    _id: String,
    text: String,
    pick: Number,
    pack: Number,
    id: String
})
export const Bcard = mongoose.model("Bcard", bcardSchema)

const models = {
    User,
    Room,
    Game,
    Pack,
    Wcard,
    Bcard,
}

export default models
import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    socket_id: String
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)

const roomSchema = new mongoose.Schema({
    _id: String,
    host: String,
    current_game_id: String,
    with_password: Boolean,
    password: String,
    members: [{ user_id: String, username: String, is_host: Boolean }],
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

const gameSchema = new mongoose.Schema({
    _id: String,
    judge_user_id: String,
    game_state: String,
    hand_limit: Number,
    round: Number,
    cards_on_table: Array,
    black_card: Object,
    blank_card_limit: Number,
    is_blank_cards: Boolean,
    score_board: Object,
    hands: Object,
    deck_size: Number,
    white_cards: Array,
    used_white_cards: [String], //Array of used white card ids
    used_black_cards: [String], //Array of used black card ids
    players: [{ user_id: String, username: String, is_host: Boolean, score: Number }],
    packs: [String],
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
    white: Array,
    black: Array,
    official: Boolean,
    pack_id: Number

})
const Pack = mongoose.model("Pack", packSchema)
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
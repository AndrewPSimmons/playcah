const initialState = {
    user: {
        _id: null,
        username: null,
        isHost: null,
        roomCode: null
    },
    room: {
        roomCode: null,
        members: null,
        packs: [],
        gameSettings: null,
        roomSettings: {

        }
    },
    game: {
        _id: null,
        roomCode: null,
        settings: null,
        round: null,
        gameState: null,
        cardsOnTable: null,
        judgeId: null,
        blackCard: null,
        players: null,
        /* 
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
    packs: [String],*/
    },
    chat: {
        messages: []
    }
}

export default initialState
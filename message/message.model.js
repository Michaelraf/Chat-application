const { Schema, model } = require("mongoose");
let messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now()
    },
/*     room_id: {
        type: Schema.Types.ObjectId,
        ref: 'room',
        default: " "
    }, */
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: " "
    }
});

module.exports = model('message', messageSchema);
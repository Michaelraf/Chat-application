const { Schema, model } = require("mongoose");
let messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    created_on: {
        type: String,
        default:new Date()
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
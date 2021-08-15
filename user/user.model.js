const { Schema, model } = require("mongoose");
let userSchema = new Schema({
    username:{
        type : String,
        required : true
    },
    password:{
        type: String,
        required: true,
    },
    connected: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user"
    },
    sockets: [{
        type:String
    }]
});
module.exports = model('user', userSchema);
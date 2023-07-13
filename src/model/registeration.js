const mongoose = require('mongoose');

const registerSchema = mongoose.Schema({
    user_name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
        match:
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
        type: String,
        require: true
    },
    roleId: {
        type: String,
        default: '2'
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const registerUser = mongoose.model("userData", registerSchema);

module.exports= registerUser;
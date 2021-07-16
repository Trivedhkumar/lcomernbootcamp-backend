const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 48,
        trim: true,
    },
    lastname: {
        type: String,
        required: false,
        maxlength: 32,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique:true,
    },
    encry_password: {
        type: String,
        required:true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0,
    },
    purchases: {
        type: Array,
        default: []
    },
    userinfo: {
        type: String,
        trim: true
        
    }
}, {
    timestamps: true
})

userSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.salt = uuidv4();
        this.encry_password = this.securePassword(password)
    })
    .get(function () {
        return this._password;
})

userSchema.methods = {
    authenticate: function (password) {
        return this.securePassword(password) === this.encry_password;
    },
    securePassword: function (plainPassword) {
        if (!plainPassword) return "";
        try {
            return crypto
            .createHmac('sha256', this.salt)
               .update(plainPassword)
               .digest('hex');
        } catch (err) {
            return ""
        }
        
    }
}
module.exports = mongoose.model("User", userSchema);
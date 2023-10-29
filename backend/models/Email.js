const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const EmailSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: Date
    }
});

const Email = mongoose.model("email", EmailSchema);
module.exports = Email;
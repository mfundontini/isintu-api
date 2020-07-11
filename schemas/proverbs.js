const mongoose = require("mongoose");

const proverbSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "The type should be either `izisho` or `izaga`."]
    },
    title: {
        type: String,
        required: [true, "Title is required."],
        unique: true
    },
    description: {
        type: String
    },
    translations: {
        type: Array
    },
    tags: {
        type: Array
    },
    image: {
        type: String
    },
    created: {
        type: String,
        required: [true, "Created at date string not supplied."]
    },
    updated: {
        type: String,
        required: [true, "Updated at date string not supplied."]
    },
    verified: {
        type: Boolean,
        default: false
    },
    source: {
        type: Object,
        required: [true, "Please specify the source information."]
    },
    author: {
        type: Number,
        required: [true, "Author id not supplied."]
    }
});

const Proverb = mongoose.model('Proverb', proverbSchema);
module.exports = Proverb;
const mongoose = require("mongoose");

const proverbSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "The type should be either `izisho` or `izaga`."]
    },
    title: {
        type: String,
        required: [true, "Title is required."],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    translations: {
        type: [Object]
    },
    tags: {
        type: [String]
    },
    image: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date,
        default: Date.now()
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
        type: Number
    },
    rating: {
        type: Number,
        default: 2.5
    }
});

const Proverb = mongoose.model('Proverb', proverbSchema);
module.exports = Proverb;
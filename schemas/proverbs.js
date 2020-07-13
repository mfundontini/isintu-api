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
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

proverbSchema.virtual("english").get(function() {
    let index = this.translations.findIndex(trans => trans.language_code === "EN");
    console.log(index);
    if(index !== -1) return this.translations[index].decsription;
    return "";
});

const Proverb = mongoose.model('Proverb', proverbSchema);
module.exports = Proverb;
const mongoose = require("mongoose");
const slugify = require("slugify");

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
    slug: {
        type: String,
        unique: [true, "Slug must be unique"],
        require: [true, "Slug is required."]
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
    },
    etymology: {
        type: String,
        default: ""
    },
    versions: {
        type:[String]
    }

}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

proverbSchema.virtual("english").get(function() {
    let index = this.translations.findIndex(trans => trans.language_code === "EN");

    // If an EN tranlation exists then show it as a virtual property
    if(index !== -1) return this.translations[index].decsription;
    return "";
});

proverbSchema.pre("save", function(next) {
    this.slug = slugify(this.title, {lower: true, strict: true});
    next();
});

/* POST SAVE HOOK LEFT ON SCHEMA FOR REFERENCE
// POST SAVE HOOK DOES NOT NEED THE `this` KEYWORD, HENCE ARROW FUNCTION USED
proverbSchema.post("save", (document, next) => {
    console.log(document);
    next();
});
*/

const Proverb = mongoose.model('Proverb', proverbSchema);
module.exports = Proverb;
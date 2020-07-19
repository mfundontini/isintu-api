const mongoose = require("mongoose");
const slugify = require("slugify");

const LINK_PREFIXES = ["https://", "http://", "www."];

const proverbSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "The type should be either `izisho` or `izaga`."],
        enum: {
            values: ["izaga", "izisho"],
            message: "The type `{VALUE}` is not oneOf `izaga` or `izisho`"
        }
    },
    title: {
        type: String,
        required: [true, "Title is required."],
        unique: true,
        trim: true,
        maxlength: [255, "Title is too long."]
    },
    description: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
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
        required: [true, "Please specify the source information."],
        validate: {
            validator: function(value) {
                console.log(value);
                if(value.type === "link") {

                    for(const prefix of LINK_PREFIXES) {
                        console.log(`${value.value} startsWith ${prefix}`);
                        if(value.value.startsWith(prefix)) return true;
                    }
                    return false;
                }
                return true;  
            },
            message: "Please use a valid link."
        }
    },
    author: {
        type: Number
    },
    rating: {
        type: Number,
        default: 2.5,
        min: [1, "Rating must be greater 1 or more."],
        max: [5, "Rating must be 5 or less."],

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

// DOCUMENT MIDDLEWARE

// Only works for proverb.save() and proverb.create()
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

// QUERY MIDDLEWARE

/* EXAMPLE QUERY MIDDLEWARE HANDLERS
// Uses REGEX so that we match all find starting queries incl. findOneAndDelete etc
proverbSchema.pre(/^find/, function(next) {
    this.find({translations: {$ne: false}});
    next();
});

// POST QUERY MIDDLEWARE HAS THE ACTUAL QUERIED DOCUMENTS
proverbSchema.post(/^find/, (documents, next) => {
    console.log(documents);
    next();
});
*/

const Proverb = mongoose.model('Proverb', proverbSchema);
module.exports = Proverb;
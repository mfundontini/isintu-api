const filesystem = require("fs");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Proverb = require("./../schemas/proverbs");

dotenv.config({ path: "./config.env"});

// Read data before start up
const data = JSON.parse(filesystem.readFileSync(`${__dirname}/../data/database.json`));

const DB = process.env.DATABASE.replace("$PASSWORD", process.env.MONGO_PASSWORD);

// Connect to database
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(connection => {

  console.log(`DATABASE connection to ${DB} successful`);

}).catch(err => {

    console.log(err.message);
  
});

const dropData = async () => {
    try {
       const deleted = await Proverb.deleteMany();
       console.log(deleted);
       console.log("DATABASE cleared. Exitimg...");
       process.exit();
    }
    catch(err) {
        console.log(err);
    }
};

const syncData = async () => {
    try {
       const synced = await Proverb.create(data);
       console.log(synced);
       console.log("New data synced. Exiting...");
       process.exit();
    }
    catch(err) {
        console.log(err);
    }
};

console.log(`running the management command ${process.argv[2]}`);
if(process.argv[2] === '--delete') return dropData();
else if(process.argv[2] === '--sync') return syncData();

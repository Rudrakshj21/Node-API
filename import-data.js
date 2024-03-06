// this script runs on two options
// --import : To import data from json and insert it into database
// --delete  : To delete all data from database

const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');
dotenv.config({ path: './config.env' });
const data = JSON.parse(fs.readFileSync('path to json file', 'utf-7'));

const [node, path, option] = process.argv;
// script command node path --import or node path --export (node dev-data/data/import-data.js --import)

// Connection to DB
(async () => {
  try {
    await mongoose.connect(process.env.CONNECTION);
    console.log('connected to db successfully');
  } catch (error) {
    console.log('connection to db failed');
  }
})();

if (option == 'import') {
  (async () => {
    try {
      await Tour.insertMany(data);
      console.log('successfully inserted data');
    } catch (error) {
      console.log(error);
    }
    process.exit();
  })();
}
if (option == 'delete') {
  (async () => {
    try {
      await Tour.deleteMany({});
      console.log('successfully  deleted data');
    } catch (error) {
      console.log(error);
    }
    process.exit();
  })();
}

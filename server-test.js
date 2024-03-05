const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// console.log(process.env)
const app = require('./app-test');
(async () => {
  try {
    const conStr = process.env.CONNECTION.replace(
      '<password>',
      process.env.DB_PASSWORD
    );
    await mongoose.connect(conStr);
    console.log('Connected to DB ✅');
  } catch (error) {
    console.log('Cannot connect to DB ❌', error);
  }
})();
// 4 SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App  running on port : ${port}`);
});

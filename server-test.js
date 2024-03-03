const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
// console.log(process.env)
const app = require("./app-test");

// 4 SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App  running on port : ${port}`);
});

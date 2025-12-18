require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");
const { server } = require("./src/lib/socket.js");
const PORT = process.env.PORT || 3000;

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

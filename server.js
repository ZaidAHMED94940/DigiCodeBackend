const express = require("express");
const app = express();
const PORT = 6004;
const db=require('./config/db')
const UserRoutes=require('./controller/Usercontroller')
const ProblemRoutes=require("./controller/ProblemController")
const CoderunRoute=require("./controller/codeController")
const cors = require("cors");
const dotenv=require("dotenv")
const cookieParser=require("cookie-parser")
dotenv.config()
app.use(cors());
app.use(cookieParser())


app.listen(PORT, () => {
  console.log(`Hello Server from Port :${PORT}`);
});
app.use(express.json());


app.use('/api/user/',UserRoutes)
app.use('/api/problem',ProblemRoutes)
app.use('/api/code',CoderunRoute)
db();

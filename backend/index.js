const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.connection");
const {
  getAllRules,
  createNewRule,
  combineRules,
  evaluateRule,
} = require("./controllers/rule.controller");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

connectDB();

app.get("/api/rules", getAllRules);
app.post("/api/rules", createNewRule);
app.post("/api/evaluate", evaluateRule);
app.post("/api/combineRules", combineRules);

app.listen(port, () => {
  console.log(`Rule engine server running on port ${port}`);
});

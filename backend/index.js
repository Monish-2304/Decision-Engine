const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
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

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

connectDB();

app.get("/api/rules", getAllRules);
app.post("/api/rules", createNewRule);
app.post("/api/evaluate", evaluateRule);
app.post("/api/combineRules", combineRules);

app.listen(port, () => {
  console.log(`Rule engine server running on port ${port}`);
});

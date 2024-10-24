const mongoose = require("mongoose");

const RuleEvaluationSchema = new mongoose.Schema({
  ruleId: { type: mongoose.Schema.Types.ObjectId, ref: "Rule", required: true },
  inputData: { type: Object, required: true },
  finalResult: { type: Boolean, required: true },
  evaluatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RuleEvaluation", RuleEvaluationSchema);

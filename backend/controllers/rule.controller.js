const Rule = require("../models/rule.model");
const {
  saveRule,
  combine_rules,
  evaluateNode,
  saveEvaluation,
} = require("../ruleEngine");
const { ValidationError } = require("../validation");

const getAllRules = async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json({ rules });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      type: Object.values(ValidationError).includes(error.message)
        ? error.message
        : "UNKNOWN_ERROR",
    });
  }
};

const createNewRule = async (req, res) => {
  try {
    const { ruleString, ruleName } = req.body;
    const rule = await saveRule(ruleName, ruleString);
    res.json({ success: true, rule });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      type: Object.values(ValidationError).includes(error.message)
        ? error.message
        : "UNKNOWN_ERROR",
    });
  }
};

const combineRules = async (req, res) => {
  try {
    const { ruleNames } = req.body;
    if (!Array.isArray(ruleNames) || ruleNames.length < 2) {
      return res.status(400).json({
        success: false,
        error: "At least two rule names are required",
      });
    }
    const rules = await Rule.find({ name: { $in: ruleNames } });
    const ruleStrings = rules.map((rule) => rule.ruleString);
    const combinedRule = await combine_rules(ruleStrings);

    res.json({ success: true, combinedRule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const evaluateRule = async (req, res) => {
  try {
    const { astData, ruleName, data } = req.body;
    const rule = await Rule.findOne({ name: ruleName });

    let evaluation;
    let ast;
    if (astData) {
      evaluation = evaluateNode(astData, data);
    } else {
      ast = rule.ast;
      evaluation = evaluateNode(ast, data);
      await saveEvaluation(rule._id, data, evaluation.result);
    }
    res.json(evaluation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllRules, createNewRule, combineRules, evaluateRule };

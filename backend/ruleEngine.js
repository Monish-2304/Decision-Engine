const Rule = require("./models/rule.model");
const RuleEvaluation = require("./models/evaluation.model");
const { validateRuleString } = require("./validation");
class Node {
  constructor(type, value, left = null, right = null) {
    this.type = type;
    this.value = value;
    this.left = left;
    this.right = right;
  }

  clone() {
    return new Node(
      this.type,
      this.value,
      this.left ? this.left.clone() : null,
      this.right ? this.right.clone() : null
    );
  }
}

function createRule(ruleString) {
  let currentIndex = 0;

  const normalizedRule = ruleString.replace(/\s+/g, " ").trim();
  validateRuleString(ruleString);
  function peek() {
    return normalizedRule[currentIndex] || "";
  }

  function consume() {
    return normalizedRule[currentIndex++];
  }

  function consumeWhile(predicate) {
    let result = "";
    while (currentIndex < normalizedRule.length && predicate(peek())) {
      result += consume();
    }
    return result;
  }

  function isAlphaNumeric(char) {
    return /[a-zA-Z0-9_']/.test(char);
  }

  function parseValue() {
    consumeWhile((char) => char === " ");

    if (peek() === "'") {
      consume();
      const value = consumeWhile((char) => char !== "'");
      consume();
      return value;
    }

    const value = consumeWhile(isAlphaNumeric);
    return value;
  }

  function parseComparison() {
    consumeWhile((char) => char === " ");

    const left = parseValue();
    consumeWhile((char) => char === " ");

    const operator = consumeWhile((char) => /[><=!]/.test(char));
    consumeWhile((char) => char === " ");

    const right = parseValue();

    const node = new Node("operator", operator);
    node.left = new Node("operand", left);
    node.right = new Node("operand", right);

    return node;
  }
  function parseOperator(node) {
    if (currentIndex < normalizedRule.length) {
      const operator = consumeWhile((char) => /[A-Z]/.test(char));
      if (operator === "AND" || operator === "OR") {
        const parent = new Node("operator", operator);
        parent.left = node;
        consumeWhile((char) => char === " ");
        parent.right = parseExpression();
        return parent;
      }
      currentIndex -= operator.length;
    }
    return node;
  }

  function parseExpression() {
    consumeWhile((char) => char === " ");

    if (peek() === "(") {
      consume();
      const node = parseExpression();
      consumeWhile((char) => char === " ");
      if (peek() === ")") {
        consume();
      }
      consumeWhile((char) => char === " ");
      return parseOperator(node);
    }

    const comparison = parseComparison();
    consumeWhile((char) => char === " ");
    return parseOperator(comparison);
  }

  return parseExpression();
}

function optimizeAST(node) {
  if (!node) return null;

  if (node.left) node.left = optimizeAST(node.left);
  if (node.right) node.right = optimizeAST(node.right);

  if (node.type !== "operator") return node;

  node = deduplicateSubtrees(node);
  node = consolidateConditions(node);
  node = flattenOperators(node);
  node = removeRedundantOperators(node);

  return node;
}

function hashNode(n) {
  if (!n) return "null";
  return `${n.type}:${n.value}:${hashNode(n.left)}:${hashNode(n.right)}`;
}

function deduplicateSubtrees(node) {
  if (!node || node.type !== "operator") return node;

  const subtreeMap = new Map();

  function collectSubtrees(n) {
    if (!n) return;
    const hash = hashNode(n);
    if (!subtreeMap.has(hash)) {
      subtreeMap.set(hash, n);
    }
    collectSubtrees(n.left);
    collectSubtrees(n.right);
  }

  collectSubtrees(node);

  // Replace duplicate subtrees with references to unique ones
  function deduplicate(n) {
    if (!n) return null;
    const hash = hashNode(n);
    const unique = subtreeMap.get(hash);
    if (unique !== n) {
      return unique.clone();
    }
    n.left = deduplicate(n.left);
    n.right = deduplicate(n.right);
    return n;
  }

  return deduplicate(node);
}

function consolidateConditions(node) {
  if (!node || node.type !== "operator") return node;

  if (["AND", "OR"].includes(node.value)) {
    const conditions = new Map();

    function collectConditions(n, op) {
      if (!n) return;
      if (n.type === "operator" && n.value === op) {
        collectConditions(n.left, op);
        collectConditions(n.right, op);
      } else {
        const hash = hashNode(n);
        if (!conditions.has(hash)) {
          conditions.set(hash, n);
        }
      }
    }

    collectConditions(node, node.value);

    if (conditions.size === 1) {
      return conditions.values().next().value;
    }
    const conditionArray = Array.from(conditions.values());
    return buildBalancedTree(conditionArray, node.value);
  }
  return node;
}

function flattenOperators(node) {
  if (!node || node.type !== "operator") return node;

  if (["AND", "OR"].includes(node.value)) {
    const operands = [];

    function collect(n) {
      if (!n) return;
      if (n.type === "operator" && n.value === node.value) {
        collect(n.left);
        collect(n.right);
      } else {
        operands.push(n);
      }
    }

    collect(node);
    return buildBalancedTree(operands, node.value);
  }

  return node;
}

function buildBalancedTree(nodes, operator) {
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0];

  const mid = Math.floor(nodes.length / 2);
  return new Node(
    "operator",
    operator,
    buildBalancedTree(nodes.slice(0, mid), operator),
    buildBalancedTree(nodes.slice(mid), operator)
  );
}

function removeRedundantOperators(node) {
  if (!node || node.type !== "operator") return node;

  if (["AND", "OR"].includes(node.value)) {
    if (
      node.left &&
      node.left.type === "operator" &&
      node.left.value === node.value
    ) {
      node.left = node.left.left;
    }
    if (
      node.right &&
      node.right.type === "operator" &&
      node.right.value === node.value
    ) {
      node.right = node.right.right;
    }
  }

  return node;
}

function combine_rules(ruleStrings) {
  if (!ruleStrings || ruleStrings.length === 0) {
    throw new Error("No rules provided");
  }

  const asts = ruleStrings.map((ruleString) => createRule(ruleString));

  let combined = asts[0];
  for (let i = 1; i < asts.length; i++) {
    combined = new Node("operator", "OR", combined, asts[i]);
  }

  return optimizeAST(combined);
}

function evaluateNode(node, data) {
  if (!node) return { result: true, evaluations: {} };

  if (node.type === "operator") {
    const { result: leftResult, evaluations: leftEvals } = evaluateNode(
      node.left,
      data
    );
    const { result: rightResult, evaluations: rightEvals } = evaluateNode(
      node.right,
      data
    );

    let result;
    if (node.value === "AND") {
      result = leftResult && rightResult;
    } else if (node.value === "OR") {
      result = leftResult || rightResult;
    } else {
      const leftValue = data[node.left.value];
      const rightValue = ["=", "!="].includes(node.value)
        ? node.right.value
        : parseFloat(node.right.value);

      switch (node.value) {
        case ">":
          result = leftValue > rightValue;
          break;
        case "<":
          result = leftValue < rightValue;
          break;
        case ">=":
          result = Number(leftValue) >= rightValue;
          break;
        case "<=":
          result = Number(leftValue) <= rightValue;
          break;
        case "=":
          result = leftValue === rightValue;
          break;
        case "!=":
          result = leftValue != rightValue;
          break;
        default:
          result = false;
      }
    }

    return {
      result,
      evaluations: {
        ...leftEvals,
        ...rightEvals,
        [JSON.stringify(node)]: result,
      },
    };
  }

  return { result: true, evaluations: {} };
}

async function saveRule(ruleName, ruleString) {
  try {
    const ast = createRule(ruleString);
    const rule = new Rule({
      name: ruleName,
      ruleString,
      ast,
    });

    await rule.save();
    return rule;
  } catch (error) {
    throw new Error(`Failed to save rule: ${error.message}`);
  }
}

async function saveEvaluation(ruleId, inputData, finalResult) {
  try {
    const evaluation = new RuleEvaluation({
      ruleId,
      inputData,
      finalResult,
    });

    await evaluation.save();
    return evaluation;
  } catch (error) {
    throw new Error(`Failed to save evaluation: ${error.message}`);
  }
}

module.exports = {
  createRule,
  combine_rules,
  evaluateNode,
  saveRule,
  saveEvaluation,
};

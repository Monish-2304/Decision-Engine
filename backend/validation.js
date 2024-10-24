const ValidationError = {
  INVALID_SYNTAX: "INVALID_SYNTAX",
  INVALID_OPERATOR_COMBINATION: "INVALID_OPERATOR_COMBINATION",
  INVALID_OPERATOR: "INVALID_OPERATOR",
  INVALID_OPERAND: "INVALID_OPERAND",
  INVALID_RULE_STRING: "INVALID_RULE_STRING",
};

function validateRuleString(ruleString) {
  // Check for empty or null rules
  if (!ruleString || !ruleString.trim()) {
    throw new Error(ValidationError.INVALID_RULE_STRING);
  }

  const normalizedRule = ruleString.replace(/\s+/g, " ").trim();

  // Check for balanced parentheses
  const stack = [];
  for (let char of normalizedRule) {
    if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      if (stack.length === 0) {
        throw new Error(ValidationError.INVALID_SYNTAX);
      }
      stack.pop();
    }
  }
  if (stack.length > 0) {
    throw new Error(ValidationError.INVALID_SYNTAX);
  }

  // Split into tokens but preserving strings in quotes and grouping parentheses
  const tokens = [];
  let currentToken = "";
  let inQuote = false;
  let depth = 0;

  for (let i = 0; i < normalizedRule.length; i++) {
    const char = normalizedRule[i];

    if (char === "'") {
      inQuote = !inQuote;
      currentToken += char;
    } else if (char === "(") {
      if (depth === 0 && currentToken) {
        tokens.push(currentToken.trim());
        currentToken = "";
      }
      depth++;
      currentToken += char;
    } else if (char === ")") {
      depth--;
      currentToken += char;
      if (depth === 0) {
        tokens.push(currentToken.trim());
        currentToken = "";
      }
    } else if (!inQuote && char === " " && depth === 0) {
      if (currentToken) {
        tokens.push(currentToken.trim());
        currentToken = "";
      }
    } else {
      currentToken += char;
    }
  }
  if (currentToken) {
    tokens.push(currentToken.trim());
  }

  const validOperators = [">", "<", ">=", "<=", "=", "!="];
  const validLogicalOperators = ["AND", "OR"];

  function validateCondition(condition) {
    condition = condition.trim();
    if (condition.startsWith("(") && condition.endsWith(")")) {
      condition = condition.slice(1, -1).trim();
    }

    const parts = [];
    let current = "";
    let inQuotes = false;

    for (let char of condition) {
      if (char === "'") {
        inQuotes = !inQuotes;
        current += char;
      } else if (!inQuotes && char === " ") {
        if (current) {
          parts.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }
    if (current) {
      parts.push(current);
    }

    if (parts.length < 3) {
      throw new Error(ValidationError.INVALID_SYNTAX);
    }

    let i = 0;
    while (i < parts.length) {
      if (i % 4 === 0) {
        if (!parts[i] || validLogicalOperators.includes(parts[i])) {
          throw new Error(ValidationError.INVALID_SYNTAX);
        }
      } else if (i % 4 === 1) {
        if (!validOperators.includes(parts[i])) {
          throw new Error(ValidationError.INVALID_OPERATOR);
        }
      } else if (i % 4 === 2) {
        if (!parts[i]) {
          throw new Error(ValidationError.INVALID_OPERAND);
        }
        if (
          !parts[i].startsWith("'") &&
          !parts[i].endsWith("'") &&
          isNaN(parts[i])
        ) {
          throw new Error(ValidationError.INVALID_SYNTAX);
        }
      } else if (i % 4 === 3) {
        if (!validLogicalOperators.includes(parts[i])) {
          throw new Error(ValidationError.INVALID_OPERATOR_COMBINATION);
        }
      }
      i++;
    }

    if (validLogicalOperators.includes(parts[parts.length - 1])) {
      throw new Error(ValidationError.INVALID_OPERATOR_COMBINATION);
    }
  }

  // Validate each parenthesized group and connections between them
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.startsWith("(")) {
      validateCondition(token);
    } else if (!validLogicalOperators.includes(token)) {
      throw new Error(ValidationError.INVALID_SYNTAX);
    }

    // Check for proper alternation between conditions and logical operators
    if (i > 0) {
      const prevToken = tokens[i - 1];
      if (
        (token.startsWith("(") && !validLogicalOperators.includes(prevToken)) ||
        (prevToken.startsWith("(") && !validLogicalOperators.includes(token))
      ) {
        throw new Error(ValidationError.INVALID_OPERATOR_COMBINATION);
      }
    }
  }

  // Check for mixed quote types
  if (/"/.test(normalizedRule)) {
    throw new Error(ValidationError.INVALID_SYNTAX);
  }

  // Check for invalid spacing around operators
  const operatorSpacingRegex = /\w+[><=!]+\w+/;
  if (operatorSpacingRegex.test(normalizedRule)) {
    throw new Error(ValidationError.INVALID_SYNTAX);
  }

  return true;
}

module.exports = { validateRuleString, ValidationError };

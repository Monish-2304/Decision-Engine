import React from "react";

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Rule Engine Help
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-blue-600">
                1. Valid Operators
              </h3>
              <p className="text-gray-700">
                Make sure to use valid operators like{" "}
                <code className="bg-slate-800 text-white p-1 rounded-md">{`<, >, =, >=, <=, !=`}</code>{" "}
                in rule expressions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-600">
                2. Unique Rule Names
              </h3>
              <p className="text-gray-700">
                Each rule name must be unique. Duplicate rule names are not
                allowed.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-600">
                3. Data Format
              </h3>
              <p className="text-gray-700">
                The data provided for evaluation must be in valid JSON format
                only.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-600">
                4. Allowed Logical Operators
              </h3>
              <p className="text-gray-700">
                Only <strong>AND</strong> and <strong>OR</strong> logical
                operators are allowed, and they must be written in capital
                letters.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-600">
                5. AST Tree Display
              </h3>
              <p className="text-gray-700">
                After a rule is created, its Abstract Syntax Tree (AST) is
                displayed below. By default, all nodes are shown in blue.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-600">
                6. AST Tree Node Colors During Evaluation
              </h3>
              <p className="text-gray-700">
                When you evaluate a rule with data, the colors of the AST tree
                nodes change:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>All leaf nodes remain blue.</li>
                <li>Nodes that pass the condition turn green.</li>
                <li>Nodes where the condition fails turn red.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-600">
                7. Root Node Evaluation
              </h3>
              <p className="text-gray-700">
                After evaluation, if the root node is green, the data passed the
                rule. If it turns red, the data failed the rule.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-600">
                8. Combining Rules
              </h3>
              <p className="text-gray-700">
                You need to select a minimum of two rules to combine them.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-600">
                9. Viewing Rules
              </h3>
              <p className="text-gray-700">
                All created rules are available on the Rules page. Clicking on a
                rule will show its string, metadata, and AST. You can also
                evaluate the rule with data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

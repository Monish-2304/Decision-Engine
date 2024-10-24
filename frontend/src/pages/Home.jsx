import React, { useState, useRef } from "react";
import axios from "axios";
import ASTtree from "../components/ASTtree";
import EvaluateTree from "../components/EvaluateTree";
import { ToastContainer, toast } from "react-toastify";
import { URLS } from "../constants/url.constants";
import "react-toastify/dist/ReactToastify.css";

const RuleEngine = ({ rules, setRules }) => {
  const [ruleName, setRuleName] = useState("");
  const [ruleString, setRuleString] = useState("");
  const [ast, setAst] = useState(null);
  const [evaluation, setEvaluation] = useState({});
  const [selectedRules, setSelectedRules] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const displayRules =
    searchTerm.trim() === ""
      ? rules || []
      : rules?.filter((rule) =>
          rule.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

  const handleCreateRule = async () => {
    try {
      const response = await axios.post(`${URLS.BASE_API_URL}/rules`, {
        ruleName,
        ruleString,
      });
      if (response.data.success) {
        setAst(response.data.rule.ast);
        setRules([...rules, response.data.rule]);
        toast.success("Rule created successfully!");
      } else {
        toast.error(response.data.error || "Failed to create rule");
      }
    } catch (error) {
      toast.error("Error creating rule. Please check your input.", error);
    }
  };
  const handleCombineRules = async () => {
    try {
      const response = await axios.post(`${URLS.BASE_API_URL}/combineRules`, {
        ruleNames: selectedRules,
      });
      if (response.data.success) {
        setAst(response.data.combinedRule);
        toast.success("Rules combined successfully!");
      } else {
        toast.error(response.data.error || "Failed to combine rules");
      }
    } catch (error) {
      toast.error("Error combining rules. Please try again.", error);
    }
  };

  const handleSelectRule = (ruleName) => {
    if (!selectedRules.includes(ruleName)) {
      setSelectedRules([...selectedRules, ruleName]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveRule = (ruleToRemove) => {
    setSelectedRules(selectedRules.filter((rule) => rule !== ruleToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
      />
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-6">
          <h2 className="text-2xl font-semibold ">Create Rule</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rule Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter rule name"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rule Expression
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., (age > 30 AND department = 'Sales')"
                value={ruleString}
                onChange={(e) => setRuleString(e.target.value)}
              />
            </div>

            <button
              onClick={handleCreateRule}
              className="w-fit bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Rule
            </button>
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="block text-2xl font-semibold mb-4">
              Combine Rules
            </label>

            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {displayRules.length > 0 ? (
                  <ul className="max-h-60 overflow-auto">
                    {displayRules.map((rule) => (
                      <li
                        key={rule._id}
                        className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                          selectedRules.includes(rule.name)
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleSelectRule(rule.name)}
                      >
                        <span>{rule.name}</span>
                        {selectedRules.includes(rule.name) && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-2 text-gray-500">No rules found</div>
                )}
              </div>
            )}

            {selectedRules.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedRules.map((rule) => (
                  <div
                    key={rule}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    <span>{rule}</span>
                    <button
                      onClick={() => handleRemoveRule(rule)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleCombineRules}
              disabled={selectedRules.length < 2}
              className={`w-fit px-4 mt-4 py-2 rounded-md text-white ${
                selectedRules.length < 2
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-600"
              }`}
            >
              Combine Rules
            </button>
          </div>

          <EvaluateTree
            astData={ast}
            ruleName={ruleName}
            setEvaluation={setEvaluation}
          />
        </div>

        {ast && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Rule Visualization</h2>
            <ASTtree ast={ast} evaluation={evaluation} />{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleEngine;

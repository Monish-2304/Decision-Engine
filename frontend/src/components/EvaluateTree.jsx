import React, { useState } from "react";
import axios from "axios";
const EvaluateTree = ({ astData, ruleName, setEvaluation }) => {
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  const handleEvaluate = async () => {
    try {
      setError("");
      const parsedData = JSON.parse(data);
      const response = await fetch("http://localhost:5001/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astData, ruleName, data: parsedData }),
      });
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        setEvaluation(result.evaluations);
      }
    } catch (error) {
      setError("Error evaluating rule. Please check your JSON data format.");
      console.error("Error evaluating rule:", error);
    }
  };

  return (
    <div className="my-8 bg-white rounded-lg  ">
      <h2 className="text-2xl font-semibold mb-4">Evaluate Rule</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Test Data (JSON)
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='e.g., {"age": 35, "department": "Sales"}'
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>

      <button
        onClick={handleEvaluate}
        className="w-fit bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
      >
        Evaluate Rule
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default EvaluateTree;

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { URLS } from "../constants/url.constants";
import "react-toastify/dist/ReactToastify.css";

const EvaluateTree = ({ astData, ruleName, setEvaluation }) => {
  const [data, setData] = useState("");

  const handleEvaluate = async () => {
    try {
      const parsedData = JSON.parse(data);
      const response = await axios.post(`${URLS.BASE_API_URL}/evaluate`, {
        astData,
        ruleName,
        data: parsedData,
      });
      setEvaluation(response.data.evaluations);
      toast.success("Rule evaluated");
    } catch (error) {
      toast.error("Failed to evaluate rule");
    }
  };

  return (
    <div className="my-8 bg-white rounded-lg  ">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
      />
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
    </div>
  );
};

export default EvaluateTree;

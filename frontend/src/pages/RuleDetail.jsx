import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ASTtree from "../components/ASTtree";
import EvaluateTree from "../components/EvaluateTree";

const RuleDetail = () => {
  const location = useLocation();
  const { rule } = location.state;
  const [evaluation, setEvaluation] = useState({});
  useEffect(() => {}, [evaluation, setEvaluation]);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  console.log(rule.ast);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{rule.name}</h1>
      <p className="mb-4 text-gray-700 text-lg">
        <strong>Rule String:</strong> {rule.ruleString}
      </p>
      <p className="mb-4 text-gray-700">
        <strong>Created At:</strong> {formatDate(rule.createdAt)}
      </p>
      <EvaluateTree
        ast={rule?.ast}
        ruleName={rule.name}
        setEvaluation={setEvaluation}
      />
      <div className=" bg-green-100 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Rule Visualization Tree</h2>
        <ASTtree ast={rule?.ast} evaluation={evaluation} />
      </div>
    </div>
  );
};

export default RuleDetail;

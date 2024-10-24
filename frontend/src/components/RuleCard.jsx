import React from "react";
import { useNavigate } from "react-router-dom";

const RuleCard = ({ rule }) => {
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleClick = () => {
    navigate(`/rule/${rule._id}`, { state: { rule } });
  };

  return (
    <div
      className="bg-blue-300 mx-auto w-full h-28 rounded-lg shadow-md p-4  cursor-pointer hover:shadow-lg"
      onClick={handleClick}
    >
      <h3 className="text-xl font-bold mb-2">{rule.name}</h3>
      <p className="text-gray-600">Created At: {formatDate(rule.createdAt)}</p>
    </div>
  );
};

export default RuleCard;

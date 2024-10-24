import React from "react";
import RuleCard from "../components/RuleCard";

const Rules = ({ rules, loading }) => {
  return (
    <div className="mt-8 p-8">
      <h2 className="text-2xl font-bold mb-6">All Rules</h2>
      <div className="flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 w-full">
        {loading ? (
          <p>Loading...</p>
        ) : rules && rules.length > 0 ? (
          rules.map((rule) => <RuleCard key={rule._id} rule={rule} />)
        ) : (
          <p>No rules available. Create one!</p>
        )}
      </div>
    </div>
  );
};

export default Rules;

import React, { useRef, useEffect } from "react";

const TreeNode = ({ node, evaluation }) => {
  if (!node) return null;

  const nodeResult = evaluation?.[JSON.stringify(node)];

  const getBackgroundColor = () => {
    if (Object.keys(evaluation || {}).length === 0) {
      return "bg-blue-500";
    }

    if (node.type === "operator") {
      return nodeResult === undefined
        ? "bg-blue-500"
        : nodeResult
        ? "bg-green-500"
        : "bg-red-500";
    } else {
      return "bg-blue-500";
    }
  };

  const backgroundColor = getBackgroundColor();

  return (
    <div className="flex flex-col items-center min-w-fit">
      <div
        className={`w-12 h-12 rounded-full ${backgroundColor} flex items-center justify-center text-white font-bold mb-2 shadow-md`}
        title={node.type === "operator" ? node.value : node.value}
      >
        {node.type === "operator" ? node.value : node.value.slice(0, 3)}
      </div>
      {(node.left || node.right) && (
        <div className="relative">
          <div className="absolute w-full h-8 border-l border-r border-t border-gray-400 top-0"></div>
          <div className="flex gap-4 pt-8">
            <TreeNode node={node.left} evaluation={evaluation} />
            <TreeNode node={node.right} evaluation={evaluation} />
          </div>
        </div>
      )}
    </div>
  );
};

const ASTtree = ({ ast, evaluation }) => {
  const treeContainerRef = useRef(null);

  useEffect(() => {
    if (treeContainerRef.current) {
      const container = treeContainerRef.current;
      const treeWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      container.scrollLeft = (treeWidth - containerWidth) / 2;
    }
  }, [ast]);

  return (
    <div className="relative w-full">
      <div
        ref={treeContainerRef}
        className="overflow-x-auto overflow-y-auto max-h-[600px] p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
        }}
      >
        <div className="flex justify-center min-w-fit">
          <TreeNode node={ast} evaluation={evaluation} />
        </div>
      </div>
    </div>
  );
};

export default ASTtree;

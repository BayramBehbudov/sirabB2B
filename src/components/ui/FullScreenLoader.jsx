import React from "react";

const FullScreenLoader = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-30 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default FullScreenLoader;

import React from "react";
import { useNavigate } from "react-router-dom";

const Banned = () => {
  const navigate = useNavigate();

  const handleSupportClick = () => {
    // Redirect to support or help page
    navigate("/support");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
      <p className="mt-4 text-center">
        Your account has been banned. If you believe this is a mistake, please contact support.
      </p>
      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSupportClick}
      >
        Contact Support
      </button>
    </div>
  );
};

export default Banned;

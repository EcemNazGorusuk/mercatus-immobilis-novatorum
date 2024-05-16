import React from "react";

export default function OAuth({ buttonType }) {
  const handleGoogleClick = async () => {
    try {
    } catch (error) {
        console.log('Could not sign in with google',error)
    }
  };
  return (
    <button
      type={buttonType}
      onClick={handleGoogleClick}
      className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-400 hover:to-blue-400 text-white uppercase font-bold py-3 px-4 rounded"
    >
      Continue with google
    </button>
  );
}

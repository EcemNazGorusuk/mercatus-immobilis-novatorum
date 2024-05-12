import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="p-2 max-w-lg mx-auto">
      <h1
        className="text-3xl text-center font-semibold my-7 text-[#5987b2]"
        style={{ textShadow: "2px 2px 4px #AF8DCD" }}
      >
        Sign Up
      </h1>
      <form className="flex flex-col gap-4 px-2">
        <input
          type="text"
          placeholder="username"
          id="username"
          className=" border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className=" border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className=" border p-3 rounded-lg "
        />
        <button
          className="disabled:opacity-80 uppercase shadow bg-gradient-to-r from-[#83b3df] via-[#c96cd5] to-[#f07461] hover:bg-gradient-to-r hover:from-[#8fb7dd] hover:via-[#ca85d3] hover:to-[#dd8d81] hover:bg-opacity-80 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded"
          type="button"
        >
          Sign Up
        </button>
      </form>
      <div className="p-2 flex gap-2 pt-5">
        <p>Have an account ?</p>
        <Link  className="text-[#427db5] font-semibold" to={"/sign-in"}>Sign in</Link>
      </div>
    </div>
  );
}

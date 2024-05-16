import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [formData, setFormData] = useState({});

  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form action="" className="flex flex-col gap-4">
        <img
          src={currentUser.photoURL}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          id="username"
          placeholder="username"
          className=" border p-3 rounded-lg "
        />
        <input
          type="text"
          id="email"
          placeholder="email"
          className=" border p-3 rounded-lg "
        />
        <input
          type="text"
          id="password"
          placeholder="password"
          className=" border p-3 rounded-lg "
        />

        <button className="disabled:opacity-80 uppercase shadow bg-gradient-to-r from-[#83b3df] via-[#c96cd5] to-[#f07461] hover:bg-gradient-to-r hover:from-[#8fb7dd] hover:via-[#ca85d3] hover:to-[#dd8d81] hover:bg-opacity-80 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded">
          Update
        </button>

      </form>
      <div className="p-2 flex gap-2 pt-5 justify-between">
        <p className="text-red-700 font-semibold">Delete Account</p>
        <Link className="text-[#427db5] font-semibold" to={"/sign-up"}>
          Sign Out
        </Link>
      </div>
    </div>
  );
}

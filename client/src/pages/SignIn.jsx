import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      //api call is here
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      //if data.success true:
      setLoading(false);
      setError(null);
      navigate('/');//sends user to home page
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  console.log(formData);
  return (
    <div className="p-2 max-w-lg mx-auto">
      <h1
        className="text-3xl text-center font-semibold my-7 text-[#5987b2]"
        style={{ textShadow: "2px 2px 4px #AF8DCD" }}
      >
        Sign In
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-2">
        <input
          onChange={handleChange}
          type="text"
          placeholder="email"
          id="email"
          className=" border p-3 rounded-lg"
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="password"
          id="password"
          className=" border p-3 rounded-lg "
        />
        <button
          disabled={loading}
          className="disabled:opacity-80 uppercase shadow bg-gradient-to-r from-[#83b3df] via-[#c96cd5] to-[#f07461] hover:bg-gradient-to-r hover:from-[#8fb7dd] hover:via-[#ca85d3] hover:to-[#dd8d81] hover:bg-opacity-80 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded"
        >
          {loading ? "Loading.." : "Sign In"}
        </button>
      </form>

      <div className="p-2 flex gap-2 pt-5">
        <p>Dont have an account ?</p>
        <Link className="text-[#427db5] font-semibold" to={"/sign-up"}>
          Sign Up
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import logo from "../../public/circled-logo.PNG";
import { Input } from "antd";
import { Col, Row } from "antd"; // responsive layout for search button width
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { FaSearch } from "react-icons/fa";
export default function Header() {
  //redux for user's successfull authenticate process
  const { currentUser } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState(""); //state for search data
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  console.log(searchTerm);

  return (
    <header className="bg-gradient-to-r from-[#83b3df] via-[#D56CBD] to-[#f07461] sparkle shadow-xl">
      {/* <h2 className="text-white items-center relative top-6">{currentUser ? "Welcome," + currentUser.username : ""}</h2> */}
      <div className="flex justify-between items-center max-w-6xl mx-auto p-1">
        <h1>
          <Link to="/">
            <img
              src={logo}
              className="w-8 sm:w-10 md:w-12 lg:w-16 xl:w-20"
              alt="logo"
            />
          </Link>
        </h1>

        <form
          className="bg-slate-100 p-3 rounded-lg flex items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 text-white cursor-pointer font-[500]">
          <Link to={"/"} className="hidden sm:inline hover:text-[#2f326b]">
            Home
          </Link>
          <Link to={"/about"} className="hidden sm:inline hover:text-[#2f326b]">
            About
          </Link>

          {/* if current user exist, we can show user's image otherwise show default image*/}
          <Link to="/profile" className="hover:text-[#2f326b]">
            {currentUser ? (
              <img
                src={currentUser.photoURL}
                alt="profile"
                className="rounded-full h-7 w-7"
              />
            ) : (
              <li className=" text-slate-700 hover:underline"> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

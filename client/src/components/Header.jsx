import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import logo from "../../public/circled-logo.PNG";
import { Input } from "antd";
import { Col, Row } from "antd"; // responsive layout for search button width
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
export default function Header() {
  const { Search } = Input; //comes from antd
  const [loading, setLoading] = useState(false); // state for loading
  const [inputText, setInputText] = useState("");

  //redux for user's successfull authenticate process
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (event) => {
    //it holds input value
    setInputText(event.target.value);
    console.log(event.target.value);
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

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
          className="p-3 flex items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          {/* Responsive layout with Ant Design Grid system */}
          {/* Search form column */}
          <Col xs={19} sm={20} md={21} lg={22} xl={23} xxl={24}>
            <Search
              prefix={<SearchOutlined className="text-gray-500" />}
              className="custom-search "
              enterButton="Search"
              size="large"
              loading={loading} // loading property holds the state's value
              onSearch={handleSearch} //if click search button it works
              //also these under properties works for <input onChange value/>
              onChange={handleChange}
              value={inputText}
            />
          </Col>
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
              <li className=' text-slate-700 hover:underline'> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

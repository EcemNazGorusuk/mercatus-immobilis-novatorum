import React, { useState } from "react";
import logo from "../../public/circled-logo.PNG";
import { Input } from "antd";

export default function Header() {
  const { Search } = Input; //comes from antd
  const [loading, setLoading] = useState(false); // state for loading
  const [inputText, setInputText] = useState("");

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
    <header className="bg-[#F9F9F9] flex shadow-sm">
      <h1>
        <a href="/">
          <img
            src={logo}
            className="w-8 sm:w-10 md:w-12 lg:w-16 xl:w-20"
            alt="logo"
          />
        </a>
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <Search
          className="custom-search"
          placeholder="input search text"
          enterButton="Search..."
          size="large"
          loading={loading} // loading property holds the state's value
          onSearch={handleSearch} //if click search button it works
          //also these under properties works for <input onChange value/>
          onChange={handleChange}
          value={inputText}
        />
      </form>
    </header>
  );
}

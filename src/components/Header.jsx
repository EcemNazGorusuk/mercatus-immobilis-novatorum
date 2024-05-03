import React from "react";
import logo from "../../public/circled-logo.PNG"
export default function Header() {
  return (
    <header className="bg-[#F9F9F9]">
      <h1>
        <img src={logo}/>
      </h1>
    </header>
  );
}

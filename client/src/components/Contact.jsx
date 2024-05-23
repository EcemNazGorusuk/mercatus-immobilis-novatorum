import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  //for contact, we need to user info
  const [userLandlord, setUserLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  console.log("message:",message);
  
  useEffect(() => {
    const fetchLandlord = async () => {
    //api call for get user's data
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setUserLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {userLandlord && (
        <div className="flex flex-col gap-2 py-2">
          <p>
            Contact <span className="font-semibold">{userLandlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          {/* send message to user's email address */}
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${userLandlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className=" text-center bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-60 text-white uppercase font-bold p-2 px-4 rounded"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

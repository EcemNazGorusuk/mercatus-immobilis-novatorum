import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
//for redux user slice:
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth({ buttonType }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      //for firebase google authentication
      const googleProvider = new GoogleAuthProvider();
      const firebaseAuth = getAuth(app);
      const firebaseResult = await signInWithPopup(
        firebaseAuth,
        googleProvider
      );
      console.log("firebase result: ", firebaseResult);
      //Call firebase api
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //json data comes from firebase result in console.(when we click handleGoogleClick)
        body: JSON.stringify({
          //google defines 'user' model automatically, we can hold model's variable in different names (ex:profilePhoto)
          //in googleController, need to use exatly same req.body.(name-email-photoURL)
          name: firebaseResult.user.displayName,
          email: firebaseResult.user.email,
          photoURL: firebaseResult.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with google", error);
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

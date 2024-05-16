import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

//*we can reach Private route's child (Profile route) using <Outlet> */
//* if user authenticated (currentUser exist), -> profile page; otherwise signin page */

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

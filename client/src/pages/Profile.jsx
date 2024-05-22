import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signInStart,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]); //state for getting listings in here
  const [listingsVisible, setListingsVisible] = useState(false); // State to toggle listings visibility

  //for redux process
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false); //state for if update then give the message

  //for uploading img when click on img
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined); //state for selected image file
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    //render first, if there is a file call this function
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    //for upload image file on firebase storage
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log("upload is "+progress+" % done.")
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => setFormData({ ...formData, photoURL: downloadURL }) //photoUrl -> is in user model
        );
      }
    );
  };

  //input process
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    //call api -> updateUserController
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000); // Hide message after 3 seconds
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  //call api -> deleteUserController
  const deleteHandler = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure);
    }
  };

  //call api ->signoutController
  const signoutHandler = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data)); //data ===currentUser
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  //call api ->getUserListingsController
  const handleShowListings = async () => {
    setListingsVisible(!listingsVisible); // Toggle visibility state
    if (!listingsVisible) {
      // Fetch listings only if they are not already visible
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      }
    }
  };

  //call api => deleteListing
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      //filter delete
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1
        style={{ textShadow: "2px 2px 4px #AF6DCD" }}
        className="text-[#437cb2] text-3xl font-semibold text-center my-7"
      >
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* uploading image & change img :*/}
        {/* link with input:(ref) hidden accept onChange| img:(onClick) */}
        {/*for uploading img, firebase page: storage->get started->production mode->fill 'rules' part*/}
        {/*rule codes are in .env file */}
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.photoURL || currentUser.photoURL} //*important
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-600 font-bold">
              Image successfully uploaded!
            </span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          id="username"
          defaultValue={currentUser.username} //it brings username data  from redux
          onChange={handleChange}
          placeholder="username"
          className=" border p-3 rounded-lg "
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email} //it brings email data from redux
          onChange={handleChange}
          placeholder="email"
          className=" border p-3 rounded-lg "
        />
        <input
          type="password"
          id="password"
          onChange={handleChange}
          placeholder="password"
          className=" border p-3 rounded-lg "
        />

        <button
          disabled={loading}
          className="disabled:opacity-80 uppercase shadow bg-gradient-to-r from-[#83b3df] via-[#c96cd5] to-[#f07461] hover:bg-gradient-to-r hover:from-[#8fb7dd] hover:via-[#ca85d3] hover:to-[#dd8d81] hover:bg-opacity-80 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded"
        >
          {loading ? "Loading.." : " Update"}
        </button>

        <Link
          to={"/create-listing"}
          className=" text-center bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-400 hover:to-blue-400 text-white uppercase font-bold py-3 px-4 rounded"
        >
          Create Listing
        </Link>
      </form>

      <div className="p-2 flex gap-2 pt-5 justify-between">
        <p
          onClick={deleteHandler}
          className="text-[#5890d3] cursor-pointer font-semibold"
        >
          Delete Account
        </p>
        <button
          onClick={handleShowListings}
          className="w-48 text-center bg-gradient-to-r from-blue-500 via-[#8a6cd5] to-[#f07461] hover:from-blue-400 hover:to-red-400 text-white uppercase font-bold 9 rounded"
        >
          {userListings.length > 0
            ? listingsVisible
              ? "Hide Listings"
              : "Show Listings"
            :  "Listings"}
        </button>
        <p className="text-red-700 mt-5">
          {showListingsError ? "Error showing listings" : ""}
        </p>

        <p
          onClick={signoutHandler}
          className="text-[#dd635a] font-semibold cursor-pointer"
          to={"/sign-up"}
        >
          Sign Out
        </p>
      </div>
      {listingsVisible && userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1
            style={{ textShadow: "2px 2px 4px #AF6DCD" }}
            className="text-3xl text-[#437cb2] font-semibold text-center my-7"
          >
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border border-gray-300 rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-600 font-semibold  hover:text-slate-800 truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
                <p>{listing.address}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-[#d36658] font-bold cursor-pointer uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 font-bold cursor-pointer uppercase">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="animate-fadeInOut text-green-600 font-semibold mt-5 p-2">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
    </div>
  );
}

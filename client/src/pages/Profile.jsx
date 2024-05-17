import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  //for uploading img when click on img

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined); //state for selected image file
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log("form data: ", formData);

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

  //

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
          src={formData.photoURL ||currentUser.photoURL} //*important
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-600 font-bold">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

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

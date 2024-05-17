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
import { updateUserStart,updateUserSuccess, updateUserFailure } from "../redux/user/userSlice";

export default function Profile() {
  //for redux process
  const dispatch=useDispatch();
  const { currentUser , loading , error} = useSelector((state) => state.user);
  const [updateSuccess,setUpdateSuccess]=useState(false); //state for if update then give the message

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

  const handleSubmit=async(e)=>{
     //call api -> updateUserController
     e.preventDefault();
     try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
  }


 
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form  onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <button disabled={loading} className="disabled:opacity-80 uppercase shadow bg-gradient-to-r from-[#83b3df] via-[#c96cd5] to-[#f07461] hover:bg-gradient-to-r hover:from-[#8fb7dd] hover:via-[#ca85d3] hover:to-[#dd8d81] hover:bg-opacity-80 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded">
         {loading ? "Loading.." : " Update"}
        </button>
      </form>
      <div className="p-2 flex gap-2 pt-5 justify-between">
        <p className="text-red-700 font-semibold">Delete Account</p>
        <Link className="text-[#427db5] font-semibold" to={"/sign-up"}>
          Sign Out
        </Link>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='animate-fadeInOut text-green-600 font-semibold mt-5 p-2'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
    </div>
  );
}

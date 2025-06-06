// import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import LoginPage from "./components/auth/auth";
import BootUp from "./components/bootUp/BootUp";
import React, { useState, useEffect, useRef } from "react";
// import "./CSS/homepage.css";
import axios from "axios";
import { toast ,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  const [content, setContent] = useState(false);
  const [myuser, setmyuser] = useState("");

// user authentication
  useEffect(() => {
  if(localStorage.getItem('access_token')){
    sessionStorage.removeItem('guest');
    sessionStorage.removeItem('firstVisit');
  }
  // guest mode
  if(sessionStorage.getItem('guest')){
    // unique guest id 

    window.onload = () => {
      if (!sessionStorage.getItem('firstVisit')) {
        alert('Guest Mode is not secure , Use it at your own risk');
        sessionStorage.setItem('firstVisit', 'true');
      }
    };

    function generateUniqueString(length = 5) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*';
      
      let result = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }
      
      return result;
    }
    const m = `guest_user${generateUniqueString(5)}`
    setmyuser(m);
    toast.info("welcome " + m);
    setContent(true);
    // setLoading(false);
  }   
  // guest mode end
  else{
    // Check if user is authenticated
      axios
        .get("https://eco-fjf5.onrender.com/", {
          headers: {
            Authorization: localStorage.getItem("access_token")
              ? "JWT " + localStorage.getItem("access_token")
              : null,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        })
        .then((response) => {
          if (response && response.data.user) {
            setmyuser(response.data.user);
            toast.info("welcome " + response.data.user.username);
            setContent(true);
          }
        })
        .catch((errors) => {
          setContent(false);
        })
        .finally(() => {
          // setLoading(false);
        });
    // Check if user is authenticated end
  }
  }, []);
// end user authentication

  return (
    <>
    <ToastContainer/>
    <BootUp/>
      {content?
        <Home myuser={myuser} content={content} />:
        <LoginPage/>
      }

    </>
  );
};

export default App;

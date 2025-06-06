import { useState, useEffect, useCallback } from "react";
import styles from "./StatusBar.module.css";
import React from 'react'


const StatusBar = ({ toggleAppleMenu,currentApp ,myuser}) => {
  const [currentTime, setCurrentTime] = useState("");

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }
  function checkAP(h){
    if (h >12 ) {
      h = h - 12;
    } // add zero in front of numbers < 10
    return h;
  }

  const getTime = useCallback(() => {
    
    var date = new Date();
    var d = date.getDay();
    var h = date.getHours();
    var m = date.getMinutes();
    m = checkTime(m);
    
    h = checkAP(h);
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    var currentDayAndTime = `${days[d].substr(0, 3)} ${h}:${m}`;
    setCurrentTime(currentDayAndTime);
  }, []);

  useEffect(() => {
    setInterval(() => {
      getTime();
    }, 1000);
  }, [getTime]);


  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.wrapper_inner_left}>
          <img
            onClick={toggleAppleMenu}
            className={styles.appleIcon}
            src="/images/logo.png"
            alt="apple_icon"
          />
          <ul className={styles.left_ul}>
            <li>
              <span>{currentApp ? currentApp.title : `Home`}</span>
            </li>
            <li>
              <span>Help</span>
            </li>
          </ul>
        </div>
        <div className={styles.wrapper_inner_right}>
          <ul className={styles.right_ul}>
            <li style={{marginRight:"5px"}}>
              {myuser.prof_image ?  
              <img src={myuser.prof_image} alt="s5" style={{borderRadius:"50%", width:"22px" ,height:'22px'}} />
              :
              <img src="/images/statusicons/5.png" alt="s5"/>
              }
            </li>
          
            <li>
              <span className={styles.date}>{currentTime}</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default StatusBar;

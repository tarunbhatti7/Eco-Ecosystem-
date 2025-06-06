import * as React from "react";
// import Safari from "./Safari";
import Connect from "./Connect";
import Upload from "./Upload";
export const apps = (myuser , content)=>[
  { 
    id : 1,
    title: "Logs",
    icon: "finder",
    image: "/images/menubarimages/1.png",
    content: () => "App to be delivered soon!"
  },
  {
    title: "Connect",
    icon: "safari",
    image: "/images/menubarimages/9.png",
    content: () => <Connect myuser ={myuser} content={content}/>
  },
  {
    title: "Upload",
    icon: "calculator",
    image: "/images/menubarimages/6.png",
    content: () =><Upload/>
  },
  {
    title: "Settings",
    icon: "appstore",
    image: "/images/menubarimages/11.png",
    content: () => "App to be delivered soon"
  }
];

import React from "react";
import styles from "./Dock.module.css";
import { apps } from "../apps/AppVault";
import { useState } from "react";

export default function Dock({ setCurrentApp , myuser ,content , setContent}) {
  const [availableApps] = React.useState(apps(myuser ,content));
  const [clickedMenuItem, setClickedMenuItem] = useState(0);

  const onMenuChange = (id) => {
    setClickedMenuItem(id);

    setTimeout(() => {
      setClickedMenuItem(0);
    }, 7000);
  };

  return (
    <div className={styles.wrapper}>
      <ul className={styles.ul}>
        {availableApps.map((app) => (
          <li
            key={app.title}
            onClick={() => setCurrentApp(app) && onMenuChange(app.id)}
          >
            {" "}
            
            <img
              className={clickedMenuItem === app.id ? styles.bounceAnimation : ""}
              src={app.image}
              alt={app.title}
              title={app.title}
              style={{cursor:"pointer"}}
            />  
          </li>
        ))}
      </ul>
    </div>
  );
}

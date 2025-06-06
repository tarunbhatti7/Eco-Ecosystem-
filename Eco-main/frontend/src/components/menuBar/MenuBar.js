import React from "react";
import { useState } from "react";
import styles from "./MenuBar.module.css";
import  menuBarData  from "./menuBarData";



const MenuBar = ({setCurrentApp}) => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const [clickedMenuItem, setClickedMenuItem] = useState(0);
  const [availableApps] = React.useState(menuBarData);
 

  

  const handleMouseLeave = () => {
    setMenuBarOpen(!menuBarOpen);
  };

  const onMenuChange = (id) => {
    setClickedMenuItem(id);

    setTimeout(() => {
      setClickedMenuItem(0);
    }, 7000);
  };

  return (
    <>

      <div className={styles.wrapper} onMouseLeave={handleMouseLeave}>
        <ul className={styles.ul}>
          {availableApps.map((data) => (
            <li
              style={{ textAlign: "center" }}
              key={data.id}
              id={data.id}
              onClick={() => onMenuChange(data.id)&& setCurrentApp(data)}
            >
              <img
                className={
                  clickedMenuItem === data.id ? styles.bounceAnimation : ""
                }
                src={data.image}
                alt="image_alt"
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MenuBar;

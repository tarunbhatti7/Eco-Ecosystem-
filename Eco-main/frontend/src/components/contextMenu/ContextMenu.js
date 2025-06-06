import React from "react";
import "./ContextMenu.css";
import axiosInstance from "axios";
import { toast} from "react-toastify";

function ContextMenu({ toggleVisibility, position }) {
  // logout 
  const handleLogout = () => {
    if(sessionStorage.getItem("guest") == "yes"){
      toast.info("You are in guest mode Just end the session");
    }
    else{
      const m = toast.loading("Please wait");
      const response = axiosInstance.post("https://eco-fjf5.onrender.com/logou_t/", {
          refresh_token: localStorage.getItem("refresh_token"),
      })
      .then(()=>{
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        axiosInstance.defaults.headers["Authorization"] = null;
        window.location.href = "/";
      })
    }
  };
  // logout end

  return (
    <div
      style={{
        visibility: toggleVisibility ? "visible" : "hidden",
        top: position.x,
        left: position.y,
      }}
      className="context-menu"
      id="context-menu"
    >
      <div className="dropdown-item context-item first">New Folder</div>

      <div className="divider context-divider" />

      <div className="dropdown-item context-item">Get Info</div>

      <div className="dropdown-item context-item">
        Change Desktop Background
      </div>

      <div className="divider context-divider" />
      <div className="dropdown-item context-item">Use Stacks</div>
      <div className="dropdown-item context-item">Sort By</div>
      <div className="dropdown-item context-item">Clean Up</div>
      <div className="dropdown-item context-item">Clean Up By</div>
      <div className="dropdown-item context-item" onClick={handleLogout}>
        LogOut
      </div>
    </div>
  );
}

export default ContextMenu;

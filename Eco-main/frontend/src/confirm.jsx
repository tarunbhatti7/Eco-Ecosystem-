import React from "react";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";

// sound toast
  function playSound(url) {
    const audio = new Audio(url);
    audio.play();
  }

  function soundToast(message, soundUrl, options = {}) {
    playSound(soundUrl);
    toast(message, options);
  }
// end sound toast

// message box
const ConfirmToast = (f_user, filename, copy , copied_val) => {
  return new Promise((resolve) => {
    if (filename) {
      const box = (
        <div>
          <p style={{color:"black"}}>{`${f_user} copied a file named ${filename}. Do you want to see it?`}</p>
          <button onClick={() => resolve(true)}>Yes</button>
          <button onClick={() => resolve(false)}>Cancel</button>
        </div>
      );
      soundToast(box,'/notification.mp3',{type:'info', closeOnClick: true, autoClose: false });
    } else if (copy) {
      const box = (
        <div>
          <p style={{color:"black"}}>{`${f_user} copied a text ${copy}. Do you want to copy it?`}</p>
          <CopyToClipboard text={copied_val}>
          <button onClick={() => {resolve(true);toast.info("Copied!");}}>
              Copy
          </button>
          </CopyToClipboard>
          <button onClick={() => resolve(false)}>Cancel</button>
        </div>
      );
      soundToast(box,'/notification.mp3',{type:'info', closeOnClick: true, autoClose: false });    }
  });
};

// message box end

export default ConfirmToast;

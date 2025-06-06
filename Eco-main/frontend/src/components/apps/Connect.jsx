import React, { useState, useEffect, useRef } from "react";
import "./CSS/homepage.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";

// confirm notification
import ConfirmToast from "../../confirm";
//

function Connect({myuser , content}) {

  // const [loading, setLoading] = useState(true);
  const [encodedNumber, setEncodedNumber] = useState(null);
  const [codedata, setCodedata] = useState({});
  const [webSocket, setWebSocket] = useState(null);
  const [list, setList] = useState([]);
  const [check, setcheck] = useState(false);


  const textElementRef = useRef(null);
  const fileElementRef = useRef(null);

  let mainToken = localStorage.getItem("main_token");
  let socketToken = localStorage.getItem("socket_token");

// drag and drop
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      // Send the file to WebSocket
    }
  };

  const handleClick = () => {
    fileElementRef.current.click();
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    if (file != null) {
      sendClipboardUpdate();
    }
  }, [file]);
// end


// encryption
  function sanitizeGroupName(groupName) {
    return groupName.replace(/[^a-zA-Z0-9._-]/g, "_");
  }

  function generateKey(code) {
    return CryptoJS.SHA256(code).toString(CryptoJS.enc.Hex).slice(0, 32);
  }

  function encryptCode(code) {
    const key = generateKey(code);
    const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
    const encrypted = CryptoJS.AES.encrypt(code, CryptoJS.enc.Hex.parse(key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return sanitizeGroupName(encrypted.toString());
  }
// encryption end


// code generation
  function generateAndEncodeNumber(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomNumber = "";
    for (let i = 0; i < length; i++) {
      randomNumber += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomNumber;
  }
// code generartion end

// WebSocket

  // connect websocket
  const connectWebSocket = (token) => {
    if(!sessionStorage.getItem('guest')){
      let encryptkey = encryptCode(token);
      const ws = new WebSocket(
        `wss://eco-fjf5.onrender.com/ws/${encryptkey}/?token=${localStorage.getItem(
          "access_token"
        )}`
      );
      ws.onopen = () => {
        if (token == mainToken) {
          toast.info(`Connected to yourself`);
        } else {
          toast.info(`Connected to device with code ${token}`);
        }
      };
      setWebSocket(ws);
    }
    else{
      let encryptkey = encryptCode(token);
      const ws = new WebSocket(
        `wss://eco-fjf5.onrender.com/ws/${encryptkey}/?guest=${myuser}`
      );
      ws.onopen = () => {
        toast.info(`Connected to device with code ${token}`);
        
      };
      setWebSocket(ws);
    }
  };
  // end connect websocket

  // connection change
  useEffect(() => {
    if (content && !sessionStorage.getItem('guest')) {
      if (!mainToken && !socketToken) {
        const newToken = generateAndEncodeNumber(6);

        if (newToken != undefined) {
          localStorage.setItem("main_token", newToken);
          setEncodedNumber(newToken);
          connectWebSocket(newToken);
        } else {
          toast.warn("something wrong with main_token");
        }
      } else if (mainToken && !socketToken) {
        setEncodedNumber(mainToken);
        connectWebSocket(mainToken);
      }

      if (socketToken != undefined && mainToken != undefined) {
        setEncodedNumber(socketToken);
        connectWebSocket(socketToken);
        setcheck(true);
      }
    }
  }, [content]);
  // end connection change

  // handle submitted code
  function handleChangeCode(event) {
    const { name, value } = event.target;
    setCodedata((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  }

  function submitCode(event) {
    event.preventDefault();
    const newCode = codedata.code;

    if(!sessionStorage.getItem('guest')){
      if (newCode != undefined) {
        localStorage.setItem("socket_token", newCode);
        if (webSocket) webSocket.close();
        connectWebSocket(newCode);
        setcheck(true);
        setEncodedNumber(newCode);
      } else {
        toast.warn("enter a code to connect");
      }
    }
    else{
      if (newCode != undefined) {

        connectWebSocket(newCode);
        setcheck(true);
        setEncodedNumber(newCode);
      }
      else {
        toast.warn("enter a code to connect");
      }
    }
  }
  // end handle submitted code

  // send clipboard
  let sendingtoast = null;
  function sendClipboardUpdate() {
    const textElement = textElementRef.current;
    const text = textElement?.value;
    let fileData = null;
    let fileName = null;

    let user = '';
    if(sessionStorage.getItem('guest') == 'yes'){
      user = myuser;
    }
    else{
      user = myuser.username;
    }

    if (file) {
      sendingtoast = toast.loading("preparing file....", {
        autoClose: false,
      });

      const reader = new FileReader();

      reader.onload = function (e) {
        fileData = e.target.result.split(",")[1];
        fileName = file.name;

        toast.update(sendingtoast, {
          render: "Sending file...",
          autoClose: false,
          isLoading: true,
        });
        webSocket.send(
          JSON.stringify({
            typeof: "copy",
            copy: null,
            file: fileData,
            file_name: fileName,
            f_user: user,
          })
        );
      };
      reader.readAsDataURL(file);

      setTimeout(() => {
        fileElementRef.current.value = "";
        setFile(null);
      }, 3000);
    } else if (text) {
      webSocket.send(
        JSON.stringify({
          typeof: "copy",
          copy: text,
          file: null,
          f_user: user,
        })
      );
      toast.success(`Text Sent`);
      // Clear the text input after sending
      setTimeout(() => {
        textElementRef.current.value = "";
      }, 3000);
    }

    // else{
    //     toast.warn('No content to send');
    // }
  }
  // end send clipboard

  // recieving
  useEffect(() => {
    const textElement = textElementRef.current;
    const fileElement = fileElementRef.current;

    let user = '';
    if(sessionStorage.getItem('guest') == 'yes'){
      user = myuser;
    }
    else{
      user = myuser.username;
    }
    
    if (webSocket) {
      webSocket.onmessage = function (e) {
        const k = JSON.parse(e.data);

        if (k.typeof == "p_message_b") {
          setList(k.list);
        }

        if (k.typeof == "copy" && user != k.f_user && k.f_user != undefined) {
          handleIncomingCopy(k);
        }

        if (k.typeof == "group_dis") {
          if (k.disa == "disconnect_all") {
            if (socketToken != undefined || sessionStorage.getItem('guest') != undefined) {
              dis_socket();
            }
          }
        }

        if (k.typeof == "progress") {
          if (k.sent == "done") {
            toast.dismiss(sendingtoast);
            toast.success(`File Sent`);
            sendingtoast = null;
          }
        }
      };

      if (textElement != null) {
        textElement.addEventListener("copy", sendClipboardUpdate);
      }

      if (fileElement != null) {
        fileElement.addEventListener("change", sendClipboardUpdate);
      }

      return () => {
        if (textElement != null) {
          textElement.removeEventListener("copy", sendClipboardUpdate);
        }
        if (fileElement != null) {
          fileElement.removeEventListener("change", sendClipboardUpdate);
        }
      };
    }
  }, [webSocket]);
  // end recieving

  // file download setup
  function downloadFile(filename, filedata) {
    const byteCharacters = atob(filedata);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/octet-stream" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  }

  // incoming copy handler
  async function handleIncomingCopy(k) {
    const textToCopy = k["copy_text"];
    const filename = k["file_name"];
    const filedata = k["file_data"];
    const f_user = k["f_user"];

    if (filename && filedata) {
      if (f_user && filedata && filename) {
        const userConfirmed = await ConfirmToast(f_user, filename, null ,null);
        if (userConfirmed) {
          downloadFile(filename, filedata);
        }
      }
    } else if (textToCopy) {
      const copiedText =
        textToCopy.length > 50 ? `${textToCopy.slice(0, 50)}...` : textToCopy;
      if (f_user && copiedText) {
        const userConfirmed = await ConfirmToast(f_user, null, copiedText , textToCopy);
      }
    }
  }
  // end incomming copy handler

  // disconnect
  function dis_socket() {
    if (check == true ) {
      if(localStorage.getItem("socket_token") != undefined){
        webSocket.close();
        toast.info("disconnected");
        localStorage.removeItem("socket_token");
        connectWebSocket(mainToken);
        setEncodedNumber(mainToken);
        setcheck(false);
      }
      else if(sessionStorage.getItem('guest') != undefined){
        webSocket.close();
        toast.info("disconnected");
        setEncodedNumber(null);
        setcheck(false);
        setList(null);
      }
    } else if (check == false && localStorage.getItem("socket_token") == null) {
      webSocket.send(
        JSON.stringify({
          typeof: "group_dis",
          disa: "disconnect_all",
        })
      );
      toast.info("disconnected");
    } else if (localStorage.getItem("socket_token") == undefined) {
      toast.info("you are not connected to anyone");
    }
  }
  // end disconnect
  
// websocket end
    return (
      <div className="container-home">
        <p id="notify" style={{ backgroundColor: "red" }}>
          {encodedNumber}
        </p>
        <p>Connected User list: {list}</p>
        <p>connect by adding code:</p>
        <form>
          <input
            type="password"
            name="code"
            onChange={handleChangeCode}
            placeholder="Code"
            autoComplete="off"
          />
          <button onClick={submitCode} style={{ marginLeft: "10px" }}>
            Connect
          </button>
          <button
            onClick={dis_socket}
            type="button"
            style={{ marginLeft: "10px", background: "red" }}
          >
            Disconnect
          </button>
        </form>

        <p>Let's share... without any fear of privacy leakage</p>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            id="text"
            ref={textElementRef}
            placeholder="Enter your text here"
            autoComplete="off"
          />
        </div>

        <div
          className={`drag-drop-container ${dragActive ? "active" : ""}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          style={{
            marginTop:'10px',
            left: "50%",
            width :'80%',
            height:'60px',
            border: "2px dashed #ccc",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: dragActive ? "#f9f9f9" : "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "background-color 0.3s, box-shadow 0.3s",
          }}
        >
          <input
            ref={fileElementRef}
            type="file"
            className="file-input"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <p className="drag-drop-message" style={{ color: "#888" }}>
            {file
              ? `File selected: ${file.name}`
              : "Drag & Drop your file here or Click to upload"}
          </p>
        </div>

      </div>
    );

}

export default Connect;

import React, { useState } from "react";

export default function Safari() {
  const [currentUrl, setCurrentUrl] = useState("https://www.worldometers.info/coronavirus/");

  return (
    <div style={{"width":"100%","height":"100%"}}>
      <div style={{"display":"flex","justifyContent":"center","alignItems":"center","height":"2rem","backgroundColor":"#D1D5DB"}}>
        <input
          type="text"
          value={currentUrl}
          onChange={(e) => setCurrentUrl(e.target.value)}
          style={{"padding":"0.5rem","borderRadius":"0.25rem","width":"80%","height":"1.5rem","fontWeight":600,"textAlign":"center"}}
        />
      </div>
      <iframe title={"Safari clone browser"} src={currentUrl} frameborder="0" style={{"width":"100%","height":"100%"}}/>
    </div>
  );
}




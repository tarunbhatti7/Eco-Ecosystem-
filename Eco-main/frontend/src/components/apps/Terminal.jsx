import React, { useState } from "react";

export default function Terminal() {
  const [inputValue, setInputValue] = useState("");
  const [bufferval, setBufferval] = useState([]);

  const evaluate = (e) => {
    const keyCode = e.which || e.keyCode;
    var output = "Error: Check your syntax";
    if (keyCode === 13) {
      // Enter pressed
      try {
        output = eval(inputValue);
      } catch (e) {
        if (e instanceof SyntaxError) {
          output = e.message;
        }
      }
      setBufferval([...bufferval, "$ " + inputValue, "> " + output]);

      setInputValue("");

      return false;
    }
  };

  return (
    <div style={{"width":"100%","height":"100%","color":"#ffffff","backgroundColor":"#000000"}}>
      <div style={{"paddingLeft":"0.375rem","paddingRight":"0.375rem","paddingTop":"0.5rem","width":"100%","height":"max-content"}}>
        <span style={{"color":"#6EE7B7"}}>ヽ(ˋ▽ˊ)ノ</span>: Hey, you found the
        terminal ! Type below to get started :)
      </div>
      {bufferval.map((t) => (
        <p style={{"fontFamily":"Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace"}}>{t}</p>
      ))}
      <input
        type="text"
        value={"$ " + inputValue}
        onChange={(e) => setInputValue(e.target.value.substring(2))}
        onKeyPress={evaluate}
        style={{"width":"100%","fontFamily":"Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace","color":"#ffffff","backgroundColor":"#000000",border:"none"}}
      />
    </div>
  );
}

import React from "react";
import Draggable from "react-draggable";
import style from "./WindowArea.module.css";
import { toast } from "react-toastify";


function TrafficLights({ setCurrentApp,app,setMax, max}) {
  // checking app and showing message for connect
  function close_con_on_guest(app){
    if(app.title == 'Connect'){
      const userConfirmed = window.confirm("Make sure to disconnect, the connection won't disconnect automatically on closing.");
      if (userConfirmed) {
          setCurrentApp(null);
      }
      else{
        toast.info('disconnect by pressing disconnect button');
      }
    }
    else{
      setCurrentApp(null);
    }
  }

  return (
    <div className={style.traffic_lights}>
      <button
        className={style.red}
        onClick={() => {close_con_on_guest(app);}}
      />
      <button
        className={style.yellow}
        onClick={() => setMax(false)}
      />
      <button
        className={style.green}
        onClick={() => setMax(!max)}
      />
    </div>
  );
}

export default function WindowArea({ app,currentApp, setCurrentApp}) {
  const [max, setMax] = React.useState(false);

  if (currentApp == null) {
    return <div />;
  }
  return (
    <Draggable>
      <div className={style.drag}>
        <div className={style.light_wrapper}>
          <TrafficLights
            setCurrentApp={setCurrentApp}
            max={max}
            setMax={setMax}
            app={app}
          />
          <span className={style.title}>
            {currentApp.title}
          </span>
        </div>
        <div className={style.desc} >
          {currentApp.content?.() ?? `I'm ${currentApp.title} app`}
        </div>
      </div>
    </Draggable>
  );
}

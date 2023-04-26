import React, { useCallback, useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./App.css";
// import Sequencer from "./components/Sequencer";
import DrumSequencer from "./components/Drum";
import BassSequencer from "./components/Bass";
import * as Tone from "tone";
import Sequencer from "./components/Sequencer";
function App() {
  // const [playState, setPlayState] = useState(Tone.Transport.state);
  const [count, setCount] = useState(0);
  const [mouse_IsDown, setMouse_IsDown] = useState(false);
  // const toggle = useCallback(() => {
  //   Tone.start();
  //   Tone.Transport.toggle();
  //   setPlayState(Tone.Transport.state);
  // }, []);

  useEffect(() => {
    document.documentElement.addEventListener("mousedown", function () {
      setMouse_IsDown(true);
      if (Tone.context.state !== "running") {
        Tone.context.resume();
      }
    });
  }, []);

  useEffect(() => {
    const handleUserGesture = () => {
      if (Tone.context.state !== "running") {
        Tone.context.resume();
      }
    };

    document.addEventListener("mousedown", handleUserGesture, { once: true });
    document.addEventListener("touchstart", handleUserGesture, { once: true });

    return () => {
      document.removeEventListener("mousedown", handleUserGesture);
      document.removeEventListener("touchstart", handleUserGesture);
    };
  }, []);
  return (
    <>
      <div className='bg-gradient-to-br from-gray-900 to-gray-700 border-2 border-gray-400 rounded-lg shadow-md text-gray-400 text-center text-shadow-md text-lg lg:p-6 orbitron'>
        {mouse_IsDown && (
          <>
            {/* <BassSequencer /> */}
            <Sequencer mouse_IsDown={mouse_IsDown} />
            <DrumSequencer />
            {/* <div onClick={() => toggle()}>{playState}</div> */}
          </>
        )}
        {!mouse_IsDown && (
          <>
            <p>Click to start</p>
          </>
        )}

        {/* <Sequencer /> */}

        {/* <Tabs forceRenderTabPanel>
          <TabList>
            <Tab>Bass</Tab>
            <Tab>Lead</Tab>
            <Tab>Drums</Tab>
          </TabList>

          <TabPanel>
            <BassSequencer />
          </TabPanel>
          <TabPanel>
            <Sequencer />
          </TabPanel>
          <TabPanel>
            <DrumSequencer />
          </TabPanel>
        </Tabs> */}
      </div>
    </>
  );
}

export default App;

import React, { useCallback, useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import Sequencer from "./components/Sequencer";
import DrumSequencer from "./components/Drum";
import BassSequencer from "./components/Bass";
import * as Tone from "tone";
function App() {
  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [count, setCount] = useState(0);
  const [mouse_IsDown, setMouse_IsDown] = useState(false);
  const toggle = useCallback(() => {
    Tone.start();
    Tone.Transport.toggle();
    setPlayState(Tone.Transport.state);
  }, []);

  useEffect(() => {
    document.documentElement.addEventListener("mousedown", function () {
      setMouse_IsDown(true);
      if (Tone.context.state !== "running") {
        Tone.context.resume();
      }
    });
  }, []);
  return (
    <>
      <div className='outer'>
        {mouse_IsDown && (
          <>
            <BassSequencer />
            <DrumSequencer />
            {/* <div onClick={() => toggle()}>{playState}</div> */}
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

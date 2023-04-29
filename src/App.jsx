import React, { useCallback, useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./App.css";
// import Sequencer from "./components/Sequencer";
import DrumSequencer from "./components/Drum";

import * as Tone from "tone";
import Bass from "./components/Bass";
import Lead from "./components/Lead";
function App() {
  // const [playState, setPlayState] = useState(Tone.Transport.state);
  const [count, setCount] = useState(0);
  const [mouse_IsDown, setMouse_IsDown] = useState(false);
  const [patternLength, setPatternLength] = useState(16);
  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [bpm, setBpm] = useState(120);
  // const toggle = useCallback(() => {
  //   Tone.start();
  //   Tone.Transport.toggle();
  //   setPlayState(Tone.Transport.state);
  // }, []);
  function handleBpmChange(event) {
    setBpm(event.target.value);
  }
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

  useEffect(() => {
    console.log(patternLength);
  }, [patternLength]);
  const toggle = useCallback(() => {
    Tone.Transport.toggle();
    setPlayState(Tone.Transport.state);
  }, []);
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);
  return (
    <>
      <div className='bg-gradient-to-br from-gray-900 to-gray-700 border-2 border-gray-400 rounded-lg shadow-md text-gray-400 text-center text-shadow-md text-lg lg:p-6 orbitron'>
        {mouse_IsDown && (
          <>
            {/* <BassSequencer /> */}

            {/* <Sequencer
              patternLength={patternLength}
              mouse_IsDown={mouse_IsDown}
            /> */}
            <Tabs forceRenderTabPanel>
              <TabList>
                <Tab>Bass</Tab>
                <Tab>Lead</Tab>
              </TabList>
              <TabPanel>
                <Bass patternLength={patternLength} />
              </TabPanel>

              <TabPanel>
                <Lead patternLength={patternLength} />
              </TabPanel>
            </Tabs>
            <DrumSequencer patternLength={patternLength} />
            {/* <Lead patternLength={patternLength} /> */}
            {/* <div className='sequencer-controls flex justify-between p-4 flex-col'>
              <button onClick={toggle}>
                {playState === "started" ? "Stop" : "Start"}
              </button>

              <div className='flex items-center justify-center'>
                <div className='flex p-4'>
                  <span className=''>BPM:</span>
                  <span>{bpm}</span>
                </div>
                <input
                  className='w-[70%]'
                  type='range'
                  min='60'
                  max='240'
                  value={bpm}
                  onChange={handleBpmChange}
                />
              </div>

            </div> */}
            {/* <div onClick={() => toggle()}>{playState}</div> */}
            <div className='flex items-center w-full px-4 justify-center'>
              <p>pattern length</p>
              <select
                onChange={(e) => setPatternLength(e.target.value)}
                className='rounded-lg p-2 m-2'
              >
                <option value='16'>16</option>
                <option value='32'>32</option>
              </select>
            </div>
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
            <Lead />
          </TabPanel>
          <TabPanel>
            <Sequencer />
          </TabPanel>
 
        </Tabs> */}
        {/* <DrumSequencer /> */}
      </div>
    </>
  );
}

export default App;

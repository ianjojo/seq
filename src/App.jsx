import React, { useCallback, useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./App.css";
// import Sequencer from "./components/Sequencer";
import DrumSequencer from "./components/Drum";
import logo from "./logo.png";
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
      <div className='bg-[#110e1b] lg:border-4 border-[#7a0066]  rounded-lg shadow-md text-gray-400 text-center text-shadow-md text-lg  lg:p-6 orbitron w-full lg:h-[100%] shadow-[0_20px_80px_rgba(122,_0,_102,_0.7)]  '>
        <div className='flex justify-between w-full items-center'>
          <div className='flex justify-center items-center h-200 '>
            <div className='flex items-center  rounded-2xl lg:p-4 shadow-md'>
              {/* <img
                src={logo}
                alt='logo image'
                className='w-8 h-8 lg:w-12 lg:h-12 object-cover lg:ml-4'
              />{" "} */}
              <div className='flex justify-center items-center '>
                <span className=' text-sm        bg-clip-text  text-transparent   bg-gradient-to-r  from-blue-600  to-purple-600 lg:text-3xl  tracking-wider uppercase lg:mr-4'>
                  seq
                </span>
                <p className='text-xs'>v 0.3</p>
              </div>
            </div>
          </div>
          <p>
            by{" "}
            <a
              className='text-gray-200 underline text-sm hover:text-gray-400'
              href='https://ianjojo.dev'
              target='_blank'
            >
              ianjojo
            </a>
          </p>
        </div>
        {mouse_IsDown && (
          <>
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

            <div className='text-sm flex items-center w-full px-4 justify-center'>
              <p>pattern length</p>
              <select
                onChange={(e) => setPatternLength(e.target.value)}
                className='text-sm rounded-lg p-2 m-2'
              >
                <option value='16'>16</option>
                <option value='32'>32</option>
              </select>
            </div>
          </>
        )}
        {!mouse_IsDown && (
          <div className='flex  flex-col h-screenjustify-center items-center'>
            <>
              <p className='text-xs text-left w-[90%] max-w-[500px]'>
                Welcome to SEQ. SEQ is an interactive playground inspired by
                Propellerheads' Rebirth, consisting of a bass synth, a lead
                synth and a drum machine. Compose your loop by clicking squares
                in the desired note/drum row. Use the Random buttons to generate
                inspirations and the Clear button to start again.
              </p>
              <p className='mt-4'>Click anywhere to begin</p>
            </>
          </div>
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

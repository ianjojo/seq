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
  const [count, setCount] = useState(0);
  const [mouse_IsDown, setMouse_IsDown] = useState(false);
  const [patternLength, setPatternLength] = useState(16);
  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [bpm, setBpm] = useState(120);
  const [gitArray, setGitArray] = useState([]);
  const [playMyGithub, setPlayMyGithub] = useState(false);
  const [gitName, setGitName] = useState("");
  const [reverseGitArray, setReverseGitArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleTextInput = (e) => {
    setMessage("");
    setGitName(e.target.value);
  };
  useEffect(() => {
    // when the component is mounted, the alert is displayed for 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 5000);
  }, [message]);
  function splitDataIntoEightArrays(data) {
    const result = [[], [], [], [], [], [], [], []];
    let currentIndex = 0;
    let arrayCounts = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < 8 * 16; i++) {
      if (arrayCounts.every((count) => count === 16)) {
        break; // All 8 arrays are full, exit the loop
      }

      const currentArrayIndex = i % 8;
      if (arrayCounts[currentArrayIndex] < 16) {
        const value = data[currentIndex] > 0 ? 1 : 0;
        result[currentArrayIndex][arrayCounts[currentArrayIndex]] = value;
        arrayCounts[currentArrayIndex]++;
      }

      currentIndex = (currentIndex + 1) % data.length;
    }

    return result;
  }
  async function getAllEvents(username) {
    let allEvents = [];
    let page = 1;
    let totalPages = 1;
    setLoading(true);
    setShowModal(false);
    while (page <= totalPages) {
      const response = await fetch(
        `https://api.github.com/users/${username}/events?page=${page}`
      );
      const data = await response.json();
      allEvents = allEvents.concat(data);
      const linkHeader = response.headers.get("Link");
      if (linkHeader) {
        const links = linkHeader.split(", ");
        const lastLink = links.find((link) => link.includes('rel="last"'));
        if (lastLink) {
          const match = /page=(\d+)/.exec(lastLink);
          totalPages = parseInt(match[1]);
        }
      }
      page++;
    }
    console.log(allEvents.length);
    // sort events by date
    if (allEvents.length < 2) {
      setLoading(false);
      return;
    } else {
      allEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // combine events into an array
      const startTime = new Date(allEvents[allEvents.length - 1].created_at);
      const endTime = new Date(allEvents[0].created_at);
      const days = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
      const activity = Array(days).fill(0);
      allEvents.forEach((event) => {
        const date = new Date(event.created_at);
        const index = Math.floor((date - startTime) / (1000 * 60 * 60 * 24));
        activity[index]++;
      });
      setLoading(false);

      return activity;
    }
  }

  const handlePlayMyGithub = () => {
    getAllEvents(gitName)
      .then((activity) => {
        setGitArray(splitDataIntoEightArrays(activity));
        setReverseGitArray(splitDataIntoEightArrays(activity).reverse());
        setGitName("");
        console.log(gitArray);
      })
      .catch((error) => {
        console.error("Error fetching data from GitHub API:", error);
        setMessage("Error fetching data from GitHub API");
        // TODO: Add error handling logic, such as setting an error message state
      });
  };

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

  // to prevent the Chrome warning about audio context, we first wait for user input before starting audio
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
  function cleanPattern(pattern) {
    const cleanedPattern = [];
    for (let colIndex = 0; colIndex < 16; colIndex++) {
      let hasOne = false;
      const cleanedCol = [];
      for (let rowIndex = 0; rowIndex < pattern.length; rowIndex++) {
        const value = pattern[rowIndex][colIndex];
        if (value === 1 && !hasOne) {
          cleanedCol.push(1);
          hasOne = true;
        } else {
          cleanedCol.push(0);
        }
      }
      cleanedPattern.push(cleanedCol);
    }
    return cleanedPattern;
  }

  const handleModalClick = () => {
    setShowModal(!showModal);
  };
  useEffect(() => {}, [patternLength]);

  const toggle = useCallback(() => {
    Tone.Transport.toggle();
    setPlayState(Tone.Transport.state);
  }, []);
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);
  return (
    <>
      {loading && (
        <div className='h-screen w-screen justify-center items-center flex fixed top-0 left-0 bg-black/50'>
          <div className='lds-hourglass'></div>
          loading...
        </div>
      )}
      {showModal && (
        <div className='flex ml-4 fixed h-screen w-screen justify-center items-center top-0 left-0 bg-black/20 z-40'>
          <div className='flex flex-col p-16 lg:my-8 mt-0 bg-[#1d060e] lg:rounded-2xl lg:border-2 border-[#7a0066] pb-16 z-40'>
            <p className='pb-8  w-full'>enter your GitHub username.</p>
            <div className='flex '>
              <input
                type='text'
                value={gitName}
                placeholder='github username'
                onChange={handleTextInput}
                className=' w-[150px] mx-4 p-2 rounded-lg'
              />

              <button disabled={!gitName} onClick={handlePlayMyGithub}>
                go!
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='bg-[#110e1b] lg:border-4 border-[#7a0066]  rounded-lg shadow-md text-gray-400 text-center text-shadow-md text-lg  lg:p-6 orbitron w-full lg:h-[100%] shadow-[0_20px_80px_rgba(122,_0,_102,_0.7)]  '>
        <div className='flex justify-between w-full items-center'>
          <div className='flex justify-center items-center h-200 '>
            <div className='flex items-center  rounded-2xl lg:p-4 shadow-md'>
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
                <Bass
                  patternLength={patternLength}
                  gitArray={reverseGitArray}
                />
              </TabPanel>

              <TabPanel>
                <Lead patternLength={patternLength} gitArray={gitArray} />
              </TabPanel>
            </Tabs>
            <DrumSequencer patternLength={patternLength} gitArray={gitArray} />

            <div className='text-sm flex items-center w-full px-4 justify-center'>
              <p>pattern length</p>
              <select
                onChange={(e) => setPatternLength(e.target.value)}
                className='text-sm rounded-lg p-2 m-2'
              >
                <option value='16'>16</option>
                <option value='32'>32</option>
              </select>
              <button onClick={handleModalClick}>git visualizer</button>
            </div>
            {message}
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
      </div>
    </>
  );
}

export default App;

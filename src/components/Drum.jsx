import React, { useCallback, useState, useEffect } from "react";
import * as Tone from "tone";
import "./Sequencer.css";

const drumMap = {
  0: "C2", // kick
  1: "D2", // snare
  2: "F2", // closed hi-hat
  3: "G2", // open hi-hat
  4: "A2", // low tom
  5: "B2", // mid tom
  6: "C3", // high tom
  7: "D3", // crash
};
const drumkits = {
  classic: {
    C2: "/drum-samples/kick.wav",
    D2: "/drum-samples/snare.wav",
    F2: "/drum-samples/closed-hat.wav",
    G2: "/drum-samples/open-hat.wav",
    A2: "/drum-samples/perc1.wav",
    B2: "/drum-samples/perc2.wav",
    C3: "/drum-samples/perc3.wav",
    D3: "/drum-samples/perc4.wav",
  },
  electronic: {
    C2: "/drum-samples/808-kick.wav",
    D2: "/drum-samples/808-snare.wav",
    F2: "/drum-samples/808-hihat.wav",
    G2: "/drum-samples/808-openhat.wav",
    A2: "/drum-samples/808-clap.wav",
    B2: "/drum-samples/808-perc1.wav",
    C3: "/drum-samples/808-perc2.wav",
    D3: "/drum-samples/808-perc3.wav",
  },
  house: {
    C2: "/drum-samples/house-kick.wav",
    D2: "/drum-samples/house-snare.wav",
    F2: "/drum-samples/house-hihat.wav",
    G2: "/drum-samples/house-openhat.wav",
    A2: "/drum-samples/house-clap.wav",
    B2: "/drum-samples/house-perc1.wav",
    C3: "/drum-samples/house-perc2.wav",
    D3: "/drum-samples/house-perc3.wav",
  },
  tr909: {
    C2: "/drum-samples/909-kick.wav",
    D2: "/drum-samples/909-snare.wav",
    F2: "/drum-samples/909-hihat.wav",
    G2: "/drum-samples/909-openhat.wav",
    A2: "/drum-samples/909-clap.wav",
    B2: "/drum-samples/909-tom.wav",
    C3: "/drum-samples/909-ride.wav",
    D3: "/drum-samples/909-rim.wav",
  },
  dmx: {
    C2: "/drum-samples/dmx-kick.wav",
    D2: "/drum-samples/dmx-snare.wav",
    F2: "/drum-samples/dmx-hihat.wav",
    G2: "/drum-samples/dmx-openhat.wav",
    A2: "/drum-samples/dmx-clap.wav",
    B2: "/drum-samples/dmx-perc1.wav",
    C3: "/drum-samples/dmx-perc2.wav",
    D3: "/drum-samples/dmx-perc3.wav",
  },
};
const initialPattern = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const returnDrumName = (drum) => {
  if (drum === "C2") {
    return "BD";
  } else if (drum === "D2") {
    return "SN";
  } else if (drum === "F2") {
    return "CH";
  } else if (drum === "G2") {
    return "OH";
  } else if (drum === "A2") {
    return "CL";
  } else if (drum === "B2") {
    return "PC1";
  } else if (drum === "C3") {
    return "PC2";
  } else if (drum === "D3") {
    return "PC3";
  }
};
const DrumSequencer = ({ patternLength, gitArray }) => {
  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [activeColumn, setColumn] = useState(0);
  const [pattern, updatePattern] = useState(initialPattern);
  const [bpm, setBpm] = useState(120);
  const [drumkit, setDrumkit] = useState("classic");

  const drum = new Tone.Sampler(drumkits[drumkit]).toDestination();
  function handleDrumkitChange(event) {
    setDrumkit(event.target.value);
  }
  const clearPattern = () => {
    const blank16 = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const blank32 = [
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
    ];
    if (pattern[0].length === 16) {
      updatePattern(blank16);
    } else {
      updatePattern(blank32);
    }
  };

  function createRandomPattern(pattern) {
    const numPatterns = 8;
    const patternLength = pattern[0].length;
    const randomPatterns = [];

    for (let i = 0; i < numPatterns; i++) {
      const newPattern = [];

      for (let j = 0; j < patternLength; j++) {
        newPattern.push(Math.random() < 0.9 ? 0 : 1);
      }

      randomPatterns.push(newPattern);
    }

    return randomPatterns;
  }

  const newRandomPattern = () => {
    const randomPattern = createRandomPattern(pattern);
    updatePattern(randomPattern);
  };
  useEffect(() => {
    const array =
      pattern[0].length === 16
        ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        : [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
          ];

    Tone.Transport.bpm.value = bpm;
    const loop = new Tone.Sequence(
      (time, col) => {
        setColumn(col);

        pattern.map((row, drumIndex) => {
          if (row[col]) {
            drum.triggerAttack(drumMap[drumIndex], time);
          }
        });
      },
      array,
      "16n"
    ).start(0);
    return () => loop.dispose();
  }, [pattern, bpm, drumkit, pattern.length]);

  useEffect(() => {
    setPatternLength();
  }, [patternLength]);
  const toggle = useCallback(() => {
    Tone.Transport.toggle();
    setPlayState(Tone.Transport.state);
  }, []);

  function setPattern({ x, y, value }) {
    const patternCopy = [...pattern];
    patternCopy[y][x] = value ? 0 : 1;
    updatePattern(patternCopy);
  }
  function doublePatternSize() {
    initialPattern = initialPattern.concat(
      initialPattern.map((row) => row.slice())
    );
  }
  function doubleArraySize(arr) {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
      const row = arr[i];
      const newRow = [];
      for (let j = 0; j < row.length; j++) {
        newRow.push(row[j], row[j]); // duplicate each element
      }
      newArr.push(newRow);
    }
    return newArr;
  }
  const setPatternLength = () => {
    const length = parseInt(patternLength);
    let patternCopy = [...pattern];
    if (length === 16) {
      for (let i = 0; i < patternCopy.length; i++) {
        if (patternCopy[i].length === 32) {
          patternCopy[i] = patternCopy[i].slice(0, 16);
        }
      }
    } else {
      for (let i = 0; i < patternCopy.length; i++) {
        if (patternCopy[i].length === 16) {
          for (let j = 0; j < 16; j++) {
            patternCopy[i].push(0);
          }
        }
      }
    }
    updatePattern(patternCopy);
  };
  function handleBpmChange(event) {
    setBpm(event.target.value);
  }
  useEffect(() => {
    const beat = [
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],

      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    if (gitArray.length > 1) {
      updatePattern(beat);
    }
  }, [gitArray]);
  return (
    <>
      <div className='p-2  my-4 lg:p-4 pb-4 lg:pb-4 mt-2 bg-[#0b525b50] lg:rounded-2xl lg:border-2 border-[#7a0066] xl:w-[1000px]'>
        <div className='flex items-center justify-evenly'>
          <h1 className='text-sm lg:inline-block p-2 orbitron lg:text-xl text-blue-500 hover:text-blue-700 transition-colors text-left w-full'>
            Rhythm
          </h1>
          <select
            className='text-xs lg:text-md  rounded-lg px-3 py-1 lg:m-2 '
            value={drumkit}
            onChange={handleDrumkitChange}
          >
            <option value='classic'>Synthwave</option>
            <option value='electronic'>TR-808</option>
            <option value='tr909'>TR-909</option>
            <option value='house'>House</option>
            <option value='dmx'>DMX</option>
          </select>
          <button
            onClick={clearPattern}
            className='text-sm lg:text-md rounded-lg p-2 lg:m-2'
          >
            clear
          </button>

          <button
            onClick={newRandomPattern}
            className='text-sm lg:text-md rounded-lg p-2 lg:m-2'
          >
            random
          </button>
        </div>

        {pattern.map((row, y) => (
          <div key={y} className='flex justify-between'>
            <div className='min-w-[60px]  max-w-[100px] px-1 text-left items-center flex lg:font-bold text-sm lg:text-lg'>
              {returnDrumName(Object.values(drumMap)[y])}
            </div>

            {row.map((value, x) => (
              <Square
                key={x}
                active={activeColumn === x}
                selected={!!value}
                onClick={() => setPattern({ x, y, value })}
              />
            ))}
          </div>
        ))}
      </div>

      <div className='sequencer-controls flex justify-between p-4 pb-0 flex-col'>
        <button className='p-1' onClick={toggle}>
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
      </div>
    </>
  );
};
const Square = ({ active, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={` grid-container flex drumsquare items-center justify-center border border-solid ${
        selected
          ? "!bg-[#691ff181] bg-gradient-to-r from-violet-500 to-blue-500 drop-shadow-xl shadow-lg shadow-blue-500/50 animate-pulse"
          : ""
      } ${
        active ? "border-white" : "border-[#999]"
      } min-w-[20px] min-h-[20px] max-w-[160px] max-h-16   w-[100%]  `}
    >
      {selected}
    </div>
  );
};

export default DrumSequencer;

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
const DrumSequencer = () => {
  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [activeColumn, setColumn] = useState(0);
  const [pattern, updatePattern] = useState(initialPattern);
  const [bpm, setBpm] = useState(120);
  const [drumkit, setDrumkit] = useState("classic");
  // const synth = new Tone.Sampler({
  //   C2: "/drum-samples/kick.wav",
  //   D2: "/drum-samples/snare.wav",
  //   F2: "/drum-samples/closed-hat.wav",
  //   G2: "/drum-samples/open-hat.wav",
  //   A2: "/drum-samples/perc1.wav",
  //   B2: "/drum-samples/perc2.wav",
  //   C3: "/drum-samples/perc3.wav",
  //   D3: "/drum-samples/perc4.wav",
  // }).toDestination();

  const drum = new Tone.Sampler(drumkits[drumkit]).toDestination();
  function handleDrumkitChange(event) {
    setDrumkit(event.target.value);
  }
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
  const setPatternLength = (e) => {
    const length = parseInt(e.target.value);
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

      console.log(patternCopy);
    }
    updatePattern(patternCopy);
  };
  function handleBpmChange(event) {
    setBpm(event.target.value);
  }

  return (
    <div className='p-4'>
      <div className='flex'>
        <h1 className='hidden lg:inline-block p-2 orbitron lg:text-2xl text-blue-500 hover:text-blue-700 transition-colors text-left w-full '>
          Rhythm
        </h1>
        <select
          className='border rounded-lg px-3 py-2'
          value={drumkit}
          onChange={handleDrumkitChange}
        >
          <option value='classic'>Synthwave</option>
          <option value='electronic'>TR-808</option>
          <option value='house'>House</option>
        </select>
      </div>
      {/* <select
        onChange={(e) => setPatternLength(e)}
        className='rounded-lg p-2 m-2'
      >
        <option value='16'>16</option>
        <option value='32'>32</option>
      </select> */}
      {pattern.map((row, y) => (
        <div key={y} style={{ display: "flex", justifyContent: "center" }}>
          <div className='w-[50px] lg:w-[100px] px-2 text-left text-sm lg:text-lg items-center flex xl:font-bold'>
            {returnDrumName(Object.values(drumMap)[y])}
          </div>
          {row.map((value, x) => (
            <Square
              key={x}
              active={activeColumn === x}
              selected={value}
              onClick={() => setPattern({ x, y, value })}
            />
          ))}
        </div>
      ))}

      <div className='sequencer-controls flex justify-between p-4 flex-col'>
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
        {/* <button onClick={downloadLoop}>Download Loop</button> */}
      </div>
    </div>
  );
};
const Square = ({ active, value, onClick }) => {
  const [selected, setSelected] = useState(value);

  const handleClick = () => {
    setSelected(!selected);
    onClick(!selected);
  };

  return (
    <div
      // style={{
      //   display: "flex",
      //   alignItems: "center",
      //   justifyContent: "center",
      //   width: 25,
      //   height: 25,
      //   background: selected ? "#691ff181" : "",
      //   border: active ? "1px solid #999" : "1px solid #eee",
      // }}
      onClick={handleClick}
      className={` grid-container flex drumsquare items-center justify-center border border-solid ${
        selected
          ? "!bg-[#691ff181] bg-gradient-to-r from-violet-500 to-blue-500 drop-shadow-xl shadow-lg shadow-blue-500/50 animate-pulse"
          : ""
      } ${
        active ? "border-white" : "border-[#999]"
      } w-[18px] h-[18px] lg:w-[25px] lg:h-[25px] xl:w-[50px] xl:h-[50px]  `}
    >
      {selected}
    </div>
  );
};

export default DrumSequencer;

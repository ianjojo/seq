import React, { useCallback, useState, useEffect } from "react";
import * as Tone from "tone";
import "./Sequencer.css";

// an initial pattern of empty squares
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

const currentSynth = new Tone.MonoSynth().toDestination();
const acidSynth = new Tone.MonoSynth({
  oscillator: {
    type: "sine",
  },
  filter: {
    Q: 1,
    type: "lowpass",
    rolloff: -24,
  },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.4,
    release: 0.5,
  },
}).toDestination();

// the various notes available to each scale
function getNotesForScale(scale) {
  switch (scale) {
    case "C Major":
      return ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3"];
    case "A Minor":
      return ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "A1"];
    case "G Major":
      return ["G2", "A2", "B2", "C2", "D2", "E2", "F#2", "G1"];
    case "E Minor":
      return ["E2", "F#2", "G2", "A2", "B2", "C2", "D2", "E1"];
    case "D Major":
      return ["D2", "E2", "F2#", "G2", "A2", "B2", "C#2", "D1"];
    case "B Minor":
      return ["B2", "C#2", "D2", "E2", "F#2", "G2", "A1", "B1"];
    case "F Major":
      return ["F2", "G2", "A2", "A#2", "C2", "D2", "E2", "F1"];
    case "D Minor":
      return ["D2", "E2", "F2", "G2", "A2", "A#2", "C2", "D1"];
    case "Bb Major":
      return ["Bb2", "C2", "D2", "D#2", "F2", "G1", "A1", "Bb1"];
    case "G Minor":
      return ["G2", "A2", "A#2", "C2", "D2", "D#2", "F3"];
    default:
      return [];
  }
}
const Bass = ({ mouse_IsDown, patternLength, gitArray }) => {
  const [currentScale, setCurrentScale] = useState([
    "C2",
    "D2",
    "E2",
    "F2",
    "G2",
    "A2",
    "B2",
    "C3",
  ]);
  const notes = currentScale;
  // const notes = currentScale.reverse();
  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [activeColumn, setColumn] = useState(0);
  const [pattern, updatePattern] = useState(initialPattern);
  const [currentSound, setCurrentSound] = useState("acid");
  const [oscillatorType, setOscillatorType] = useState("sine");
  const [reverseArray, setReverseArray] = useState([]);

  function createRandomPattern(numRows, numCols, chanceOfZero = 0.1) {
    const pattern = [];
    for (let j = 0; j < numCols; j++) {
      const row = new Array(numRows).fill(0);
      const i = Math.floor(Math.random() * numRows);
      if (Math.random() < chanceOfZero) {
        row[i] = 0;
      } else {
        row[i] = 1;
      }
      pattern.push(row);
    }
    return pattern;
  }

  const newRandomPattern = () => {
    const randomPattern = createRandomPattern(pattern[0].length, 8);
    updatePattern(randomPattern);
  };
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
  // const reverseArrays = (array) => {
  //   array.reverse();
  //   for (let i = 0; i < array.length; i++) {
  //     array[i].reverse();
  //   }
  //   setGitArrayReverse(array);
  // };

  useEffect(() => {
    if (gitArray.length > 1) {
      let newArray = gitArray.reverse();

      for (let i = 0; i < newArray.length; i++) {
        newArray[i].reverse();
      }
      setReverseArray(newArray);
    }
  }, [gitArray]);

  useEffect(() => {
    updatePattern(reverseArray.reverse());
  }, [reverseArray]);
  useEffect(
    () => {
      const array =
        pattern[0].length === 16
          ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
          : [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
            ];
      acidSynth.oscillator.type = oscillatorType;
      const synth = currentSound === "current" ? currentSynth : acidSynth;
      const loop = new Tone.Sequence(
        (time, col) => {
          // Update active column for animation
          setColumn(col);

          // Loop current pattern
          pattern.map((row, noteIndex) => {
            // If active
            if (row[col]) {
              // Play based on which row
              acidSynth.triggerAttackRelease(
                currentScale[noteIndex],
                "8n",
                time
              );
            }
          });
        },
        array,
        "16n"
      ).start(0);
      return () => {
        // Tone.Transport.cancel();
        // Tone.Transport.clear(Tone.Transport.scheduleRepeat);
        loop.dispose();
      };
    },
    [pattern, currentScale, oscillatorType] // Retrigger when pattern changes
  );
  useEffect(() => {
    setPatternLength();
  }, [patternLength]);
  // Toggle playing / stopped
  const toggle = useCallback(() => {
    Tone.start();
    Tone.Transport.toggle();
    setPlayState(Tone.Transport.state);
  }, []);

  const setOsc = (e) => {
    setOscillatorType(e.target.value);
  };
  // Update pattern by making a copy and inverting the value
  function setPattern({ x, y, value }) {
    const patternCopy = [...pattern];
    patternCopy[y][x] = +!value;
    updatePattern(patternCopy);
  }

  // Update scale
  function setScale(e) {
    setCurrentScale(getNotesForScale(e.target.value));
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

      console.log(patternCopy);
    }
    updatePattern(patternCopy);
  };
  return (
    <div className='p-4 lg:my-8 mt-0 lg:border-2 bg-[#3a015c70] lg:rounded-2xl  border-[#7a0066] '>
      <div className='flex items-center justify-evenly pb-4'>
        <h1 className='hidden lg:inline-block p-2 orbitron text-xl min-w-[80px]  text-blue-500 hover:text-blue-700 transition-colors text-left w-full '>
          Bass
        </h1>
        <div className='flex items-center pr-4'>
          <p className='hidden lg:inline-block '>key</p>
          <select
            onChange={(e) => setScale(e)}
            className='text-sm lg:text-md rounded-lg p-2 lg:m-2'
          >
            <option value='C Major'>C Major</option>
            <option value='A Minor'>A Minor</option>
            <option value='G Major'>G Major</option>
            <option value='E Minor'>E Minor</option>
            <option value='D Major'>D Major</option>
            <option value='B Minor'>B Minor</option>
            <option value='F Major'>F Major</option>
            <option value='D Minor'>D Minor</option>
            <option value='Bb Major'>Bb Major</option>
          </select>
        </div>
        <div className='flex items-center'>
          <p className='hidden lg:inline-block w-full'>osc</p>
          <select
            onChange={(e) => setOsc(e)}
            className='text-sm lg:text-md rounded-lg p-2 lg:m-2'
          >
            <option value='sine'>sine</option>
            <option value='sawtooth'>sawtooth</option>
            <option value='pulse'>pulse</option>
            <option value='triangle'>triangle</option>
            <option value='square'>square</option>
          </select>
        </div>
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
      <div style={{ display: "flex", justifyContent: "center " }}>
        <div style={{ width: 25 }} />
      </div>
      {pattern.map((row, y) => (
        <div className='flex justify-between' key={y}>
          <div className='min-w-[60px]  max-w-[100px] px-1 text-left items-center flex lg:font-bold text-sm lg:text-lg'>
            {notes[y]}
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
  );
};

const Square = ({ active, selected, onClick }) => {
  return (
    <div
      className={` drumsquare grid-container flex items-center justify-center border border-solid ${
        selected
          ? "!bg-[#d81b7381] bg-gradient-to-r from-orange-500 to-violet-300 drop-shadow-xl shadow-lg shadow-blue-500/50 animate-pulse"
          : ""
      } ${
        active ? "border-white" : "border-[#999]"
      } min-w-[20px] min-h-[20px] max-w-[160px] max-h-16   w-[100%] `}
      onClick={onClick}
    >
      {selected}
    </div>
  );
};

export default Bass;

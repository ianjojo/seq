import React, { useCallback, useState, useEffect } from "react";
import * as Tone from "tone";
import "./Sequencer.css";

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

// const synth = new Tone.MonoSynth().toDestination();

const acidSynth = new Tone.FMSynth({
  harmonicity: 8,
  modulationIndex: 2,
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.001,
    decay: 2,
    sustain: 0.1,
    release: 2,
  },
  modulation: {
    type: "square",
  },
  modulationEnvelope: {
    attack: 0.002,
    decay: 0.2,
    sustain: 0,
    release: 0.2,
  },
}).toDestination();
const reverb = new Tone.Reverb({
  decay: 8,
}).toDestination();
acidSynth.connect(reverb);
const feedbackDelay = new Tone.FeedbackDelay({
  delayTime: "8n", // delay time is an eighth note
  feedback: 0.5, // set feedback amount
  wet: 0.5, // set wet/dry mix
}).toDestination();

// connect the synth to the delay
acidSynth.connect(feedbackDelay);
function getNotesForScale(scale) {
  switch (scale) {
    case "C Major":
      return ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
    case "A Minor":
      return ["A4", "B4", "C4", "D4", "E4", "F4", "G4", "A5"];
    case "G Major":
      return ["G4", "A4", "B4", "C4", "D4", "E4", "F#4", "G5"];
    case "E Minor":
      return ["E4", "F#4", "G4", "A4", "B4", "C4", "D4", "E5"];
    case "D Major":
      return ["D4", "E4", "F4#", "G4", "A4", "B4", "C#4", "D5"];
    case "B Minor":
      return ["B4", "C#4", "D4", "E4", "F#4", "G4", "A5", "B5"];
    case "F Major":
      return ["F4", "G4", "A4", "A#4", "C4", "D4", "E4", "F5"];
    case "D Minor":
      return ["D4", "E4", "F4", "G4", "A4", "A#4", "C4", "D5"];
    case "Bb Major":
      return ["Bb4", "C4", "D4", "D#4", "F4", "G5", "A5", "Bb5"];
    case "G Minor":
      return ["G4", "A4", "A#4", "C4", "D4", "D#4", "F5"];
    default:
      return [];
  }
}
const Lead = ({ mouse_IsDown, patternLength }) => {
  const [currentScale, setCurrentScale] = useState([
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
  ]);
  const notes = currentScale;

  // const notes = currentScale.reverse();
  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [activeColumn, setColumn] = useState(0);
  const [pattern, updatePattern] = useState(initialPattern);
  const [currentSound, setCurrentSound] = useState("acid");
  const [oscillatorType, setOscillatorType] = useState("sine");
  const [delayFeedback, setDelayFeedback] = useState(0.5);
  const [clearNotes, setClearNotes] = useState(false);
  const [jsx, setJsx] = useState(null);

  const clearPattern = () => {
    const newone = [];
    updatePattern(newone);

    const newPattern = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    updatePattern(newPattern);
  };

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
    <div className='p-4'>
      <div className='flex'>
        <h1 className='hidden lg:inline-block p-2 orbitron text-2xl text-blue-500 hover:text-blue-700 transition-colors text-left w-full '>
          Lead
        </h1>
        <div className='flex items-center pr-4'>
          <p>key</p>
          <select onChange={(e) => setScale(e)} className='rounded-lg p-2 m-2'>
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
          {/* <button onClick={clearPattern} className='rounded-lg p-2 m-2'>
            clear pattern
          </button> */}
        </div>
        <div className='flex items-center'>
          <p className='w-full'>osc</p>
          <select onChange={(e) => setOsc(e)} className='rounded-lg p-2 m-2'>
            <option value='sine'>sine</option>
            <option value='sawtooth'>sawtooth</option>
            <option value='pulse'>pulse</option>
            <option value='triangle'>triangle</option>
            <option value='square'>square</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center " }}>
        <div style={{ width: 25 }} />
        {/* {Array.from({ length: 16 }, (_, i) => (
          <div key={i} style={{ width: 25, textAlign: "center" }}>
            {i}
          </div>
        ))} */}
      </div>
      {pattern.map((row, y) => (
        <div key={y} style={{ display: "flex", justifyContent: "center" }}>
          <div className='w-[50px] lg:w-[100px] px-2 text-left items-center flex lg:font-bold text-sm lg:text-lg'>
            {notes[y]}
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
      className={` drumsquare grid-container flex items-center justify-center border border-solid ${
        selected
          ? "!bg-[#d81b7381] bg-gradient-to-r from-orange-500 to-violet-300 drop-shadow-xl shadow-lg shadow-blue-500/50 animate-pulse"
          : ""
      } ${
        active ? "border-white" : "border-[#999]"
      } w-[18px] h-[18px] lg:w-[25px] lg:h-[25px] xl:w-[50px] xl:h-[50px] }`}
      onClick={handleClick}
    >
      {selected}
    </div>
  );
};

export default Lead;
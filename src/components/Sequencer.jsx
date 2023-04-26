import React, { useCallback, useState, useEffect } from "react";
import * as Tone from "tone";
import "./Sequencer.css";

const notes = ["D2", "E2", "F#2", "G2", "A2", "B2", "C#3", "D3"].reverse();

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
const currentSynth = new Tone.MonoSynth().toDestination();
const acidSynth = new Tone.MonoSynth({
  oscillator: {
    type: "sawtooth",
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
    release: 2.5,
  },
}).toDestination();

const Sequencer = (mouse_IsDown) => {
  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [activeColumn, setColumn] = useState(0);
  const [pattern, updatePattern] = useState(initialPattern);
  const [currentSound, setCurrentSound] = useState("acid");
  const [oscillatorType, setOscillatorType] = useState("sine");

  useEffect(
    () => {
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
              acidSynth.triggerAttackRelease(notes[noteIndex], "8n", time);
            }
          });
        },
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        "16n"
      ).start(0);
      return () => loop.dispose();
    },
    [pattern] // Retrigger when pattern changes
  );

  // Toggle playing / stopped
  const toggle = useCallback(() => {
    Tone.start();
    Tone.Transport.toggle();
    setPlayState(Tone.Transport.state);
  }, []);

  // Update pattern by making a copy and inverting the value
  function setPattern({ x, y, value }) {
    const patternCopy = [...pattern];
    patternCopy[y][x] = +!value;
    updatePattern(patternCopy);
  }

  return (
    <div className='p-4'>
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
          <div className='w-[50px] lg:w-[100px] px-2 text-left'>{notes[y]}</div>
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
        selected ? "!bg-[#d81b7381]" : ""
      } ${
        active ? "border-white" : "border-[#999]"
      } w-[18px] h-[18px] lg:w-[25px] lg:h-[25px]`}
      onClick={handleClick}
    >
      {selected}
    </div>
  );
};

export default Sequencer;

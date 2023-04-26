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

const synth = new Tone.Sampler({
  C2: "/drum-samples/kick.wav",
  D2: "/drum-samples/snare.wav",
  F2: "/drum-samples/closed-hat.wav",
  G2: "/drum-samples/open-hat.wav",
  A2: "/drum-samples/perc1.wav",
  B2: "/drum-samples/perc2.wav",
  C3: "/drum-samples/perc3.wav",
  D3: "/drum-samples/perc4.wav",
}).toDestination();

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
    return "PC1";
  } else if (drum === "B2") {
    return "PC2";
  } else if (drum === "C3") {
    return "PC3";
  } else if (drum === "D3") {
    return "PC4";
  }
};
const DrumSequencer = () => {
  const [playState, setPlayState] = useState(Tone.Transport.state);
  const [activeColumn, setColumn] = useState(0);
  const [pattern, updatePattern] = useState(initialPattern);
  const [bpm, setBpm] = useState(120);
  const downloadLoop = () => {
    const buffer = Tone.Offline(() => {
      const loop = new Tone.Sequence(
        (time, col) => {
          pattern.map((row, drumIndex) => {
            if (row[col]) {
              synth.triggerAttack(drumMap[drumIndex], time);
            }
          });
        },
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        "16n"
      ).start(0);
    }, 32 * Tone.Time("16n").toSeconds()).then((buffer) => {
      Tone.Transport.stop();
      Tone.context.resume();
      Tone.start();
      const url = URL.createObjectURL(
        new Blob([buffer.getChannelData(0)], { type: "audio/wav" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "loop.wav";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  const testie = () => {
    const buffer = Tone.Offline(() => {
      const sine = new Tone.Oscillator().toDestination();
      sine.start(0).stop(1);
    }, 1).then((buffer) => {
      const wav = Tone.Offline.toWav(buffer);
      const blob = new Blob([new DataView(wav)], {
        type: "audio/wav",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "test.wav";
      document.body.appendChild(link);
      link.click();
    });
  };
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
    const loop = new Tone.Sequence(
      (time, col) => {
        setColumn(col);

        pattern.map((row, drumIndex) => {
          if (row[col]) {
            synth.triggerAttack(drumMap[drumIndex], time);
          }
        });
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      "16n"
    ).start(0);
    return () => loop.dispose();
  }, [pattern, bpm]);

  const toggle = useCallback(() => {
    Tone.Transport.toggle();
    setPlayState(Tone.Transport.state);
  }, []);

  function setPattern({ x, y, value }) {
    const patternCopy = [...pattern];
    patternCopy[y][x] = value ? 0 : 1;
    updatePattern(patternCopy);
  }
  function handleBpmChange(event) {
    setBpm(event.target.value);
  }

  return (
    <div className=''>
      {pattern.map((row, y) => (
        <div key={y} style={{ display: "flex", justifyContent: "center" }}>
          <div className='w-[50px] lg:w-[100px] px-2 text-left'>
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
        selected ? "!bg-[#691ff181]" : ""
      } ${
        active ? "border-white" : "border-[#999]"
      } w-[18px] h-[18px] lg:w-[25px] lg:h-[25px]  `}
    >
      {selected}
    </div>
  );
};

export default DrumSequencer;

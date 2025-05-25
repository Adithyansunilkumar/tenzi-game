import React, { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import Die from "/src/Die.jsx";
import Confetti from "react-confetti";

const App = () => {
   const [dice, setDice] = useState(generateAllNewDice());
   const [gameWon, setGameWon] = useState(false);
   const [width, setWidth] = useState(window.innerWidth);
   const [height, setHeight] = useState(window.innerHeight);
   const [rollCount, setRollCount] = useState(0);
   const [time, setTime] = useState(0);
   const [isRunning, setIsRunning] = useState(false);
   const [isWarning, setIsWarning] = useState(false);
   const hasMounted = useRef(false);
   const [bestTime, setBestTime] = useState(() => {
      const storedTime = localStorage.getItem("bestTime");
      return storedTime ? Number(storedTime) : 1000;
   });

   useEffect(() => {
      localStorage.setItem("bestTime", String(bestTime));
   }, [bestTime]);

   useEffect(() => {
      if (hasMounted.current && isRunning) {
         const intervalId = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
         }, 1000);
         return () => {
            clearInterval(intervalId);
         };
      } else {
         hasMounted.current = true;
      }
   }, [isRunning]);

   useEffect(() => {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   useEffect(() => {
      const allheld = dice.every((die) => die.isHeld);
      const allEqual = dice.every((die) => die.value == dice[0].value);
      if (allEqual && allheld) {
         setGameWon(true);
         setIsRunning(false);
      }
   }, [dice]);

   useEffect(() => {
      if (isRunning) {
         setIsWarning(false);
      }
   }, [isRunning]);

   useEffect(() => {
      if (gameWon) {
         if (time <= bestTime) {
            setBestTime(time);
         }
      }
   }, [gameWon]);

   function handleResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
   }

   function handleStart() {
      setIsRunning(true);
      setDice(generateAllNewDice());
      setRollCount(0);
      setGameWon(false);
      setTime(0);
   }

   function generateAllNewDice() {
      let newDice = [];
      let value;
      for (let i = 0; i < 10; i++) {
         value = Math.ceil(Math.random() * 6);
         newDice[i] = {
            id: nanoid(),
            value: value,
            isHeld: false,
         };
      }
      return newDice;
   }

   function hold(id) {
      setDice((oldDice) =>
         oldDice.map((die) =>
            die.id === id ? { ...die, isHeld: !die.isHeld } : die
         )
      );
   }

   function rollDice() {
      if (isRunning) {
         setRollCount((prev) => prev + 1);
         setDice((oldDice) => {
            return oldDice.map((die) => {
               if (die.isHeld) {
                  return die;
               } else {
                  let newValue;
                  if (die.value == 6) {
                     newValue = 1;
                  } else newValue = die.value + 1;
                  // let newValue = Math.ceil(Math.random() * 6);
                  // while (die.value == newValue) {
                  //    newValue = Math.ceil(Math.random() * 6);
                  // }
                  return { ...die, value: newValue };
               }
            });
         });
      }
   }
   function triggerWarning() {
      setIsWarning(true);
   }

   const diceElements = dice.map((die) => {
      return (
         <Die
            isRunning={isRunning}
            triggerWarning={triggerWarning}
            hold={hold}
            key={die.id}
            value={die.value}
            id={die.id}
            isHeld={die.isHeld}
            gameWon={gameWon}
         />
      );
   });

   return (
      <main>
         {gameWon && (
            <Confetti numberOfPieces={80} width={width} height={height} />
         )}
         <h1 className="heading">{gameWon?"You won":"Tenzi"}</h1>
         <p className="instructions">
            Start and roll until all dice are the same.
            <br />
            Click each die to freeze its current value.
            <br />
            Each roll increments the die value by one
            <br />
            and resets to one when it exceeds six.
         </p>
         <div className="round-detials-div">
            <div className="roll-div">
               <p>Roll</p>
               <p>{rollCount}</p>
            </div>
            {bestTime !== 1000 && (
               <div className="best-time-div">
                  <p>Best time</p>
                  <p>{bestTime}</p>
               </div>
            )}
            <div className="time-div">
               <p>Time</p>
               <p className={isRunning ? "red" : ""}>{time}</p>
            </div>
         </div>
         <p className={isWarning ? "warning" : "warning hide-warning"}>
            click start to hold dies !
         </p>
         <div className="dies-div">{diceElements}</div>
         <div className="buttons-div">
            <button
               onClick={isRunning ? rollDice : handleStart}
               className={isRunning ? "roll-btn" : "start-btn"}
            >
               {isRunning ? "Roll" : "Start"}
            </button>
         </div>
      </main>
   );
};

export default App;

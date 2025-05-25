import React from "react";
import die1 from "/src/assets/die1.svg";
import die2 from "/src/assets/die2.svg";
import die3 from "/src/assets/die3.svg";
import die4 from "/src/assets/die4.svg";
import die5 from "/src/assets/die5.svg";
import die6 from "/src/assets/die6.svg";

const Die = (props) => {
   function handleDragStart(event) {
      event.preventDefault();
   }

   function getSrc() {
      if (props.value == 1) return die1;
      else if (props.value == 2) return die2;
      else if (props.value == 3) return die3;
      else if (props.value == 4) return die4;
      else if (props.value == 5) return die5;
      else if (props.value == 6) return die6;
   }

   function getDieSymbol() {
      return (
         <img
            className={`die-${props.value}`}
            src={getSrc()}
            alt="die symbol"
            onDragStart={handleDragStart}
         />
      );
   }
   function handleClick() {
      {
         props.isRunning && props.hold(props.id);
      }
      {
         !props.isRunning && props.triggerWarning();
      }
   }
   function handleClassName() {
      let dieClassName = "die";
      if (props.isHeld) dieClassName = "held die";
      if (!props.isRunning) dieClassName = "die disabled";
      if (!props.isRunning && props.isHeld) dieClassName = "die held disabled";
      if (!props.isRunning && props.gameWon) dieClassName = "die win disabled";
      return dieClassName;
   }
   return (
      <div onClick={handleClick} className={handleClassName()}>
         {getDieSymbol()}
      </div>
   );
};

export default Die;

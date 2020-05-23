import React, { useState } from "react";
// import '../../style/welcome.scss';

function Nothing() {
  const [buttonText, setButtonText] = useState("0000");

  function handleClick() {
    return setButtonText("Thanks, been clicked!");
  }

  return (
    <div className="main-box">
      <button onClick={handleClick}>{buttonText}</button>
    </div>
  );
}

// Nothing.propTypes = {

// };

export default Nothing;

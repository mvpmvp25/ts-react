import React, { useState } from "react";
// import '../../style/welcome.scss';

function OrderList() {
  const [buttonText, setButtonText] = useState("1111111");

  function handleClick() {
    return setButtonText("Thanks, been clicked!");
  }

  return (
    <div className="main-box">
      <button onClick={handleClick}>{buttonText}</button>
    </div>
  );
}

// OrderList.propTypes = {

// };

export default OrderList;

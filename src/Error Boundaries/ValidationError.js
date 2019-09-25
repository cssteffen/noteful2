import React from "react";

export default function ValidationError(props) {
  const errorStyle = {
    color: "red",
    fontSize: ".8em"
  };

  if (props.message) {
    return (
      <div style={errorStyle} className="error">
        {props.message}
      </div>
    );
  }

  return <></>;
}

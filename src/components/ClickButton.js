import React from "react";
import { Button } from "react-bootstrap";

const ClickButton = ({ label, onClick, disabled,style }) => {
  return (
    <Button className="create-btn" onClick={onClick} disabled={disabled} style={style}>
      {label}
    </Button>
  );
};

const Delete = ({ label, onClick ,disabled,style}) => {
  return (
    <>
      <Button className="delete" onClick={onClick} disabled={disabled} style={style}>
        {label}{" "}
      </Button>
    </>
  );
};
const ChooseButton = ({ label, onClick }) => {
  return (
    <>
      <Button className="choosefilebtn" onClick={onClick}>
        {label}{" "}
      </Button>
    </>
  );
};
const PreviewButton= ({ label, onClick })=> {
  return (
    <>
      <Button className="previewbtn"onClick={onClick}>
        {label}{" "}
      </Button>
    </>
  );
};
const ImageDeleteButton= ({ label, onClick })=> {
  return (
    <>
      <Button className="cancel"onClick={onClick}>
        {label}{" "}
      </Button>
    </>
  );
};
const View = ({ label, onClick }) => {
  return (
    <>
      <Button className="delete" onClick={onClick}>
        {label}{" "}
      </Button>
    </>
  );
};

export { ClickButton, ChooseButton, Delete, View,PreviewButton,ImageDeleteButton };

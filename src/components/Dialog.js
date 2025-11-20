import React from "react";
import { ClickButton } from "./ClickButton";
import { useLanguage } from "./LanguageContext";

const Dialog = ({ isVisible, onConfirm, onCancel, DialogTitle }) => {
  const { t } = useLanguage();
  if (!isVisible) return null;
  return (
    <>
      <div className="confirm-dialog-overlay">
        <div className="confirm-dialog">
          <p>{DialogTitle}</p>
          <ClickButton
            onClick={() => onConfirm(true)}
            label={t("Yes")} 
          />
          <ClickButton
            onClick={() => onCancel(false)}
            className="table-btn mx-2"
            label={t("No")} 
          />
        </div>
      </div>
    </>
  );
};

export default Dialog;

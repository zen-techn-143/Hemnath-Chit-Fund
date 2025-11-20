import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Dialog from "./Dialog";
import { useLanguage } from "./LanguageContext";

const PageNav = ({ pagetitle }) => {
  const { t } = useLanguage();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const handleCloseForm = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClose = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm) {
      console.log("Form closed");
      navigate(-1);
    }
  };

  return (
    <>
      <div className="page-nav d-flex align-items-center">
        <div>
          <Button className="back" onClick={handleCloseForm}>
            <MdArrowBack />
          </Button>
        </div>
        <div className="nav-list">{pagetitle}</div>
      </div>
      <Dialog
        DialogTitle={t("Do You Want to Close the Form?")}
        isVisible={showConfirmDialog}
        onConfirm={() => handleConfirmClose(true)}
        onCancel={() => handleConfirmClose(false)}
      />
    </>
  );
};

export default PageNav;

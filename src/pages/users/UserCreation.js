import React, { useState } from "react";
import { Col, Container, Row, Alert, Modal } from "react-bootstrap";
import { TextInputForm, DropDownUI } from "../../components/Forms";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { ClickButton,Delete } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import { useLanguage } from "../../components/LanguageContext"; // Adjust path


const UserCreation = () => {
   const { t } = useLanguage();
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          Name: "",
          RoleSelection: "",
          Mobile_Number: "",
          User_Name: "",
          Password: "",
          nickname: "",
        };
  const [formData, setFormData] = useState(initialState);
   const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

  //Role dropdrown
  const DropList = [
    {
      value: "Admin",
      label: t("Admin"), 
    },
    {
      value: "Super admin",
      label: t("Super admin"), 
    },
    {
      value: "Employee",
      label: t("Employee"), 
    },
  ];

  const redirectModal = () => {
    navigate("/console/user");
  };

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const userTitleSegment = 
    type === "view"
      ? ` ${t("view")}`
      : type === "edit"
      ? ` ${t("Edit")}`
      : ` ${t("Creation")}`;
 
  const handleSubmit = async () => {
    for (const key in formData) {
      if (formData[key] === "") {
        toast.error(`${key} cannot be empty!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return; // Exit the function early if any field is empty
      }
    }
    try {
      setLoading(true);
      const mobileNumber = formData.Mobile_Number;
      if (!/^\d{10}$/.test(mobileNumber)) {
        toast.error("Mobile number must be a 10-digit number!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
        setLoading(false);
      }
      const response = await fetch(`${API_DOMAIN}/users.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      const responseData = await response.json();

      console.log(responseData);

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/console/user");
        }, 2000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateSubmit = async () => {
    console.log("Inside handleUpdateSubmit");
    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/users.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_user_id: rowData.user_id, // Include the company ID in the request
          Name: formData.Name,
          Mobile_Number: formData.Mobile_Number,
          RoleSelection: formData.RoleSelection,
          FireWorksName: formData.FireWorksName,
          User_Name: formData.User_Name,
          Password: formData.Password,
          nickname: formData.nickname,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/console/user");
        }, 2000);
        setLoading(false);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
        {/* 3. Apply translation to the PageNav title */}
        <PageNav
          pagetitle={`${t("User")}${userTitleSegment}`}
        ></PageNav>
      </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
        {type === "edit" ? (
          <TextInputForm
            placeholder={t("Name")} // 4. Apply t()
            labelname={t("Name")} // 4. Apply t()
            name="Name"
            value={formData.Name}
            onChange={(e) => handleChange(e, "Name")}
          ></TextInputForm>
        ) : (
          <TextInputForm
            placeholder={t("Name")} // 4. Apply t() (Removed leading space for clean key)
            labelname={t("Name")} // 4. Apply t() (Removed leading space for clean key)
            name="Name"
            value={type === "view" ? rowData.Name : formData.Name}
            onChange={(e) => handleChange(e, "Name")}
          ></TextInputForm>
        )}
      </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
        {type === "edit" ? (
          <DropDownUI
            optionlist={DropList}
            placeholder={t("Role Selection")} // 4. Apply t() (Using "Role Selection" as key)
            labelname={t("Role Selection")} // 4. Apply t()
            name="RoleSelection"
            value={formData.RoleSelection}
            onChange={(updatedFormData) =>
              setFormData({
                ...formData,
                RoleSelection: updatedFormData.RoleSelection,
              })
            }
          />
        ) : (
          <DropDownUI
            optionlist={DropList}
            placeholder={t("Role Selection")} // 4. Apply t()
            labelname={t("Role Selection")} // 4. Apply t()
            name="RoleSelection"
            value={
              type === "view"
                ? rowData.RoleSelection
                : formData.RoleSelection
            }
            onChange={(updatedFormData) =>
              setFormData({
                ...formData,
                RoleSelection: updatedFormData.RoleSelection,
              })
            }
          />
        )}
      </Col>
         <Col lg="4" md="12" xs="12" className="py-3">
        {type === "edit" ? (
          <TextInputForm
            placeholder={t("Mobile Number")} // 4. Apply t()
            type={"number"}
            labelname={t("Mobile Number")} // 4. Apply t()
            name="Mobile_Number"
            value={formData.Mobile_Number}
            onChange={(e) => handleChange(e, "Mobile_Number")}
          ></TextInputForm>
        ) : (
          <TextInputForm
            placeholder={t("Mobile Number")} // 4. Apply t()
            type={"number"}
            labelname={t("Mobile Number")} // 4. Apply t()
            name="Mobile_Number"
            value={
              type === "view"
                ? rowData.Mobile_Number
                : formData.Mobile_Number
            }
            onChange={(e) => handleChange(e, "Mobile_Number")}
          ></TextInputForm>
        )}
      </Col>
          <Col lg="3" md="6" xs="12" className="py-3">
        {type === "edit" ? (
          <TextInputForm
            placeholder={t("User Name")} // 4. Apply t()
            labelname={t("User Name")} // 4. Apply t()
            name="User_Name"
            value={formData.User_Name}
            onChange={(e) => handleChange(e, "User_Name")}
          ></TextInputForm>
        ) : (
          <TextInputForm
            placeholder={t("User Name")} // 4. Apply t()
            labelname={t("User Name")} // 4. Apply t()
            name="User_Name"
            value={type === "view" ? rowData.User_Name : formData.User_Name}
            onChange={(e) => handleChange(e, "User_Name")}
          ></TextInputForm>
        )}
      </Col>
          <Col lg="3" md="6" xs="12" className="py-3">
        {type === "edit" ? (
          <TextInputForm
            placeholder={t("Nick Name")} // 4. Apply t()
            labelname={t("Nick Name")} // 4. Apply t()
            name="nickname"
            value={formData.nickname}
            onChange={(e) => handleChange(e, "nickname")}
          ></TextInputForm>
        ) : (
          <TextInputForm
            placeholder={t("Nick Name")} // 4. Apply t()
            labelname={t("Nick Name")} // 4. Apply t()
            name="nickname"
            value={type === "view" ? rowData.nickname : formData.nickname}
            onChange={(e) => handleChange(e, "nickname")}
          ></TextInputForm>
        )}
      </Col>
         <Col lg="3" md="6" xs="12" className="py-3">
        {type === "view" ? null : (
          <TextInputForm
            placeholder={t("Password")} // 4. Apply t()
            suffix_icon={
              showPassword ? (
                <VscEye onClick={() => setShowPassword(false)} />
              ) : (
                <VscEyeClosed onClick={() => setShowPassword(true)} />
              )
            }
            labelname={t("Password")} // 4. Apply t()
            type={showPassword ? "text" : "password"}
            name="Password"
            value={formData.Password}
            onChange={(e) => handleChange(e, "Password")}
          ></TextInputForm>
        )}
      </Col>

         <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
        <div style={{ textAlign: "right", paddingRight: "5px" }}>
          {type === "view" ? (
            <ClickButton
              label={<>{t("Back")}</>} // 4. Apply t() (Capitalized for key consistency)
              onClick={() => navigate("/console/user")}
            ></ClickButton>
          ) : (
            <>
              <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              {type === "edit" ? (
                <>
                  <span className="mx-2">
                    <ClickButton
                      label={<>{t("Update")}</>} // 4. Apply t()
                      onClick={handleUpdateSubmit}
                    ></ClickButton>
                  </span>

                  <span className="mx-2">
                    <Delete
                      label={<>{t("Cancel")}</>} // 4. Apply t()
                      onClick={() => navigate("/console/user")}
                    ></Delete>
                  </span>
                </>
              ) : (
                <>
                  <span className="mx-2">
                    <ClickButton
                      label={loading ? <>{t("Submitting...")}</> : <>{t("Submit")}</>} // 4. Apply t()
                      onClick={handleSubmit}
                      disabled={loading}
                    ></ClickButton>
                  </span>
                  <span className="mx-2">
                    <Delete
                      label={t("Cancel")} // 4. Apply t()
                      onClick={() => navigate("/console/user")}
                    ></Delete>
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </Col>
        </Row>
        {error && (
          <Alert variant="danger" className="error-alert">
            {error}
          </Alert>
        )}
      </Container>
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Body className="text-center">
          <img
            src={require("../../components/sidebar/images/output-onlinegiftools.gif")}
            alt="Success GIF"
          />
          <p>{t("User saved successfully!")}</p>
        </Modal.Body>
        <Modal.Footer>
          <ClickButton
            variant="secondary"
            label={<> Close</>}
            onClick={() => redirectModal()}
          >
            {t("Close")}
          </ClickButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserCreation;

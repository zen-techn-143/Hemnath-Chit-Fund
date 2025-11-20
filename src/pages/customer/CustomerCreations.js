import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { ClickButton, ChooseButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import API_DOMAIN from "../../config/config";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../components/LanguageContext";

const CustomerCreations = () => {
  const { t} = useLanguage();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { type, rowData } = location.state || {};
  const navigate = useNavigate();
  const proofInputRef = useRef(null);
  const aadharProofInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedProofType, setSelectedProofType] = useState("");
  const [proofNumber, setProofNumber] = useState("");
  const [showProofNumberInput, setShowProofNumberInput] = useState(false);

  const proofOptions = [
    { label: t("Aadhar Card"), value: "aadhar" },
    { label: t("PAN Card"), value: "pan" },
    { label: t("Voter ID"), value: "voter" },
    { label: t("Ration Card"), value: "ration" },
    { label: t("Driving License"), value: "license" },
  ];

  const initialState =
    type === "edit"
      ? {
          ...rowData,
          proof: rowData.proof.map((url, index) => {
            const extension = url.split(".").pop()?.toLowerCase();
            const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
            return {
              name: `file_${index + 1}.${extension}`,
              data: url,
              type: isImage ? "image" : "file",
            };
          }),
          aadharproof: rowData.aadharproof.map((url, index) => {
            const extension = url.split(".").pop()?.toLowerCase();
            const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
            return {
              name: `file_${index + 1}.${extension}`,
              data: url,
              type: isImage ? "image" : "file",
            };
          }),
          proof_number: rowData.proof_number || "",
          additional_number: rowData.addtionsonal_mobile_number || "",
          pincode: rowData.pincode || "",
          reference: rowData.reference || "",
          account_holder_name: rowData.account_holder_name || "",
          bank_name: rowData.bank_name || "",
          account_number: rowData.account_number || "",
          ifsc_code: rowData.ifsc_code || "",
          branch_name: rowData.branch_name || "",
        }
      : {
          customer_no: "",
          name: "",
          customer_details: "",
          place: "",
          pincode: "",
          mobile_number: "",
          additional_number: "",
          proof: [],
          upload_type: "",
          aadharproof: [],
          proof_number: "",
          reference: "",
          account_holder_name: "",
          bank_name: "",
          account_number: "",
          ifsc_code: "",
          branch_name: "",
        };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showCapturePage, setShowCapturePage] = useState(false);
  const [stream, setStream] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [captureType, setCaptureType] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  useEffect(() => {
    if (type === "edit" && rowData) {
      setSelectedProofType(rowData.upload_type || "");
      setProofNumber(rowData.proof_number || "");
      setShowProofNumberInput(!!rowData.upload_type); // Show proof number input if upload_type exists
    }
  }, [type, rowData]);
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (type !== "edit" && type !== "view") {
      const fetchCustomers = async () => {
        try {
          const response = await fetch(`${API_DOMAIN}/customer.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ search_text: "" }),
          });
          const responseData = await response.json();
          if (responseData.head.code === 200) {
            const customers = responseData.body.customer || [];
            const maxCustomerNo =
              customers
                .map((customer) => {
                  const numericPart = customer.customer_no.startsWith("C")
                    ? customer.customer_no.slice(1)
                    : customer.customer_no;
                  return parseInt(numericPart, 10);
                })
                .filter((num) => !isNaN(num))
                .sort((a, b) => b - a)[0] || 0;
            const nextCustomerNo =
              "C" + (maxCustomerNo + 1).toString().padStart(4, "0");
            setFormData((prev) => ({
              ...prev,
              customer_no: nextCustomerNo,
            }));
          } else {
            console.error("Failed to fetch customers:", responseData.head.msg);
            setFormData((prev) => ({
              ...prev,
              customer_no: "C0001",
            }));
          }
        } catch (error) {
          console.error("Error fetching customers:", error);
          setFormData((prev) => ({
            ...prev,
            customer_no: "C0001",
          }));
        }
      };
      fetchCustomers();
    }
  }, [type]);

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleProofTypeChange = (e) => {
    const value = e.target.value;
    setSelectedProofType(value);
    setShowProofNumberInput(!!value);
    setFormData((prev) => ({
      ...prev,
      upload_type: value,
      proof_number: "",
    }));
    setProofNumber("");
  };

  const handleProofNumberChange = (e) => {
    setProofNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      proof_number: e.target.value,
    }));
  };

  // 🔹 Handle when user moves focus away from the input
  const handlePlaceBlur = async () => {
    const place = formData.place?.trim();
    if (!place) return;

    const url = `https://api.postalpincode.in/postoffice/${encodeURIComponent(
      place
    )}`;
    try {
      const resp = await fetch(url);
      const json = await resp.json();
      console.log(json);

      if (
        Array.isArray(json) &&
        json[0].PostOffice &&
        json[0].PostOffice.length > 0
      ) {
        // Find Head Post Office if available
        const headPO = json[0].PostOffice.find(
          (po) => po.BranchType === "Head Post Office"
        );

        const selectedPO = headPO || json[0].PostOffice[0];

        setFormData((prev) => ({
          ...prev,
          pincode: selectedPO.Pincode,
        }));
      }
    } catch (err) {
      console.error("Error fetching pincode:", err);
    }
  };

  const handleSubmit = async () => {
    if (selectedProofType && !proofNumber) {
      toast.error(`Proof number cannot be empty!`, {
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
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          proof: formData.proof.map((file) => ({ data: file.data })),
          aadharproof: formData.aadharproof.map((file) => ({
            data: file.data,
          })),
          account_holder_name: formData.account_holder_name,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          branch_name: formData.branch_name,
          login_id: user.id,
          user_name: user.user_name,
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
        setFormData({
          ...formData,
          proof: [],
          aadharproof: [],
        });
        setTimeout(() => {
          navigate("/console/master/customer");
        }, 1000);
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
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async () => {
    setLoading(true);
    const convertToBase64IfUrl = async (file) => {
      const { data } = file;
      if (typeof data === "string" && data.startsWith("http")) {
        const response = await fetch(data);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ data: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      return file;
    };

    const proofBase64Array = await Promise.all(
      formData.proof.map(convertToBase64IfUrl)
    );
    const aadharproofBase64Array = await Promise.all(
      formData.aadharproof.map(convertToBase64IfUrl)
    );
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_customer_id: rowData.customer_id,
          customer_no: formData.customer_no,
          name: formData.name,
          customer_details: formData.customer_details,
          place: formData.place,
          pincode: formData.pincode,
          mobile_number: formData.mobile_number,
          additional_number: formData.additional_number,
          upload_type: formData.upload_type,
          proof_number: formData.proof_number,
          reference: formData.reference,
          proof: proofBase64Array,
          aadharproof: aadharproofBase64Array,
          account_holder_name: formData.account_holder_name,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          branch_name: formData.branch_name,
          login_id: user.id,
          user_name: user.user_name,
        }),
      });
      console.log(
        JSON.stringify({
          edit_customer_id: rowData.customer_id,
          customer_no: formData.customer_no,
          name: formData.name,
          customer_details: formData.customer_details,
          place: formData.place,
          pincode: formData.pincode,
          mobile_number: formData.mobile_number,
          additional_number: formData.additional_number,
          upload_type: formData.upload_type,
          proof_number: formData.proof_number,
          reference: formData.reference,
          proof: proofBase64Array,
          aadharproof: aadharproofBase64Array,
          account_holder_name: formData.account_holder_name,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          branch_name: formData.branch_name,
          login_id: user.id,
          user_name: user.user_name,
        })
      );
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
          navigate("/console/master/customer");
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
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const handleFileChange = (files, field) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const maxSize = 5 * 1024 * 1024;

      fileArray.forEach((file) => {
        if (file.size > maxSize) {
          toast.error(`${file.name} exceeds 5MB limit.`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
          return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
          if (file.type.startsWith("image/")) {
            setFormData((prevData) => ({
              ...prevData,
              [field]: [
                ...prevData[field],
                { type: "image", data: reader.result, name: file.name },
              ],
            }));
          } else if (file.type === "application/pdf") {
            setFormData((prevData) => ({
              ...prevData,
              [field]: [
                ...prevData[field],
                { type: "pdf", data: reader.result, name: file.name },
              ],
            }));
          } else {
            toast.error(`${file.name}: Only images and PDFs are allowed.`, {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
          }
        };

        reader.onerror = () => {
          toast.error(`Failed to read ${file.name}.`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
        };

        reader.readAsDataURL(file);
      });

      toast.success("File(s) uploaded successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    } else {
      toast.error("Please select valid files.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handleImageDelete = (index, field) => {
    const newFiles = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newFiles });

    if (newFiles.length === 0) {
      if (field === "proof" && proofInputRef.current) {
        proofInputRef.current.value = "";
      } else if (field === "aadharproof" && aadharProofInputRef.current) {
        aadharProofInputRef.current.value = "";
      }
    }

    toast.info("File removed successfully!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });
  };

  const startWebcam = async (type) => {
    if (type === "proof" && !selectedProofType) {
      toast.error("Please select a proof type first.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }
    if (type === "proof" && !proofNumber) {
      toast.error("Please enter a proof number first.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment",
        },
      });
      setStream(mediaStream);
      setShowCapturePage(true);
      setCaptureType(type);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch((err) => {
            console.error("Error playing video:", err);
            toast.error("Failed to play webcam feed.", {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
          });
        }
      }, 100);
    } catch (err) {
      console.warn(
        "Webcam access failed or not available. Fallback to file upload."
      );
      toast.info("No camera detected. Opening file upload instead.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      if (type === "proof") {
        if (proofInputRef.current) {
          proofInputRef.current.click();
        }
      } else if (type === "aadharproof") {
        if (aadharProofInputRef.current) {
          aadharProofInputRef.current.click();
        }
      }
      setShowCapturePage(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setCaptureType(null);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
      setFormData((prevData) => ({
        ...prevData,
        [captureType]: [
          ...prevData[captureType],
          {
            type: "image",
            data: dataUrl,
            name: `captured_${Date.now()}.jpeg`,
          },
        ],
      }));
      toast.success("Image captured successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      stopWebcam();
      setShowCapturePage(false);
    }
  };

  if (showCapturePage) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container fluid>
          <Row className="py-3">
            <Col>
              <h3>{t("Capture Image")}</h3>
            </Col>
            <Col className="text-end">
              <ClickButton
                label={t("Close")}
                onClick={() => {
                  stopWebcam();
                  setShowCapturePage(false);
                }}
              />
            </Col>
          </Row>
          <Row
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Col xs={12} md={8} lg={6} className="text-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  backgroundColor: "black",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className="mt-3">
                <ChooseButton label={t("Capture")} onClick={captureImage} />
                <ChooseButton
                  label={t("Cancel")}
                  onClick={() => {
                    stopWebcam();
                    setShowCapturePage(false);
                  }}
                />
                <ChooseButton
                  label={t("Gallery")}
                  onClick={() => {
                    stopWebcam();
                    setShowCapturePage(false);
                    setTimeout(() => {
                      if (captureType === "proof" && proofInputRef.current) {
                        proofInputRef.current.click();
                      } else if (
                        captureType === "aadharproof" &&
                        aadharProofInputRef.current
                      ) {
                        aadharProofInputRef.current.click();
                      }
                    }, 0);
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
        <input
          type="file"
          id="proof"
          accept="image/*,application/pdf"
          ref={proofInputRef}
          multiple
          onChange={(e) => handleFileChange(e.target.files, "proof")}
          style={{ display: "none" }}
        />
        <input
          type="file"
          id="aadharproof"
          accept="image/*,application/pdf"
          ref={aadharProofInputRef}
          multiple
          onChange={(e) => handleFileChange(e.target.files, "aadharproof")}
          style={{ display: "none" }}
        />
      </div>
    );
  }

  //console.log(formData);
  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={
                type === "view"
                  ? t("Customer View")
                  : type === "edit"
                  ? t("Customer Edit")
                  : t("Customer Creation")
              }
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={t("Customer No")}
              labelname={t("Customer No")}
              name="customer_no"
              value={formData.customer_no}
              onChange={(e) => handleChange(e, "customer_no")}
              disabled
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={t("Name")}
              labelname={t("Name")}
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-4">
            <label htmlFor="customer_details">{t("Address")}</label>
            <textarea
              id="customer_details"
              className="form-cntrl-bt w-100"
              placeholder={t("Address")}
              name="customer_details"
              value={formData.customer_details}
              onChange={(e) => handleChange(e, "customer_details")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={t("Place")}
              labelname={t("Place")}
              name="place"
              value={formData.place}
              onChange={(e) => handleChange(e, "place")} 
              onBlur={handlePlaceBlur} 
            />
          </Col>

          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={t("Pincode")}
              labelname={t("Pincode")}
              name="pincode"
              value={formData.pincode}
              onChange={(e) => handleChange(e, "pincode")}
            />
          </Col>

          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={t("Mobile Number")}
              labelname={t("Mobile Number")}
              name="mobile_number"
              value={formData.mobile_number}
              onChange={(e) => handleChange(e, "mobile_number")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={t("Additional Number")}
              labelname={t("Additional Number")}
              name="additional_number"
              value={formData.additional_number}
              onChange={(e) => handleChange(e, "additional_number")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={t("Reference")}
              labelname={t("Reference")}
              name="reference"
              value={formData.reference}
              onChange={(e) => handleChange(e, "reference")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <div className="mb-3">
              <label htmlFor="proofType" className="form-label">
                {t("Select Proof Type")}
              </label>
              <select
                id="proofType"
                className="form-select"
                value={selectedProofType}
                onChange={handleProofTypeChange}
                disabled={type === "view"}
              >
                <option value="">{t("-- Select Proof Type --")}</option>
                {proofOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </Col>

          {showProofNumberInput && (
            <Col lg="3" md="4" xs="12" className="py-3">
              <TextInputForm
                label={t("Proof Number")}
                placeholder={t("Proof Number")}
                name="proof_number"
                value={proofNumber}
                onChange={handleProofNumberChange}
                disabled={type === "view"}
              />
            </Col>
          )}
          <Col lg="4" md="4" xs="12" className="py-5">
            <div className="file-upload">
              <label>
                {type === "edit"
                  ? t("Preview Customer Photo")
                  : t("Upload Customer Photo")}
              </label>
              <input
                type="file"
                id="proof"
                accept="image/*,application/pdf"
                ref={proofInputRef}
                multiple
                onChange={(e) => handleFileChange(e.target.files, "proof")}
                style={{ display: "none" }}
              />
              <ChooseButton
                label={t("Choose File")}
                onClick={() => startWebcam("proof")}
                className="choosefilebtn"
                disabled={!selectedProofType || !proofNumber}
              />
              {formData.proof.map((file, index) => (
                <div
                  key={index}
                  className="file-item d-flex align-items-center mb-2"
                >
                  {file.type === "image" ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                        marginRight: "10px",
                      }}
                    >
                      {isLoading && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100px",
                            height: "100px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f8f8f8",
                            borderRadius: "5px",
                          }}
                        >
                          <div
                            className="spinner-border text-primary"
                            role="status"
                            style={{ width: "1.5rem", height: "1.5rem" }}
                          >
                            <span className="visually-hidden">
                              {t("Loading...")}
                            </span>
                          </div>
                        </div>
                      )}
                      <img
                        src={file.data}
                        alt={`${t("Preview")} ${file.name}`}
                        onLoad={() => setIsLoading(false)}
                        onError={(e) => {
                          e.target.src = "path/to/fallback-image.png";
                          toast.error(`Failed to load image: ${file.name}`, {
                            position: "top-center",
                            autoClose: 2000,
                            theme: "colored",
                          });
                          setIsLoading(false);
                        }}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "5px",
                          display: isLoading ? "none" : "block",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="file-info" style={{ marginRight: "10px" }}>
                      <p>
                        <a
                          href={file.data}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.name}
                        </a>{" "}
                        ({file.type ? file.type.toUpperCase() : "UNKNOWN"})
                      </p>
                    </div>
                  )}
                  <ChooseButton
                    label={t("Preview")}
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handlePreview(file)}
                  />
                  <ChooseButton
                    label={t("Delete")}
                    className="btn btn-danger btn-sm"
                    onClick={() => handleImageDelete(index, "proof")}
                  />
                </div>
              ))}
            </div>
          </Col>
          <Col lg="4" md="4" xs="12" className="py-5">
            <div className="file-upload">
              <label>
                {type === "edit"
                  ? `Preview ${selectedProofType?.toLocaleLowerCase()} Files`
                  : `Upload ${selectedProofType?.toLocaleLowerCase()} Proof`}
              </label>

              <input
                type="file"
                id="aadharproof"
                accept="image/*,application/pdf"
                ref={aadharProofInputRef}
                multiple
                onChange={(e) =>
                  handleFileChange(e.target.files, "aadharproof")
                }
                style={{ display: "none" }}
              />
              <ChooseButton
                 label={t("Choose File")}
                onClick={() => startWebcam("aadharproof")}
                className="choosefilebtn"
              />
              {formData.aadharproof && formData.aadharproof.length > 0 && (
                <div className="file-preview mt-2">
                  {formData.aadharproof.map((file, index) => (
                    <div
                      key={index}
                      className="file-item d-flex align-items-center mb-2"
                    >
                      {file.type === "image" ? (
                        <img
                          src={file.data}
                          alt={`Preview ${file.name}`}
                          onError={(e) => {
                            e.target.src = "/assets/fallback-image.png";
                            toast.error(`Failed to load image: ${file.name}`, {
                              position: "top-center",
                              autoClose: 2000,
                              theme: "colored",
                            });
                          }}
                          style={{
                            width: "100px",
                            height: "100px",
                            marginRight: "10px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        <div
                          className="file-info"
                          style={{ marginRight: "10px" }}
                        >
                          <p>
                            <a
                              href={file.data}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file.name}
                            </a>{" "}
                            ({file.type ? file.type.toUpperCase() : "UNKNOWN"})
                          </p>
                        </div>
                      )}

                      <ChooseButton
                      label={t("Preview")}
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handlePreview(file)}
                      />
                      <ChooseButton
                        label={t("Delete")}
                        className="btn btn-danger btn-sm"
                        onClick={() => handleImageDelete(index, "aadharproof")}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
          <Col lg="12" className="py-3">
            <h5>{t("Bank Details")}</h5>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              label={t("Account Holder Name")}
              placeholder={t("Account Holder Name")}
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={(e) => handleChange(e, "account_holder_name")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              label={t("Bank Name")}
              placeholder={t("Bank Name")}
              name="bank_name"
              value={formData.bank_name}
              onChange={(e) => handleChange(e, "bank_name")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              label={t("Account Number")}
              placeholder={t("Account Number")}
              name="account_number"
              value={formData.account_number}
              onChange={(e) => handleChange(e, "account_number")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              label={t("IFSC Code")}
              placeholder={t("IFSC Code")}
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={(e) => handleChange(e, "ifsc_code")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              label={t("Branch Name")}
              placeholder={t("Branch Name")}
              name="branch_name"
              value={formData.branch_name}
              onChange={(e) => handleChange(e, "branch_name")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div className="text-center">
              {type === "view" ? (
                <ClickButton
                  label={<>{t("Back")}</>}
                  onClick={() => navigate("/console/master/customer")}
                />
              ) : (
                <>
                  {type === "edit" ? (
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
                      <span className="mx-2">
                        <ClickButton
                          label={<>{t("Update")}</>}
                          onClick={handleUpdateSubmit}
                          disabled={loading}
                        />
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>{t("Cancel")}</>}
                          onClick={() => navigate("/console/master/customer")}
                        />
                      </span>
                    </>
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
                      <span className="mx-2">
                        <ClickButton
                          label={
                            loading ? (
                              <>{t("Submitting...")}</>
                            ) : (
                              <>{t("Submit")}</>
                            )
                          }
                          onClick={handleSubmit}
                          disabled={loading}
                        />
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>{t("Cancel")}</>}
                          onClick={() => navigate("/console/master/customer")}
                        />
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      {previewFile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "100%",
              maxHeight: "100%",
              overflow: "auto",
            }}
          >
            <button
              onClick={closePreview}
              style={{
                position: "absolute",
                top: "1px",
                right: "1px",
                background: "black",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#333",
              }}
            >
              ×
            </button>
            {previewFile.type === "image" ? (
              <img
                src={previewFile.data}
                alt={`Preview ${previewFile.name}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
                onError={() =>
                  toast.error(`Failed to load image: ${previewFile.name}`, {
                    position: "top-center",
                    autoClose: 2000,
                    theme: "colored",
                  })
                }
              />
            ) : (
              <iframe
                src={previewFile.data}
                title={`Preview ${previewFile.name}`}
                style={{
                  width: "100%",
                  height: "80vh",
                  border: "none",
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCreations;

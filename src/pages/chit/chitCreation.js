import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Modal, Card } from "react-bootstrap";
import { ClickButton, Delete } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import Select from "react-select";
import { useLanguage } from "../../components/LanguageContext";

const ChitCreation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { type, rowData } = location.state || {};

  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          chit_type: "", // This will store the chit_type_id
          customer_id: "",
        };

  const [formData, setFormData] = useState(initialState);
  
  // Options State
  const [customerOptions, setCustomerOptions] = useState([]);
  const [chitTypeOptions, setChitTypeOptions] = useState([]); // New state for Chit Type
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectModal = () => {
    navigate("/console/master/chit");
  };

  // --- HANDLERS ---

  const handleCustomerChange = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        customer_id: selectedOption.value,
      });
      setSelectedCustomer(selectedOption.fullData);
    } else {
      setFormData({ ...formData, customer_id: "" });
      setSelectedCustomer(null);
    }
  };

  // New Handler for Chit Type
  const handleChitTypeChange = (selectedOption) => {
    setFormData({
      ...formData,
      chit_type: selectedOption ? selectedOption.value : "",
    });
  };

  // --- API CALLS ---

  const fetchDataCustomer = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        const options = responseData.body.customer.map((cust) => ({
          value: cust.customer_id,
          label: cust.name,
          fullData: cust,
        }));

        setCustomerOptions(options);

        if (type === "edit" && rowData?.customer_id) {
          const preSelected = options.find(
            (opt) => opt.value === rowData.customer_id
          );
          if (preSelected) setSelectedCustomer(preSelected.fullData);
        }
      }
    } catch (error) {
      console.error("Error fetching customer data:", error.message);
    }
  };

  // Fixed and Implemented Chit Type Fetch
  const fetchChitType = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/chittype.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();
      
      if (responseData.head.code === 200) {
        // Map the Chit Type response
        const options = responseData.body.chit_type.map((item) => ({
            value: item.chit_type_id, // Storing the ID
            label: item.chit_type,    // Displaying the Name (e.g., "savings chit")
        }));
        setChitTypeOptions(options);
      }
    } catch (error) {
      console.error("Error fetching chit type data:", error.message);
    }
  };

  useEffect(() => {
    fetchDataCustomer();
    fetchChitType();
  }, []);

  const handleSubmit = async () => {
    // ... (Your existing submit logic)
  };

  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav pagetitle={t("Chit Creation")}></PageNav>
          </Col>

          {/* COLUMN 1: CUSTOMER DROPDOWN & CARD */}
          <Col lg="4" md="12" xs="12" className="py-3">
            <div className="mb-4">
              <label htmlFor="customer-select" className="mb-2">
                {t("Customer")}
              </label>
              <Select
                id="customer-select"
                placeholder={t("Select Customer")}
                isSearchable={true}
                options={customerOptions}
                onChange={handleCustomerChange}
                value={
                  customerOptions.find(
                    (opt) => opt.value === formData.customer_id
                  ) || null
                }
              />
            </div>

            {/* CUSTOMER DETAILS CARD */}
            {selectedCustomer && (
              <Card className="shadow border-0" style={{ borderRadius: "10px" }}>
                <Card.Body className="p-4">
                  <h6 className="text-center mb-4" style={{ fontWeight: "bold", color: "#333" }}>
                    Customer Information
                  </h6>
                  
                  {/* ... (Existing Card Details Code) ... */}
                   <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted fw-bold" style={{ fontSize: "0.9rem" }}>Customer No:</span>
                    <span style={{ fontSize: "0.9rem" }}>{selectedCustomer.customer_no || "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted fw-bold" style={{ fontSize: "0.9rem" }}>Name:</span>
                    <span style={{ fontSize: "0.9rem" }}>{selectedCustomer.name}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted fw-bold" style={{ fontSize: "0.9rem" }}>Address:</span>
                    <span style={{ fontSize: "0.9rem", textAlign: "right", maxWidth: "60%" }}>{selectedCustomer.address}</span>
                  </div>
                   <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted fw-bold" style={{ fontSize: "0.9rem" }}>Place:</span>
                    <span style={{ fontSize: "0.9rem" }}>{selectedCustomer.place}</span>
                  </div>
                   <div className="d-flex justify-content-between">
                    <span className="text-muted fw-bold" style={{ fontSize: "0.9rem" }}>Mobile Number:</span>
                    <span style={{ fontSize: "0.9rem" }}>{selectedCustomer.phone}</span>
                  </div>

                </Card.Body>
              </Card>
            )}
          </Col>

          {/* COLUMN 2: CHIT TYPE DROPDOWN (Added here) */}
          <Col lg="4" md="12" xs="12" className="py-3">
             <div className="mb-4">
              <label htmlFor="chittype-select" className="mb-2">
                {t("Chit Type")}
              </label>
              <Select
                id="chittype-select"
                placeholder={t("Select Chit Type")}
                isSearchable={true}
                options={chitTypeOptions}
                onChange={handleChitTypeChange}
                // Find current value based on ID stored in formData.chit_type
                value={
                  chitTypeOptions.find(
                    (opt) => opt.value === formData.chit_type
                  ) || null
                }
              />
            </div>
          </Col>

          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div style={{ textAlign: "right" }}>
              <ClickButton label="Submit" onClick={handleSubmit} />
              <span className="mx-2">
                <Delete label="Cancel" onClick={() => navigate(-1)} />
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChitCreation;
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form } from "react-bootstrap";
import PageTitle from "../components/PageTitle";
import { DropDown } from "../components/Forms";
import NotifyData from "../components/NotifyData";
import API_DOMAIN from "../config/config";

const CustomerHistory = () => {
  const [customers, setCustomers] = useState([]);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [customerCode, setCustomerCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      setLoading(false);

      if (responseData.head.code === 200) {
        setCustomers(responseData.body.customer || []);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);

      console.error("Error fetching data:", error.message);
      setError(error.message);
    }
  };

  // Fetch customer history
  const fetchCustomerhistory = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/groupdata.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list_history: "",
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      setLoading(false);

      if (responseData.head.code === 200) {
        setCustomerHistory(responseData.body.history || []);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);

      console.error("Error fetching data:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchCustomerhistory();
  }, []);

  // Filter history based on selected customer
  const filteredHistory = customerCode
    ? customerHistory.filter((history) => history.customer_no === customerCode)
    : customerHistory;

  // Format old/new values for display
  const formatValue = (value, actionType) => {
    if (!value) return "-";
    // Simple formatting for customer objects; customize as needed
    return `${value.name || "N/A"} - ${value.phone || "N/A"} - ${
      value.address || "N/A"
    }, ${value.place || "N/A"}`;
  };

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col xs="12" className="py-3">
            <PageTitle PageTitle="Customer History" showButton={false} />
          </Col>
        </Row>
        <Row>
          <Col xs="12" className="py-3">
            <Container fluid className="p-4">
              <Row>
                <Col lg="3" className="my-2">
                  <DropDown
                    textlabel="Customer No"
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value)}
                    options={
                      customers.length > 0
                        ? customers.map((customer) => ({
                            value: customer.customer_no,
                            label: `${customer.customer_no} (${customer.name})`,
                          }))
                        : [{ value: "", label: "Loading..." }]
                    }
                  />
                </Col>
                <Col lg="12">
                  <Table bordered hover striped responsive className="mt-4">
                    <thead className="table-secondary">
                      <tr>
                        <th className="recent_activities_heading">S.No</th>
                        <th className="recent_activities_heading">Date</th>
                        <th className="recent_activities_heading">
                          History Type
                        </th>
                        <th className="recent_activities_heading">Old Value</th>
                        <th className="recent_activities_heading">New Value</th>
                        <th className="recent_activities_heading">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.length > 0 ? (
                        filteredHistory.map((history, index) => (
                          <tr key={history.id || index}>
                            <td>{index + 1}</td>
                            <td>
                              {history.created_at
                                ? new Date(
                                    history.created_at
                                  ).toLocaleDateString("en-GB")
                                : "-"}
                            </td>
                            <td>{history.action_type}</td>
                            <td>
                              {formatValue(
                                history.old_value,
                                history.action_type
                              )}
                            </td>
                            <td>
                              {formatValue(
                                history.new_value,
                                history.action_type
                              )}
                            </td>
                            <td>{history.remarks}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">
                            No recent activities found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CustomerHistory;

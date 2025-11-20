import React, { useState, useEffect } from "react";
import { Table, Button, Dropdown } from "react-bootstrap";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../config/config";
import { Buttons } from "./Buttons";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import JewelPawnPdfG from "../pdf/JewelPawnPdfg";
import { PDFDownloadLink } from "@react-pdf/renderer";
import LoadingOverlay from "./LoadingOverlay";
import InterestStatementPDF from "../pdf/InterestStatementPDF";
import ReceiptPDF from "../pdf/jewelInterestPdf";
import JewelPawnrecoveryPdf from "../pdf/jewelpawnRecoverPdf";
import { MdCheckCircle, MdClose } from "react-icons/md";
const TableUI = ({
  headers,
  body,
  style,
  type,
  rowData,
  planViewAction,
  pageview,
  customActions,
}) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(body.length / itemsPerPage);
  const [loading, setLoading] = useState(false);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, body.length);
  const currentItems = body.slice(startIndex, endIndex);
  // States for PDF download
  const [pendingDownload, setPendingDownload] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "Admin";


  useEffect(() => {
    if (downloadUrl && pendingDownload) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${pendingDownload}_statement.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setPendingDownload(null);
      setTempData(null);
    }
  }, [downloadUrl, pendingDownload]);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setLoading(false);
      }, 500); // simulate delay
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setLoading(false);
      }, 500); // simulate delay
    }
  };
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const calculateDueDays = (pledgeDate, pledgeDueDate) => {
    const dueDate = new Date(pledgeDueDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
  const navigate = useNavigate();
  const handleDownloadStatement = async (pawnRow) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_DOMAIN}/getintereststatementreport.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receipt_no: pawnRow.receipt_no,
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setTempData({
          statement: responseData.body,
          customer: pawnRow,
        });
        setPendingDownload(pawnRow.receipt_no);
      } else {
        console.error("Error fetching statement:", responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching statement:", error.message);
    } finally {
      setLoading(false);
    }
  };
 
  const handleJewelPawningprintviewClick = (rowData) => {
    navigate("/console/jewelpawn", {
      state: { type: "pdfview", rowData: rowData },
    });
  };
  const handleJewelPawningofficeprintviewClick = (rowData) => {
    navigate("/console/jewelpawnoffice", {
      state: { type: "pdfview", rowData: rowData },
    });
  };
  const handleJewelRecoveryprintviewClick = (rowData) => {
    navigate("/console/jewelpawnrevery", {
      state: { type: "pdfview", rowData: rowData },
    });
  };
  const handleJewelPawngEditClick = (rowData) => {
    navigate("/console/pawn/jewelpawng/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelPawngprintviewClick = (rowData) => {
    navigate("/console/jewelpawng", {
      state: { type: "pdfview", rowData: rowData },
    });
  };
  const handleJewelInterestprintviewClick = (rowData) => {
    navigate("/console/interest/preview", {
      state: { type: "pdfview", rowData: rowData },
    });
  };
  const handleJewelPawngDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelryg.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_pawnjewelry_id: id,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/pawn/jewelpawng");
        window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  const handleinterestEditClick = (rowData) => {
    navigate("/console/customer/interest", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleinterestDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_interest_id: id,
          login_id: user.id,
          user_name: user.user_name,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/customer/interest");
        window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  const handleJewelEstimateEditClick = (rowData) => {
    navigate("/console/master/jewelestimate/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelEstimateDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnestimate.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_pawnjewelry_estimate_id: id,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/master/jewelestimate");
        // window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  const handleJewelUnitEditClick = (rowData) => {
    navigate("/console/master/unit/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelUnitDeleteClick = async (unit_id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/unit.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_unit_id: unit_id,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/master/unit");
        // window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  
  const handleJewelCategoryEditClick = (rowData) => {
    navigate("/console/master/category/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelCategoryDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/category.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_category_id: id,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/master/category");
        // window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  const handleBankPledgeEditClick = (rowData) => {
    navigate("/console/pawn/bankpledge/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleBankPledgeDeleteClick = async (id) => {
    console.log("Deleting bank pledge ID:", id);
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledge_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_bank_pledge_id: id,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/pawn/bankpledge");
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleStreetEditClick = (rowData) => {
    navigate("/console/master/Street/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleStreetDeleteClick = async (street_id) => {
    setLoading(true);
    console.log("Deleting street ID:", street_id); // Debug
    try {
      const response = await fetch(`${API_DOMAIN}/street.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_street_id: street_id,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        navigate("/console/master/Street");
        // window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  
  const handleBankPledgerEditClick = (rowData) => {
    navigate("/console/master/bankpledger/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleBankPledgerViewClick = (rowData) => {
    navigate("/console/master/bankpledger/create", {
      state: { type: "view", rowData: rowData },
    });
  };
  const handleBankPledgerClosingClick = (rowData) => {
    navigate("/console/master/bankpledger/create", {
      state: { type: "closing", rowData: rowData },
    });
  };
  const handleBankPledgerDeleteClick = async (bank_pledge_id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_bank_pledger_id: bank_pledge_id,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/master/bankpledger");
        window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  return (
    <>
      <LoadingOverlay isLoading={loading} />
      {pageview === "yes" && (
        <div className="text-end">
          <span className="mx-1">
            Page {currentPage} of {totalPages}
          </span>
          <span className="mx-1">
            <Buttons
              lable={<MdChevronLeft />}
              onClick={prevPage}
              disabled={currentPage === 1}
            />
          </span>
          <span className="mx-1">
            <Buttons
              lable={<MdChevronRight />}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            />
          </span>
        </div>
      )}
      <Table responsive="md" style={style}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{ textAlign: "center", padding: "20px" }}
              >
                No records found
              </td>
            </tr>
          ) : (
            currentItems.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                
                {type === "interest" && (
                  <>
                    <td>{startIndex + rowIndex + 1}</td>
                    <td>
                      {(() => {
                        const date = new Date(rowData.interest_receive_date);
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
                        const dd = String(date.getDate()).padStart(2, "0");
                        return `${dd}-${mm}-${yyyy}`;
                      })()}
                    </td>
                    <td>{rowData.name}</td>
                    <td>{rowData.receipt_no}</td>
                    <td>{rowData.mobile_number}</td>
                    <td>{rowData.interest_income}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle>
                          <Button className="action">
                            <BiDotsVerticalRounded />
                          </Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {/* <Dropdown.Item
                            onClick={() =>
                              handleJewelInterestprintviewClick(rowData)
                            }
                          >
                            print View
                          </Dropdown.Item> */}
                          <PDFDownloadLink
                            document={<ReceiptPDF data={rowData} />}
                            fileName={`${rowData.receipt_no}_interest.pdf`}
                          >
                            {({ blob, url, loading, error }) => (
                              <a
                                className="dropdown-item"
                                role="button"
                                tabIndex="0"
                                href={url}
                                download={`${rowData.receipt_no}_interest.pdf`}
                              >
                                Download PDF
                              </a>
                            )}
                          </PDFDownloadLink>
                          {isAdmin &&
                            rowIndex === body.length - 1 && ( // Show Edit option only if user is Admin and it's the last row
                              <Dropdown.Item
                                onClick={() => handleinterestEditClick(rowData)}
                              >
                                Edit
                              </Dropdown.Item>
                            )}
                          <Dropdown.Item
                            onClick={() =>
                              handleinterestDeleteClick(rowData.interest_id)
                            }
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </>
                )}
                {type === "jewelPawng" && (
                  <>
                    {" "}
                    {/* Fragment shorthand */}
                    <td>{startIndex + rowIndex + 1}</td>
                    <td>{rowData.recipt_no}</td>
                    <td>{rowData.customer_name}</td>
                    <td>{rowData.mobile_number}</td>
                    <td>{rowData.address}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle>
                          <Button className="action">
                            <BiDotsVerticalRounded />
                          </Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <PDFDownloadLink
                            document={<JewelPawnPdfG data={rowData} />}
                            fileName={`${rowData.recipt_no}.pdf`}
                          >
                            {({ blob, url, loading, error }) => (
                              <a
                                className="dropdown-item"
                                role="button"
                                tabIndex="0"
                                href={url}
                                download={`${rowData.recipt_no}.pdf`}
                              >
                                Download Pdf
                              </a>
                            )}
                          </PDFDownloadLink>
                          <Dropdown.Item
                            onClick={() =>
                              handleJewelPawngprintviewClick(rowData)
                            }
                          >
                            print View
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleJewelPawngEditClick(rowData)}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleJewelPawngDeleteClick(
                                rowData.pawnjewelryg_id
                              )
                            }
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </>
                )}
              
                {type === "jewelEstimate" && (
                  <>
                    {" "}
                    {/* Fragment shorthand */}
                    <td>{startIndex + rowIndex + 1}</td>
                    <td>{rowData.recipt_no}</td>
                    <td>{rowData.customer_name}</td>
                    <td>{rowData.mobile_number}</td>
                    <td>{rowData.address}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle>
                          <Button className="action">
                            <BiDotsVerticalRounded />
                          </Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {/* <Dropdown.Item onClick={() => handleJewelEstimateViewClick(rowData)}>View</Dropdown.Item> */}
                          <Dropdown.Item
                            onClick={() =>
                              handleJewelEstimateEditClick(rowData)
                            }
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleJewelEstimateDeleteClick(
                                rowData.pawnjewelry_estimate_id
                              )
                            }
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </>
                )}
                {type === "jewelUnit" && (
                  <>
                    {" "}
                    {/* Fragment shorthand */}
                    <td>{startIndex + rowIndex + 1}</td>
                    <td>{rowData.unit_type}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle>
                          <Button className="action">
                            <BiDotsVerticalRounded />
                          </Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {/* <Dropdown.Item onClick={() => handleJewelUnitViewClick(rowData)}>View</Dropdown.Item> */}
                          <Dropdown.Item
                            onClick={() => handleJewelUnitEditClick(rowData)}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleJewelUnitDeleteClick(rowData.unit_id)
                            }
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </>
                )}
              
                {type === "jewelCategory" && (
                  <>
                    {" "}
                    {/* Fragment shorthand */}
                    <td>{startIndex + rowIndex + 1}</td>
                    <td>{rowData.Group_type}</td>
                    <td>{rowData.Category_type}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle>
                          <Button className="action">
                            <BiDotsVerticalRounded />
                          </Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {/* <Dropdown.Item onClick={() => handleJewelCategoryViewClick(rowData)}>View</Dropdown.Item> */}
                          <Dropdown.Item
                            onClick={() =>
                              handleJewelCategoryEditClick(rowData)
                            }
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleJewelCategoryDeleteClick(
                                rowData.category_id
                              )
                            }
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </>
                )}
              
                {type === "street" && (
                  <>
                    <td>{startIndex + rowIndex + 1}</td>
                    <td>{rowData.street_eng}</td>
                    <td>{rowData.street_tam}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle>
                          <Button className="action">
                            <BiDotsVerticalRounded />
                          </Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handleStreetEditClick(rowData)}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleStreetDeleteClick(rowData.street_id)
                            }
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </>
                )}
                {type === "bankPledge" && (
                  <>
                    <td>{startIndex + rowIndex + 1}</td>
                    <td>{formatDate(rowData.bank_pledge_date)}</td>
                    <td>{rowData.customer_no}</td>
                    <td>{rowData.receipt_no}</td>
                    <td>{rowData.bank_loan_no}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle>
                          <Button className="action">
                            <BiDotsVerticalRounded />
                          </Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handleBankPledgeEditClick(rowData)}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleBankPledgeDeleteClick(
                                rowData.bank_pledge_details_id
                              )
                            }
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </>
                )}
             
                {type === "bankPledger" && (
                  <>
                    <td>{startIndex + rowIndex + 1}</td>
                    <td>{rowData.name}</td>
                    <td>{rowData.pawn_loan_no}</td>
                    <td>{rowData.pawn_value}</td>
                    <td>{rowData.pledge_date}</td>
                    <td>{rowData.pledge_due_date}</td>
                    <td className="status-cell">
                      <span
                        className={`status-badge status-${rowData.status.toLowerCase()}`}
                      >
                        {rowData.status === "Active" ? (
                          <>
                            <MdCheckCircle className="status-icon" />
                            Active
                          </>
                        ) : (
                          <>
                            <MdClose className="status-icon" />
                            Closed
                          </>
                        )}
                      </span>
                    </td>
                    <td className="due-days-cell">
                      {rowData.status === "Closed" ? (
                        <span className="due-days-closed">—</span>
                      ) : (
                        (() => {
                          const daysLeft = calculateDueDays(
                            rowData.pledge_date,
                            rowData.pledge_due_date
                          );
                          const isUrgent = daysLeft <= 10;
                          return (
                            <span
                              className={`due-days-text ${
                                isUrgent ? "blink-text" : ""
                              }`}
                              style={{ color: isUrgent ? "red" : "green" }}
                            >
                              {daysLeft} days
                            </span>
                          );
                        })()
                      )}
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle>
                          <Button className="action">
                            <BiDotsVerticalRounded />
                          </Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {rowData.status === "Closed" ? (
                            <>
                              <Dropdown.Item
                                onClick={() =>
                                  handleBankPledgerViewClick(rowData)
                                }
                              >
                                View
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleBankPledgerDeleteClick(
                                    rowData.bank_pledge_id
                                  )
                                }
                              >
                                Delete
                              </Dropdown.Item>
                            </>
                          ) : (
                            <>
                              {isAdmin && (
                                <Dropdown.Item
                                  onClick={() =>
                                    handleBankPledgerEditClick(rowData)
                                  }
                                >
                                  Edit
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item
                                onClick={() =>
                                  handleBankPledgerClosingClick(rowData)
                                }
                              >
                                Closing
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleBankPledgerDeleteClick(
                                    rowData.bank_pledge_id
                                  )
                                }
                              >
                                Delete
                              </Dropdown.Item>
                            </>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </>
                )}
                
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {pageview === "yes" && (
        <div className="text-end">
          <span className="mx-1">
            Page {currentPage} of {totalPages}
          </span>
          <span className="mx-1">
            <Buttons
              lable={<MdChevronLeft />}
              onClick={prevPage}
              disabled={currentPage === 1}
            />
          </span>
          <span className="mx-1">
            <Buttons
              lable={<MdChevronRight />}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            />
          </span>
        </div>
      )}
      {pendingDownload && tempData && (
        <PDFDownloadLink
          document={<InterestStatementPDF data={tempData} />}
          fileName={`${pendingDownload}_statement.pdf`}
        >
          {({ blob, url, loading: pdfLoading, error }) => {
            if (!pdfLoading && url && !error) {
              setDownloadUrl(url);
            }
            return <div style={{ display: "none" }} />;
          }}
        </PDFDownloadLink>
      )}
    </>
  );
};
export default TableUI;

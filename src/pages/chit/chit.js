import React, { useState, useEffect, useMemo } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useLanguage } from "../../components/LanguageContext";
import { ToastContainer, toast } from "react-toastify";
// 💡 NEW IMPORTS FOR MATERIAL REACT TABLE
import { MaterialReactTable } from "material-react-table";
import { Box, Tooltip, IconButton } from "@mui/material";
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineDelete } from "react-icons/md";

const Chit = () => {
  const { t, cacheVersion } = useLanguage();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [chitData, setChitData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Handlers for Edit and Delete Actions
  const handleEditClick = async (rowData) => {
    console.log("Edit Group ID:", rowData.chit_id);
    const chitId = rowData.chit_id;
    setLoading(true);

    try {
      console.log("Inside try block");

      const requestPayload = { chit_id: chitId };
      console.log("Edit Load Payload:", requestPayload);

      const response = await fetch(`${API_DOMAIN}/chit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      console.log("Response:", JSON.stringify(requestPayload));

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      setLoading(false);
      if (
        responseData.head.code === 200 &&
        responseData.data.chit &&
        responseData.data.chit.length > 0
      ) {
        const detailedRowData = responseData.data.chit[0];
        console.log("Detailed Row Data:", detailedRowData);
        navigate("/console/master/chit/create", {
          state: {
            type: "edit",
            rowData: detailedRowData,
          },
        });
      } else {
        console.error(
          "Failed to fetch detailed chit data:",
          responseData.head.msg
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during edit fetch:", error);
    }
  };
  const handleDeleteClick = async (chitId) => {
    console.log("Delete Group ID:", chitId);
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/chittype.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_chit_type_id: chitId,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/master/chittype");
        window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(true);
    }
  };

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "Admin";

  // 2. Corrected Data Fetching Logic
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data with search text:", searchText);
      setLoading(true);
      try {
        const response = await fetch(`${API_DOMAIN}/chit.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search_text: searchText,
          }),
        });
        const responseData = await response.json();
        console.log(responseData);

        if (responseData.head.code === 200) {
          setChitData(
            Array.isArray(responseData.data.all) ? responseData.data.all : []
          );
          setLoading(false);
        } else {
          setChitData([]);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [searchText]);

  // 3. Define Material React Table Columns (Added Chit No and Due Amount)
  const columns = useMemo(
    () => [
      {
        accessorKey: "s_no_key",
        header: t("S.No"),
        size: 50,
        enableColumnFilter: false,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "customer_no",
        header: t("Customer No"),
        size: 100,
      },
      {
        accessorKey: "name",
        header: t("Customer Name"),
        size: 150,
      },
      {
        accessorKey: "chit_type",
        header: t("Chit Type"),
        size: 150,
      },

      {
        id: "action",
        header: t("Action"),
        size: 100,
        enableColumnFilter: false,
        enableColumnOrdering: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box
            sx={{
              justifyContent: "center",
              gap: "2 rem",
            }}
          >
            <Tooltip title={t("Edit")}>
              <IconButton
                onClick={() => handleEditClick(row.original)}
                sx={{ color: "#0d6efd", padding: 0 }}
              >
                <LiaEditSolid />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("Delete")}>
              <IconButton
                onClick={() =>
                  // NOTE: Changed to chit_id as it is the unique identifier for the chit
                  handleDeleteClick(row.original.chit_id)
                }
                sx={{ color: "#dc3545", padding: 0 }}
              >
                <MdOutlineDelete />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [t, cacheVersion]
  );

  // 4. Update JSX to render MaterialReactTable (Using t() for display strings)
  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">{t("Chit")}</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            {isAdmin && (
              <ClickButton
                label={<>{t("Add Chit")}</>}
                onClick={() => navigate("/console/master/chit/create")}
              ></ClickButton>
            )}
          </Col>
          {/* ... (Search Bar remains the same) ... */}
          <Col lg={9} md={12} xs={12} className="py-2"></Col>

          {/* 5. Replace TableUI with MaterialReactTable */}
          {loading ? (
            <LoadingOverlay isLoading={loading} />
          ) : (
            <>
              <Col lg="12" md="12" xs="12" className="px-0">
                <div className="py-1">
                  <MaterialReactTable
                    columns={columns}
                    data={chitData}
                    enableColumnActions={false}
                    enableColumnFilters={false}
                    enablePagination={true}
                    enableSorting={true}
                    initialState={{ density: "compact" }}
                    muiTablePaperProps={{
                      sx: {
                        borderRadius: "5px",
                        // Keep the existing style property for the table container
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        //textAlign: "center",
                      },
                    }}
                    muiTableHeadCellProps={{
                      sx: {
                        fontWeight: "bold",
                        backgroundColor: "#000000ff",
                        color: "white", // Light gray header background
                      },
                    }}
                  />
                </div>
              </Col>
            </>
          )}
          <Col lg="4"></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Chit;

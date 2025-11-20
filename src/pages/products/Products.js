import React, { useState, useEffect, useMemo } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import LoadingOverlay from "../../components/LoadingOverlay";

// 💡 NEW IMPORTS FOR MATERIAL REACT TABLE
import { MaterialReactTable } from "material-react-table";
import { Box, Tooltip, IconButton } from "@mui/material";
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineDelete } from "react-icons/md";
import { useLanguage } from "../../components/LanguageContext";

const Products = () => {
  const navigate = useNavigate();
  const { t,cacheVersion } = useLanguage();
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Handlers for Edit and Delete Actions (Unchanged)
  const handleProductEditClick = (rowData) => {
    console.log("Edit Group3344443:", rowData);
    console.log("Edit Group:", rowData);
    navigate("/console/master/Products/create", {
      state: {
        type: "edit",
        rowData: rowData,
      },
    });
  };
  const handleProductDeleteClick = async (product_id) => {
    setLoading(true);
    console.log("Deleting Product ID:", product_id); // Debug
    try {
      const response = await fetch(`${API_DOMAIN}/product.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_product_id: product_id,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        navigate("/console/master/products");
        window.location.reload();
        setLoading(false);
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  // 2. Data Fetching Logic (Unchanged)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(); // Fetch data after debouncing
    }, 300); // Adjust debounce time as needed

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [searchText]);

  // Function to fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      console.log("Fetching data with search text:", searchText);

      const response = await fetch(`${API_DOMAIN}/product.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      console.log("API response:", responseData);

      if (responseData.head.code === 200) {
        setUserData(responseData.body.product);
        setLoading(false);
      } else {
        throw new Error(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchText]);

  // 3. Define Material React Table Columns 
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
        accessorKey: "product_eng",
        header: t("Product Name"), 
        size: 50,
      },
      {
        accessorKey: "product_tam",
        header: t("Product Name Tamil"),
        size: 50,
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
            {/* Edit Icon */}
            <Tooltip title={t("Edit")}>
              <IconButton
                onClick={() => handleProductEditClick(row.original)}
                sx={{ color: "#0d6efd", padding: 0 }}
              >
                <LiaEditSolid />
              </IconButton>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip title={t("Delete")}>
              <IconButton
                onClick={() =>
                  handleProductDeleteClick(row.original.product_id)
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
    [t,cacheVersion] 
  );

  // 4. Update JSX to render MaterialReactTable
  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">{t("Products")}</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>{t("Add Products")}</>}
              onClick={() => navigate("/console/master/products/create")}
            ></ClickButton>
          </Col>
          <Col lg={9} md={12} xs={12} className="py-2"></Col>

          {/* 5. MaterialReactTable */}
          {loading ? (
            <LoadingOverlay isLoading={loading} />
          ) : (
            <>
              <Col lg="12" md="12" xs="12" className="px-0">
                <div className="py-1">
                  <MaterialReactTable
                    columns={columns}
                    data={userData}
                    enableColumnActions={false}
                    enableColumnFilters={false}
                    enablePagination={true}
                    enableSorting={true}
                    initialState={{ density: "compact" }}
                    muiTablePaperProps={{
                      sx: {
                        borderRadius: "5px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                    }}
                    muiTableHeadCellProps={{
                      sx: {
                        fontWeight: "bold",
                        backgroundColor: "#020202ff",
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

export default Products;
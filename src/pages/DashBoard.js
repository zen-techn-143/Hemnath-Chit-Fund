import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Container, Row, Col, Spinner, Table, Form } from "react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import {
  Button,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { MdOutlinePerson } from "react-icons/md";
import { AiFillGolden } from "react-icons/ai";
import { RiDeviceRecoverLine } from "react-icons/ri";
import API_DOMAIN from "../config/config";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./tablecus.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingOverlay from "../components/LoadingOverlay";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmsIcon from "@mui/icons-material/Sms";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../components/LanguageContext"; // Adjust path
const DashBoard = () => {
  const { t } = useLanguage();
  const theme = useTheme();
  const [userecoveryData, setUserrecoveryData] = useState([]);
  const [jewelpawnData, setUserjewlpawnData] = useState([]);
  const [customerData, setcustomerData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [interestData, setInterestData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [bankPledgeData, setBankPledgeData] = useState([]);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeSearchTerm, setPlaceSearchTerm] = useState("");
  const [noticeSearchTerm, setNoticeSearchTerm] = useState("");
  const [actionSearchTerm, setActionSearchTerm] = useState("");
  const [selectedCustomerNo, setSelectedCustomerNo] = useState("");
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filteredData, setFilteredData] = useState([]);
  const [loadingPawn, setLoadingPawn] = useState(true);
  const [loadingRecovery, setLoadingRecovery] = useState(true);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingInterest, setLoadingInterest] = useState(true);
  const [loadingAction, setLoadingAction] = useState(true);
  const [loadingBank, setLoadingBank] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [jewelPrices, setJewelPrices] = useState({});
  dayjs.extend(customParseFormat);
  const parsePeriod = (periodStr) => {
    const monthsMatch = periodStr.match(/(\d+)\s*month/);
    return {
      months: monthsMatch ? parseInt(monthsMatch[1]) : 0,
    };
  };
  // Aggregate interest data by receipt_no
  const aggregateInterestData = (interestData) => {
    const aggregated = interestData.reduce((acc, item) => {
      const receiptNo = item.receipt_no;
      if (!acc[receiptNo]) {
        acc[receiptNo] = {
          total_interest_income: 0,
          total_paid_months: 0,
        };
      }
      acc[receiptNo].total_interest_income += parseFloat(
        item.interest_income || 0
      );
      const { months } = parsePeriod(item.interest_payment_periods);
      acc[receiptNo].total_paid_months += months;
      return acc;
    }, {});
    Object.keys(aggregated).forEach((receiptNo) => {
      aggregated[receiptNo].interest_payment_periods =
        aggregated[receiptNo].total_paid_months +
        " month" +
        (aggregated[receiptNo].total_paid_months !== 1 ? "s" : "");
    });
    return aggregated;
  };
  const getValueDisplay = (val) => {
    if (!val || (Array.isArray(val) && val.length === 0)) {
      return <span className="text-muted">N/A</span>;
    }
    // Blacklist of fields to skip
    const skipFields = [
      "id",
      "interest_id",
      "pawnjewelry_id",
      "customer_id",
      "pawnjewelry_recovery_id",
      "create_at",
      "delete_at",
      "created_by_id",
      "create_by_id",
      "updated_by_id",
      "deleted_by_id",
    ];
    const formatJewelProduct = (jewelStr) => {
      if (!jewelStr) return "No items";
      try {
        // Clean extra escapes (e.g., \\\" -> ")
        let cleanStr = jewelStr.replace(/\\\\/g, "\\").replace(/\\"/g, '"');
        const jewels = JSON.parse(cleanStr);
        return (
          jewels
            .filter((j) => j.JewelName && j.JewelName.trim())
            .map(
              (j) =>
                `${j.JewelName} (${j.count || 1} pcs, ${j.weight || 0}g, ${
                  j.carrat || ""
                })`
            )
            .join(", ") || "No items"
        );
      } catch (e) {
        console.error("Parse error:", e, jewelStr);
        return "Invalid format";
      }
    };
    const formatField = (key, value) => {
      if (value === null || value === undefined || value === "") return null;
      switch (key) {
        case "pawnjewelry_date":
        case "interest_receive_date":
        case "pawnjewelry_recovery_date":
        case "created_at":
          return dayjs(value).format("DD-MM-YYYY");
        case "original_amount":
        case "outstanding_amount":
        case "interest_income":
        case "topup_amount":
        case "deduction_amount":
        case "interest_payment_amount":
        case "refund_amount":
        case "other_amount":
        case "interest_paid":
          return `₹${parseFloat(value || 0).toLocaleString("en-IN")}`;
        case "jewel_product":
          return formatJewelProduct(value);
        case "interest_rate":
          return `${value}%`;
        case "status":
          return value; // Keep as is (e.g., Tamil text)
        case "proof":
        case "aadharproof":
          return Array.isArray(value) ? "Uploaded files" : value || "None";
        default:
          return value;
      }
    };
    return (
      <div
        style={{
          fontSize: "0.75em",
          lineHeight: "1.2",
          textAlign: "left",
          wordBreak: "break-word",
        }}
      >
        {Object.entries(val).map(([key, value]) => {
          if (skipFields.includes(key)) return null;
          const formattedValue = formatField(key, value);
          if (formattedValue === null) return null;
          return (
            <div key={key}>
              <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
              {formattedValue}
            </div>
          );
        })}
      </div>
    );
  };
  const fetchCustomerHistory = async (customerNo) => {
    if (!customerNo) {
      setCustomerHistory([]);
      return;
    }
    setLoadingHistory(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer_history.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          list_history: true,
          customer_no: customerNo,
          fromdate: fromDate,
          todate: toDate,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setCustomerHistory(responseData.body.history || []);
        console.log("setCustomer", setCustomerHistory);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching history:", error.message);
      setCustomerHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };
  const fetchDatajewelpawncustomer = async () => {
    setLoadingCustomer(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setcustomerData(responseData.body.customer);
        setLoadingCustomer(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoadingCustomer(false);
    }
  };
  const fetchDatarecovery = async () => {
    setLoadingRecovery(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        let sortedData = responseData.body.pawn_recovery.map((user) => ({
          ...user,
          jewel_product: JSON.parse(user.jewel_product || "[]"),
        }));
        setUserrecoveryData(sortedData);
        setLoadingRecovery(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoadingRecovery(false);
    }
  };
  const fetchDatajewelpawn = async () => {
    setLoadingPawn(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        const sortedData = responseData.body.pawnjewelry.map((user) => ({
          ...user,
          jewel_product: JSON.parse(user.jewel_product || "[]"),
        }));
        setUserjewlpawnData(sortedData);
        setUserData(sortedData);
        setFilteredData(sortedData);
        setLoadingPawn(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoadingPawn(false);
    }
  };
  const fetchinterestData = async () => {
    setLoadingInterest(true);
    try {
      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setInterestData(responseData.body.interest);
        setLoadingInterest(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoadingInterest(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchActionData = async () => {
    setLoadingAction(true);
    try {
      const response = await fetch(`${API_DOMAIN}/action.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        const sortedData = responseData.body.action.map((action) => ({
          ...action,
          jewel_product: JSON.parse(action.jewel_product || "[]"),
        }));
        setActionData(sortedData);
        setLoadingAction(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching action data:", error.message);
      setLoadingAction(false);
    }
  };
  const fetchBankPledgeData = async () => {
    setLoadingBank(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledge_details.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setBankPledgeData(responseData.body.bank_pledge_details || []);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching bank pledge data:", error.message);
    } finally {
      setLoadingBank(false);
    }
  };
  const fetchJewelPrices = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/company.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200 && responseData.body.company) {
        const details = responseData.body.company.jewel_price_details;
        if (details) {
          try {
            const parsed = JSON.parse(details);
            setJewelPrices(parsed);
          } catch (e) {
            console.error("Parse error", e);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching jewel prices:", e);
    }
  };
  const handleSearch = () => {
    let filtered = userData;
    if (searchTerm || placeSearchTerm) {
      filtered = userData.filter((item) => {
        const matchesMobile = searchTerm
          ? item.mobile_number.toString().includes(searchTerm)
          : true;
        const matchesReceipt = searchTerm
          ? item.receipt_no.toString().includes(searchTerm)
          : true;
        const matchesCustomerno = searchTerm
          ? item.customer_no.toString().includes(searchTerm)
          : true;
        const matchesCustomerName = searchTerm
          ? (typeof item.name === "string"
              ? item.name.toLowerCase()
              : ""
            ).includes(searchTerm.toLowerCase())
          : true;
        const matchesPlace = placeSearchTerm
          ? (item.place || "")
              .toLowerCase()
              .includes(placeSearchTerm.toLowerCase())
          : true;
        return (
          (matchesMobile ||
            matchesReceipt ||
            matchesCustomerName ||
            matchesCustomerno) &&
          matchesPlace
        );
      });
    }
    setFilteredData(filtered);
  };
  // search handler for Notice Alert Summary
  const handleNoticeSearch = () => {
    const notices = generateNoticeAlerts();
    console.log(notices);
    if (noticeSearchTerm) {
      return notices.filter((notice) => {
        const matchesReceipt = notice.receipt_no
          .toString()
          .toLowerCase()
          .includes(noticeSearchTerm.toLowerCase());
        const matchesName = notice.name
          .toLowerCase()
          .includes(noticeSearchTerm.toLowerCase());
        const matchesMobile = notice.mobile_number
          ? notice.mobile_number
              .toString()
              .toLowerCase()
              .includes(noticeSearchTerm.toLowerCase())
          : false;
        return matchesReceipt || matchesName || matchesMobile;
      });
    }
    return notices;
  };
  // search handler for Action Alert Summary
  const handleActionSearch = () => {
    if (actionSearchTerm) {
      return actionData.filter((action) => {
        const matchesReceipt = action.receipt_no
          .toString()
          .toLowerCase()
          .includes(actionSearchTerm.toLowerCase());
        const matchesName = action.name
          .toLowerCase()
          .includes(actionSearchTerm.toLowerCase());
        const matchesMobile = action.mobile_number
          ? action.mobile_number
              .toString()
              .toLowerCase()
              .includes(actionSearchTerm.toLowerCase())
          : false;
        return matchesReceipt || matchesName || matchesMobile;
      });
    }
    return actionData;
  };
  const handleClear = () => {
    setSearchTerm("");
    setPlaceSearchTerm("");
    setFilteredData(userData);
  };
  const handleNoticeClear = () => {
    setNoticeSearchTerm("");
  };
  const handleActionClear = () => {
    setActionSearchTerm("");
  };
  const handleHistoryClear = () => {
    setSelectedCustomerNo("");
    setFromDate(dayjs().startOf("month").format("YYYY-MM-DD"));
    setToDate(dayjs().format("YYYY-MM-DD"));
    setCustomerHistory([]);
  };
  useEffect(() => {
    handleSearch();
  }, [searchTerm, placeSearchTerm, userData]);
  useEffect(() => {
    fetchDatajewelpawn();
    fetchDatarecovery();
    fetchDatajewelpawncustomer();
    fetchinterestData();
    fetchActionData();
    fetchBankPledgeData();
    fetchJewelPrices();
  }, []);
  useEffect(() => {
    if (jewelpawnData.length > 0 && interestData.length > 0) {
      const merged = jewelpawnData.map((pawn) => {
        const interestMatch = interestData.find(
          (int) => int.receipt_no === pawn.receipt_no
        );
        return {
          ...pawn,
          interest_payment_periods:
            interestMatch?.interest_payment_periods || "N/A",
          total_interest_income: interestMatch
            ? parseFloat(interestMatch.interest_income || 0)
            : 0,
        };
      });
      setFilteredData(merged);
    }
  }, [jewelpawnData, interestData]);
  const aggregatedInterestData = aggregateInterestData(interestData);
  const isPageLoading =
    loadingPawn ||
    loadingRecovery ||
    loadingCustomer ||
    loadingInterest ||
    loadingAction ||
    loadingBank;
  function getTamilAlertMessage(name, receiptNo, date, months) {
    if (months >= 12) {
      return `அபிநயா அடகு கடை
திரு / திருமதி ${name}, உங்கள் அடகு எண் ${receiptNo} அன்று அடகு வைக்கப்பட்ட நகையானது 12 மாதங்களை கடந்த நிலையில் அசல் மற்றும் வட்டி செலுத்தி திருப்பிக்கொள்ளுமாறு அல்லது வட்டி செலுத்தி கடனை புதுப்பிக்குமாறு கேட்டுக்கொள்ளப்படுகிறது.`;
    } else if (months >= 9) {
      return `அபிநயா அடகு கடை
திரு / திருமதி ${name}, உங்கள் அடகு எண் ${receiptNo} அன்று அடகு வைக்கப்பட்ட நகையானது 9 மாதங்களை கடந்த நிலையில் வட்டி செலுத்தி கடனை புதுப்பிக்குமாறு அறிவுறுத்தப்படுகிறது.`;
    } else if (months >= 6) {
      return `அபிநயா அடகு கடை
திரு / திருமதி ${name}, உங்கள் அடகு எண் ${receiptNo} அன்று அடகு வைக்கப்பட்ட நகையானது 6 மாதங்களை கடந்த நிலையில் வட்டி கட்டுமாறு அறிவுறுத்தப்படுகிறது.`;
    } else {
      return "";
    }
  }
  function getRowClass(months) {
    if (months >= 12) return "row-red";
    if (months >= 9) return "row-orange";
    if (months >= 6) return "row-yellow";
    // This is the green row
    if (months < 6) return "row-yellowtest";
    return "";
  }
  function getMonthsDifference(startDate) {
    const now = dayjs();
    const start = dayjs(startDate);
    return now.diff(start, "month");
  }
  function generateWhatsAppURL(number, message) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }
  const getEligibleNotices = (pawnDate) => {
    const now = dayjs();
    const baseDate = dayjs(pawnDate);
    const notices = [];
    if (now.diff(baseDate.add(1, "year").add(1, "week"), "day") >= 0) {
      notices.push({
        noticeNo: 1,
        date: baseDate.add(1, "year").add(1, "week").format("DD-MM-YYYY"),
      });
    }
    if (now.diff(baseDate.add(1, "year").add(3, "month"), "day") >= 0) {
      notices.push({
        noticeNo: 2,
        date: baseDate.add(1, "year").add(3, "month").format("DD-MM-YYYY"),
      });
    }
    if (now.diff(baseDate.add(1, "year").add(6, "month"), "day") >= 0) {
      notices.push({
        noticeNo: 3,
        date: baseDate.add(1, "year").add(6, "month").format("DD-MM-YYYY"),
      });
    }
    return notices;
  };
  const generateNoticeAlerts = () => {
    let notices = [];
    userData.forEach((item) => {
      const eligibleNotices = getEligibleNotices(item.pawnjewelry_date);
      eligibleNotices.forEach((notice) => {
        notices.push({
          receipt_no: item.receipt_no,
          name: item.name,
          mobile_number: item.mobile_number,
          jewel_product: Array.isArray(item.jewel_product)
            ? item.jewel_product.map((j) => j.JewelName).join(", ")
            : "",
          notice_date: notice.date,
          notice_no: notice.noticeNo,
          pawnjewelry_date: item.pawnjewelry_date,
        });
      });
    });
    return notices;
  };
  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  const displayValue = (
    value,
    isDate = false,
    isCurrency = false,
    isPercentage = false
  ) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    if (isDate && value) {
      return dayjs(value).isValid() ? dayjs(value).format("DD-MM-YYYY") : "-";
    }
    if (isCurrency && value !== null && value !== undefined) {
      return `₹${Number(value).toLocaleString("en-IN")}`;
    }
    if (isPercentage && value !== null && value !== undefined) {
      return `${value}%`;
    }
    return value || "-";
  };
  useEffect(() => {
    if (selectedCustomerNo) {
      fetchCustomerHistory(selectedCustomerNo);
    }
  }, [fromDate, toDate]);
  const caratEntries = Object.entries(jewelPrices)
    .filter(([key]) => key.endsWith("_carat_price"))
    .sort(([a], [b]) => parseInt(b.split("_")[0]) - parseInt(a.split("_")[0]));
  const marqueeText = caratEntries
    .map(([key, value]) => {
      const carat = key.split("_")[0];
      return `${carat} karat Rate = ₹${(value || 0).toLocaleString("en-IN")}`;
    })
    .join(", ");

  // Define columns for MaterialReactTable
  const columns = [
    {
      accessorKey: "pawnjewelry_date",
      header: t("Date"),
      size: 20,
      Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
    },
    {
      accessorKey: "receipt_no",
      header: t("Loan Number"),
      size: 10,
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "customer_no",
      header: t("Customer Number"),
      size: 10,
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    { accessorKey: "name", header: t("Customer Name"), size: 20 },
    { accessorKey: "place", header: t("Location") },
    { accessorKey: "mobile_number", header: t("Mobile Number") },
    {
      accessorKey: "original_amount",
      header: t("Principal Amount (₹)"),
      size: 100,
      Cell: ({ cell }) =>
        `₹${parseFloat(cell.getValue() || 0).toLocaleString("en-IN")}`,
    },
    { accessorKey: "interest_rate", header: t("Interest Rate (%)"), size: 20 },
    {
      accessorKey: "jewel_product",
      header: t("Pawned Items"),

      Cell: ({ cell }) => {
        try {
          const jewels = Array.isArray(cell.getValue())
            ? cell.getValue()
            : JSON.parse(cell.getValue());
          return jewels.map((j) => j.JewelName).join(", ");
        } catch {
          return "-";
        }
      },
    },
    {
      accessorKey: "total_weight",
      header: t("Jewelry Weight (g)"),
      size: 20,
      Cell: ({ row }) => {
        try {
          const jewels = Array.isArray(row.original.jewel_product)
            ? row.original.jewel_product
            : JSON.parse(row.original.jewel_product || "[]");
          const total = jewels.reduce(
            (sum, j) => sum + parseFloat(j.weight || 0),
            0
          );
          return total > 0 ? total.toFixed(2) : "-";
        } catch {
          return "-";
        }
      },
    },
    {
      accessorKey: "net_weight",
      header: t("Net Weight (g)"),
      size: 20,
      Cell: ({ row }) => {
        try {
          const jewels = Array.isArray(row.original.jewel_product)
            ? row.original.jewel_product
            : JSON.parse(row.original.jewel_product || "[]");
          const total = jewels.reduce(
            (sum, j) => sum + parseFloat(j.net || 0),
            0
          );
          return total > 0 ? total.toFixed(2) : "-";
        } catch {
          return "-";
        }
      },
    },
    {
      accessorKey: "jewel_value",
      header: t("Jewelry Value (Pawned)"),
      size: 20,
      Cell: ({ row }) => {
        const jewelList = Array.isArray(row.original.jewel_product)
          ? row.original.jewel_product
          : JSON.parse(row.original.jewel_product || "[]");
        const totalNetWeight = jewelList.reduce(
          (sum, jewel) => sum + parseFloat(jewel.net || 0),
          0
        );
        const originalAmount = parseFloat(row.original.original_amount || 0);
        // Prevent division by zero
        if (!totalNetWeight || totalNetWeight === 0) {
          return "Infinity";
        }
        const value = originalAmount / totalNetWeight;
        return `₹${Math.round(value).toLocaleString("en-IN")}`;
      },
    },
    {
      accessorKey: "interest_payment_period",
      header: t("Interest Outstanding"),
      muiTableHeadCellProps: {
        align: "center", // centers the header text horizontally
      },
      Cell: ({ row }) => {
        const period = row.original.interest_payment_period || 0;
        const amount = row.original.interest_payment_amount || 0;
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "13px", color: "#000" }}>
              {period ? `${period} months` : "N/A"}
            </span>
            <span style={{ color: "green", fontWeight: 500 }}>
              ₹{Math.round(amount).toLocaleString("en-IN")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "interest_paid",
      header: t("Interest Paid (₹)"),
      size: 20,
      Cell: ({ row }) => {
        const months = row.original.interest_payment_periods || "N/A";
        const total = parseFloat(row.original.total_interest_income || 0);
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "13px", color: "#000" }}>{months}</span>
            <span style={{ color: "green", fontWeight: 500 }}>
              ₹{Math.round(total).toLocaleString("en-IN")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "total_appraisal",
      header: t("Total Appraisal (₹)"),
      size: 20,
      muiTableBodyCellProps: {
        align: "center", // aligns all cell values to the right
      },
      Cell: ({ row }) => {
        const total =
          parseFloat(row.original.original_amount || 0) +
          parseFloat(row.original.interest_payment_amount || 0);
        return `₹${Math.round(total).toLocaleString("en-IN")}`;
      },
    },
    {
      accessorKey: "status",
      header: t("Status"),
      size: 10,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        const isRecovered = value === "நகை மீட்கபட்டது";
        return (
          <Chip
            color={isRecovered ? "error" : "success"}
            sx={{
              borderRadius: "50px",
              width: "20px",
              height: "20px",
            }}
          />
        );
      },
    },
    {
      accessorKey: "overdue_months",
      header: t("Interest Overdue (Months)"),
      size: 10,
      muiTableHeadCellProps: {
        align: "center", // centers the header text horizontally
      },
      muiTableBodyCellProps: {
        align: "center", // aligns all cell values to the center
      },
      Cell: ({ row }) => {
        const months = getMonthsDifference(row.original.pawnjewelry_date);
        return months;
      },
    },
    {
      accessorKey: "alert",
      header: t("Alert"),
      size: 10,
      muiTableHeadCellProps: {
        align: "center", // centers the header text horizontally
      },
      muiTableBodyCellProps: {
        align: "center", // aligns all cell values to the center
      },
      Cell: ({ row }) => {
        const item = row.original;
        const months = getMonthsDifference(item.pawnjewelry_date);
        const alertContent = getTamilAlertMessage(
          item.name,
          item.receipt_no,
          item.pawnjewelry_date,
          months
        );
        const isRecovered = item.status === "நகை மீட்கபட்டது";
        if (isRecovered || !alertContent) {
          return <span style={{ color: "#999" }}>-</span>;
        }
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Tooltip title="Send WhatsApp">
              <IconButton
                onClick={() => {
                  const url = generateWhatsAppURL(
                    item.mobile_number,
                    alertContent
                  );
                  window.open(url, "_blank");
                }}
                sx={{
                  backgroundColor: "#25D366",
                  color: "#4be760ff",
                  "&:hover": { backgroundColor: "#1DA851" },
                }}
                size="medium"
              >
                <WhatsAppIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send SMS">
              <a
                href={`sms:${item.mobile_number}?body=${encodeURIComponent(
                  alertContent
                )}`}
                style={{ textDecoration: "none" }}
              >
                <IconButton
                  sx={{
                    backgroundColor: "#2b5585ff",
                    color: "#3080e9ff",
                    "&:hover": { backgroundColor: "#389ee2ff" },
                  }}
                  size="medium"
                >
                  <SmsIcon fontSize="medium" />
                </IconButton>
              </a>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];
  const noticeColumns = [
    {
      accessorFn: (_, index) => index + 1,
      id: "sno",
      header: t("S.No"),
      size: 30,
      muiTableHeadCellProps: {
        align: "left", // centers the header text horizontally
      },
      muiTableBodyCellProps: {
        align: "left",
      },
      Cell: ({ cell }) => (
        <strong style={{ fontWeight: 600 }}>{cell.getValue()}</strong>
      ),
    },
    {
      accessorKey: "pawnjewelry_date",
      header: t("Loan Date"),
      muiTableHeadCellProps: {
        align: "left", // centers the header text horizontally
      },
      Cell: ({ cell }) =>
        cell.getValue() ? dayjs(cell.getValue()).format("DD-MM-YYYY") : "-", // YYYY-MM-DD is ISO, so no change needed
    },
    {
      accessorKey: "receipt_no",
      header: t("Loan Number"),
      muiTableHeadCellProps: {
        align: "left", // centers the header text horizontally
      },
    },
    {
      accessorKey: "name",
      header: t("Customer Name"),
      muiTableHeadCellProps: {
        align: "left", // centers the header text horizontally
      },
    },
    {
      accessorKey: "jewel_product",
      header: t("Ornaments"),
      muiTableHeadCellProps: {
        align: "left", // centers the header text horizontally
      },
      Cell: ({ cell }) => cell.getValue() || "-",
    },
    {
      accessorKey: "notice_date",
      header: t("Notice Date"),
      muiTableHeadCellProps: {
        align: "left", // centers the header text horizontally
      },
      Cell: ({ cell }) => (
        <Chip
          label={
            cell.getValue()
              ? dayjs(cell.getValue(), "DD-MM-YYYY").format("DD-MM-YYYY")
              : "-"
          }
          color="default"
          variant="outlined"
        />
      ),
    },
    {
      accessorKey: "notice_no",
      header: t("Notice No"),
      muiTableHeadCellProps: {
        align: "left", // centers the header text horizontally
      },
      Cell: ({ cell }) => {
        const n = parseInt(cell.getValue());
        let bgColor = "#ccc";
        if (n === 1) bgColor = "#fbff12";
        else if (n === 2) bgColor = "#fc8319";
        else if (n === 3) bgColor = "#f20707";
        return (
          <Chip
            label={`Notice ${n}`}
            sx={{
              backgroundColor: bgColor,
              color: "#000",
              fontWeight: "bold",
              borderRadius: "6px",
            }}
          />
        );
      },
    },
  ];
  const actionColumns = [
    {
      accessorFn: (_, index) => index + 1,
      id: "sno",
      header: t("S.No"),
      size: 50,
      Cell: ({ cell }) => (
        <strong style={{ fontWeight: 600 }}>{cell.getValue()}</strong>
      ),
    },
    { accessorKey: "receipt_no", header: t("Loan Number") },
    { accessorKey: "name", header: t("Customer Name") },
    {
      accessorKey: "jewel_product",
      header: t("Ornaments"),
      Cell: ({ cell }) =>
        Array.isArray(cell.getValue())
          ? cell
              .getValue()
              .map((j) => j.JewelName)
              .join(", ")
          : cell.getValue(),
    },
    {
      accessorKey: "original_amount",
      header: t("Loan Amount (₹)"),
      Cell: ({ cell }) =>
        `₹${parseFloat(cell.getValue() || 0).toLocaleString("en-IN")}`,
    },
    {
      accessorKey: "action_date",
      header: t("Action Date"),
      Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
    },
  ];
  const historyColumns = [
    {
      accessorKey: "created_at",
      header: t("Date"),
      Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY HH:mm"),
    },
    {
      accessorFn: (row) => {
        if (
          row.old_value &&
          typeof row.old_value === "object" &&
          row.old_value.receipt_no
        ) {
          return row.old_value.receipt_no;
        }
        if (
          row.new_value &&
          typeof row.new_value === "object" &&
          row.new_value.receipt_no
        ) {
          return row.new_value.receipt_no;
        }
        return "N/A";
      },
      id: "receipt_no_combined",
      header: t("Receipt No"),
    },
    {
      accessorKey: "old_value",
      header: t("Old Value"),
      Cell: ({ cell }) => getValueDisplay(cell.getValue()),
    },
    {
      accessorKey: "new_value",
      header: t("New Value"),
      Cell: ({ cell }) => getValueDisplay(cell.getValue()),
    },
    { accessorKey: "remarks", header: t("Remarks") },
  ];
  return (
    <>
      <LoadingOverlay isLoading={isPageLoading} />
      <Container>
        <>
          <Row className="mb-3 justify-content-center">
            <Col lg={6} md={8} xs={12} className="text-center">
              <button className="jewel-price-btn">
                {t("Today Jewel Rate")} = ₹
                {(jewelPrices.jewel_price || 0).toLocaleString("en-IN")}
              </button>
            </Col>
          </Row>
          <Row className="mb-4 justify-content-center">
            <Col lg={12} md={12} xs={12} className="text-center">
              <div className="marquee-container">
                <div className="marquee-text">{t(marqueeText)}</div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3 justify-content-center">
            {[
              {
                title: t("Customer"),
                value: customerData.length,
                color: "#009688",
                icon: <MdOutlinePerson size={40} />,
              },
              {
                title: t("Jewelry Pawn"),
                value: jewelpawnData.length,
                color: "#03A9F4",
                icon: <AiFillGolden size={40} />,
              },
              {
                title: t("Jewelry Recovery"),
                value: userecoveryData.length,
                color: "#4CAF50",
                icon: <RiDeviceRecoverLine size={40} />,
              },
            ].map((stat, index) => (
              <Col key={index} lg={3} md={4} sm={6} xs={12} className="mb-3">
                {/* ❌ Removed <Link to={stat.link} style={{ textDecoration: "none" }}> */}
                <motion.div
                  whileHover={{ scale: 1.07, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 180 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      background: `linear-gradient(135deg, ${stat.color} 30%, ${stat.color}CC 90%)`,
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <CardContent>
                      <div style={{ fontSize: "2.5rem" }}>{stat.icon}</div>
                      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
                {/* ❌ Removed closing </Link> */}
              </Col>
            ))}
          </Row>
          {/* <Row>
            <Col lg="3" md="6" xs="12" className="py-3">
              <div className="counter-card cyan">
                <span>
                  <MdOutlinePerson />
                </span>
                <span className="count-numbers plus bold">
                  {customerData.length}
                </span>
                <span className="count-name regular">Customer</span>
              </div>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <div className="counter-card blue">
                <span>
                  <AiFillGolden />
                </span>
                <span className="count-numbers plus bold">
                  {jewelpawnData.length}
                </span>
                <span className="count-name regular">Jewelry Pawn</span>
              </div>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <div className="counter-card green">
                <span>
                  <RiDeviceRecoverLine />
                </span>
                <span className="count-numbers plus bold">
                  {userecoveryData.length}
                </span>
                <span className="count-name regular">Jewelry Recovery</span>
              </div>
            </Col>
          </Row> */}
          <Row className="mt-4">
            <Col lg="12">
              <h5 className="mb-3"> 📌 {t("Jewelry Pawn Details")}</h5>
              <Row className="mb-3">
                <Col lg="3" md="6" xs="12" className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder={t(
                      "Mobile number, pawn number or customer name"
                    )}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col lg="3" md="6" xs="12" className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder={t("Place")}
                    value={placeSearchTerm}
                    onChange={(e) => setPlaceSearchTerm(e.target.value)}
                  />
                </Col>
                <Col lg="3" md="6" xs="12">
                  <Button
                    variant="contained"
                    onClick={handleClear}
                    sx={{
                      backgroundColor: "#dc3545 !important",
                      color: "#fff !important",
                      "&:hover": {
                        backgroundColor: "#b02a37 !important",
                      },
                    }}
                  >
                    {t("Remove")}
                  </Button>
                </Col>
              </Row>
              <div
                className="balance-table-wrapper"
                // style={{
                // overflowX: "auto",
                // whiteSpace: "nowrap",
                // maxWidth: "100%",
                // }}
              >
                <MaterialReactTable
                  columns={columns}
                  data={filteredData}
                  enableColumnFilters={false}
                  initialState={{ density: "compact" }}
                  enableSorting={false}
                  enablePagination={true}
                  enableExpanding
                  enableExpandAll={false} // hides top-left expand-all button
                  displayColumnDefOptions={{
                    "mrt-row-expand": { header: "", size: 0 }, // removes "Expand" text
                  }}
                  muiTableBodyRowProps={({ row }) => ({
                    className: getRowClass(
                      getMonthsDifference(row.original.pawnjewelry_date)
                    ),
                  })}
                  muiTableHeadRowProps={{
                    sx: {
                      backgroundColor: "#000000",
                      color: "#fff",
                      textAlign: "center",
                    },
                  }}
                  muiTableBodyCellProps={{
                    sx: {
                      fontWeight: "bold", // Bold all body text
                      fontSize: "14px",
                      color: "#000",
                      borderBottom: "1px solid #e0e0e0",
                      paddingTop: "4px", // e.g., 4px
                      paddingBottom: "4px", // e.g., 4px
                    },
                  }}
                  muiTableHeadCellProps={{
                    sx: {
                      fontWeight: "1000", // extra bold
                      fontSize: "14px", // larger font
                      backgroundColor: "#000000", // PURE Black background
                      color: "#fff", // White text
                      textAlign: "center",
                    },
                  }}
                  renderDetailPanel={({ row }) => {
                    const item = row.original;
                    const matchingBank = bankPledgeData.find(
                      (bp) =>
                        bp.customer_no === item.customer_no &&
                        bp.receipt_no === item.receipt_no
                    );
                    if (!matchingBank) {
                      return (
                        <div
                          style={{
                            padding: 12,
                            display: "flex",
                            justifyContent: "center", // center horizontally
                            alignItems: "center", // center vertically
                            height: "100px",
                           
                            fontWeight: 500,
                            color: "#777",
                          }}
                        >
                          {t("No Bank Pledge Details")}
                        </div>
                      );
                    }
                    return (
                      <div style={{ padding: 18, maxWidth: "1700px", backgroundColor:"white" }}>
                        <h6 style={{ marginBottom: 8, }}>
                          {t("Bank Pledge Details")}
                        </h6>
                        <table className="table table-sm">
                          <thead className="table-dark">
                            <tr>
                              <th>{t("Pledge Date")}</th>
                              <th>{t("Bank Loan No")}</th>
                              <th>{t("Assessor")}</th>
                              <th>{t("Bank Name")}</th>
                              <th>{t("Pawn Value")}</th>
                              <th>{t("Interest")}</th>
                              <th>{t("Due Date")}</th>
                              <th>{t("Closing Date")}</th>
                              <th>{t("Closing Amount")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {matchingBank.bank_pledge_date
                                  ? dayjs(matchingBank.bank_pledge_date).format(
                                      "DD-MM-YYYY"
                                    )
                                  : "-"}
                              </td>
                              <td>{matchingBank.bank_loan_no || "-"}</td>
                              <td>{matchingBank.bank_assessor_name || "-"}</td>
                              <td>{matchingBank.bank_name || "-"}</td>
                              <td>
                                ₹
                                {Number(
                                  matchingBank.bank_pawn_value || 0
                                ).toLocaleString("en-IN")}
                              </td>
                              <td>{matchingBank.bank_interest || "-"}</td>
                              <td>{matchingBank.bank_due_date || "-"}</td>
                              <td>{matchingBank.closing_date || "-"}</td>
                              <td>
                                ₹
                                {Number(
                                  matchingBank.closing_amount || 0
                                ).toLocaleString("en-IN")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  }}
                />
                {/* <Table bordered hover responsive className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Loan Number</th>
                      <th>Customer Number</th>
                      <th>Customer Name</th>
                      <th>Location</th>
                      <th>Mobile Number</th>
                      <th>Principal Amount</th>
                      <th>Interest Rate</th>
                      <th>Pawned Items</th>
                      <th>Bank Pledge Details</th>
                      <th>Jewelry Weight</th>
                      <th>Net Weight</th>
                      <th>Jewelry Value (Pawned)</th>
                      <th>Interest Outstanding</th>
                      <th>Interest Paid</th>
                      <th>Total Appraisal</th>
                      <th>Status</th>
                      <th>Interest Overdue Months</th>
                      <th>Alert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => {
                        const matchingBank = bankPledgeData.find(
                          (bp) =>
                            bp.customer_no === item.customer_no &&
                            bp.receipt_no === item.receipt_no
                        );
                        const hasBankDetails =
                          matchingBank &&
                          (matchingBank.bank_assessor_name ||
                            matchingBank.bank_name ||
                            parseFloat(matchingBank.bank_pawn_value || 0) > 0 ||
                            parseFloat(matchingBank.bank_interest || 0) > 0 ||
                            matchingBank.bank_due_date ||
                            matchingBank.closing_date ||
                            parseFloat(matchingBank.closing_amount || 0) > 0);
                        const jewelList = Array.isArray(item.jewel_product)
                          ? item.jewel_product
                          : typeof item.jewel_product === "string"
                          ? JSON.parse(item.jewel_product)
                          : [];
                        const totalWeight = jewelList.reduce(
                          (sum, jewel) => sum + parseFloat(jewel.weight || 0),
                          0
                        );
                        const totalNetWeight = jewelList.reduce(
                          (sum, jewel) => sum + parseFloat(jewel.net || 0),
                          0
                        );
                        const pledgedItems = jewelList
                          .map((jewel) => jewel.JewelName)
                          .join(", ");
                        const months = getMonthsDifference(
                          item.pawnjewelry_date
                        );
                        const bgColor = getRowClass(months);
                        const alertContent = getTamilAlertMessage(
                          item.name,
                          item.receipt_no,
                          item.pawnjewelry_date,
                          months
                        );
                        return (
                          <>
                            <tr key={item.id} className={getRowClass(months)}>
                              <td>
                                {dayjs(item.pawnjewelry_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td>{item.receipt_no}</td>
                              <td>{item.customer_no}</td>
                              <td>{item.name}</td>
                              <td>{item.place}</td>
                              <td>{item.mobile_number}</td>
                              <td>{item.original_amount}</td>
                              <td>{item.interest_rate}</td>
                              <td>{pledgedItems}</td>
                              <td>
                                <Button
                                  size="sm"
                                  className={`text-${
                                    hasBankDetails ? "danger" : "primary"
                                  }`}
                                  onClick={() => toggleRow(item.id)}
                                >
                                  {expandedRow === item.id
                                    ? "Hide Details"
                                    : "View Details"}
                                </Button>
                              </td>
                              <td>{totalWeight.toFixed(2)}</td>
                              <td>{totalNetWeight.toFixed(2)}</td>
                              <td>
                                {Math.round(
                                  item.original_amount / totalNetWeight
                                )}
                              </td>
                              <td>
                                <div className="dashboard">
                                  <span>{item.interest_payment_period}</span>
                                  <span style={{ color: "green" }}>
                                    ₹{Math.round(item.interest_payment_amount)}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="dashboard">
                                  <span>
                                    {aggregatedInterestData[item.receipt_no]
                                      ?.interest_payment_periods || "N/A"}
                                  </span>
                                  <span style={{ color: "green" }}>
                                    ₹
                                    {Math.round(
                                      aggregatedInterestData[item.receipt_no]
                                        ?.total_interest_income || 0
                                    ).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </td>
                              <td>
                                ₹
                                {Math.round(
                                  parseFloat(item.original_amount || 0) +
                                    parseFloat(
                                      item.interest_payment_amount || 0
                                    )
                                ).toLocaleString("en-IN")}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <span
                                  className={`badge ${
                                    item.status === "நகை மீட்கபட்டது"
                                      ? "bg-danger"
                                      : "bg-success"
                                  }`}
                                  style={{
                                    minWidth: "20px",
                                    minHeight: "20px",
                                    display: "inline-block",
                                  }}
                                ></span>
                              </td>
                              <td>{months}</td>
                              <td>
                                {item.status !== "நகை மீட்கபட்டது" &&
                                  alertContent && (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "5px",
                                        alignItems: "center",
                                      }}
                                    >
                                      <button
                                        onClick={() => {
                                          const url = generateWhatsAppURL(
                                            item.mobile_number,
                                            alertContent
                                          );
                                          window.open(url, "_blank");
                                        }}
                                        className="whatsapp-btn"
                                      >
                                        WhatsApp
                                      </button>
                                      <a
                                        href={`sms:${
                                          item.mobile_number
                                        }?body=${encodeURIComponent(
                                          alertContent
                                        )}`}
                                        style={{
                                          backgroundColor: "#007BFF",
                                          color: "#fff",
                                          padding: "5px",
                                          borderRadius: "5px",
                                          textDecoration: "none",
                                          display: "inline-block",
                                        }}
                                      >
                                        SMS
                                      </a>
                                    </div>
                                  )}
                              </td>
                            </tr>
                            {expandedRow === item.id && (
                              <tr>
                                <td
                                  colSpan="19"
                                  style={{ backgroundColor: "#f8f9fa" }}
                                >
                                  <div style={{ padding: "10px" }}>
                                    <Table bordered hover size="sm">
                                      <thead className="table-dark">
                                        <tr>
                                          <th>Bank Pledge Date</th>
                                          <th>Bank Loan No</th>
                                          <th>Bank Assessor Name</th>
                                          <th>Bank Name</th>
                                          <th>Bank Pawn Value</th>
                                          <th>Bank Interest</th>
                                          <th>Bank Due Date</th>
                                          <th>Closing Date</th>
                                          <th>Closing Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_pledge_date,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_loan_no
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_assessor_name
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_name
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_pawn_value,
                                              false,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_interest,
                                              false,
                                              false,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_due_date,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.closing_date,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.closing_amount,
                                              false,
                                              true
                                            )}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </Table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="19" className="text-center">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table> */}
              </div>
              <Row className="mt-5">
                <Col lg="12">
                  <h5 className="mb-3">📌 {t("Notice Alert Summary")}</h5>
                  <Row className="mb-3">
                    <Col lg="3" md="6" xs="12" className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder={t(
                          "Search by Loan Number, Customer Name, or Mobile Number"
                        )}
                        value={noticeSearchTerm}
                        onChange={(e) => setNoticeSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col lg="3" md="6" xs="12">
                      <Button
                        variant="contained"
                        onClick={handleNoticeClear}
                        sx={{
                          backgroundColor: "#dc3545 !important",
                          color: "#fff !important",
                          "&:hover": {
                            backgroundColor: "#b02a37 !important",
                          },
                        }}
                      >
                        {t("Remove")}
                      </Button>
                    </Col>
                  </Row>
                  <div
                    className="notice-table-wrapper shadow-sm rounded border p-3"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <MaterialReactTable
                      columns={noticeColumns}
                      data={handleNoticeSearch()}
                      enablePagination={true}
                      enableSorting={true}
                      enableColumnFilters={false}
                      muiTableHeadCellProps={{
                        sx: {
                          fontWeight: "bold",
                          fontSize: "14px",
                          textAlign: "center",
                          backgroundColor: "#212529", // Dark background
                          color: "#fff", // White text
                        },
                      }}
                      muiTableBodyCellProps={{
                        sx: {
                          fontWeight: "bold",
                          fontSize: "13px",
                        },
                      }}
                      muiTableContainerProps={{
                        sx: {
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          backgroundColor: "#ffffff", // <-- FORCE WHITE HERE TOO
                        },
                      }}
                      renderEmptyRowsFallback={() => (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#777",
                          }}
                        >
                          {t("No notice alerts found at this time")}.
                        </div>
                      )}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col lg="12">
                  <h5 className="mb-3">📌 {t("Action Alert Summary")}</h5>
                  <Row className="mb-3">
                    <Col lg="3" md="6" xs="12" className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder={t(
                          "Search by Loan Number, Customer Name, or Mobile Number"
                        )}
                        value={actionSearchTerm}
                        onChange={(e) => setActionSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col lg="3" md="6" xs="12">
                      <Button
                        variant="contained"
                        onClick={handleActionClear}
                        sx={{
                          backgroundColor: "#dc3545 !important",
                          color: "#fff !important",
                          "&:hover": {
                            backgroundColor: "#b02a37 !important",
                          },
                        }}
                      >
                        {t("Remove")}
                      </Button>
                    </Col>
                  </Row>
                  <div className="notice-table-wrapper shadow-sm rounded border p-3">
                    <MaterialReactTable
                      columns={actionColumns}
                      data={handleActionSearch()}
                      enablePagination={true}
                      enableSorting={true}
                      enableColumnFilters={false}
                      muiTableHeadCellProps={{
                        sx: {
                          fontWeight: "bold",
                          fontSize: "14px",
                          textAlign: "center",
                          backgroundColor: "#212529",
                          color: "#fff",
                        },
                      }}
                      muiTableBodyCellProps={{
                        sx: {
                          fontWeight: "bold",
                          fontSize: "13px",
                          //textAlign: "center",
                        },
                      }}
                      muiTableContainerProps={{
                        sx: {
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        },
                      }}
                      renderEmptyRowsFallback={() => (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#777",
                          }}
                        >
                          {t("No notice alerts found at this time")}.
                        </div>
                      )}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col lg="12">
                  <h5 className="mb-3">📌 {t("Customer History")}</h5>
                  <Row className="mb-3">
                    <Col lg={2} className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder={t("Customer Number")}
                        value={selectedCustomerNo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedCustomerNo(val);
                          if (val) {
                            fetchCustomerHistory(val);
                          } else {
                            setCustomerHistory([]);
                          }
                        }}
                      />
                    </Col>
                    <Col lg={2} className="mb-2">
                      <Form.Control
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                          setFromDate(e.target.value);
                        }}
                      />
                    </Col>
                    <Col lg={2} className="mb-2">
                      <Form.Control
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                          setToDate(e.target.value);
                        }}
                      />
                    </Col>
                    <Col
                      lg={4}
                      className="mb-2 d-flex align-items-center gap-2"
                    >
                      <Button
                        variant="contained"
                        onClick={() =>
                          selectedCustomerNo &&
                          fetchCustomerHistory(selectedCustomerNo)
                        }
                        sx={{
                          backgroundColor: "#041a3f !important",
                          color: "#fff !important",
                          "&:hover": {
                            backgroundColor: "#3074e9ff !important",
                          },
                        }}
                      >
                        {t("Search")}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleHistoryClear}
                        sx={{
                          backgroundColor: "#dc3545 !important",
                          color: "#fff !important",
                          "&:hover": { backgroundColor: "#b02a37 !important" },
                        }}
                      >
                        {t("Remove")}
                      </Button>
                    </Col>
                    {/* <Col lg={2} className="mb-2">
                    <Button
                    variant="contained"
                    onClick={() =>
                          selectedCustomerNo &&
                          fetchCustomerHistory(selectedCustomerNo)
                        }
                    sx={{
                      backgroundColor: "#041a3f !important",
                      color: "#fff !important",
                      "&:hover": {
                        backgroundColor: "#3074e9ff !important",
                      },
                    }}
                  >
                    Search
                  </Button>
                  </Col>
                    <Col lg={2} className="mb-2">
                      <Button
                        variant="contained"
                        onClick={handleHistoryClear}
                        sx={{
                          backgroundColor: "#dc3545 !important",
                          color: "#fff !important",
                          "&:hover": {
                            backgroundColor: "#b02a37 !important",
                          },
                        }}
                      >
                        Clear
                      </Button>
                    </Col> */}
                  </Row>
                  <div className="notice-table-wrapper shadow-sm rounded border p-3">
                    <MaterialReactTable
                      columns={historyColumns}
                      data={customerHistory}
                      enablePagination={true}
                      enableSorting={true}
                      enableColumnFilters={false}
                      muiTableHeadCellProps={{
                        sx: {
                          fontWeight: "bold",
                          fontSize: "14px",
                          textAlign: "center",
                          backgroundColor: "#212529",
                          color: "#fff",
                        },
                      }}
                      muiTableBodyCellProps={{
                        sx: {
                          fontWeight: "bold",
                          fontSize: "13px",
                          //textAlign: "center",
                        },
                      }}
                      muiTableContainerProps={{
                        sx: {
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        },
                      }}
                      renderEmptyRowsFallback={() => (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#777",
                          }}
                        >
                          {t("No notice alerts found at this time")}.
                        </div>
                      )}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      </Container>
    </>
  );
};
export default DashBoard;

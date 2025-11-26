import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Container,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import EmailIcon from "@mui/icons-material/Email";
import InfoIcon from "@mui/icons-material/Info";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import API_DOMAIN from "../config/config";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dashboardCountData = [
  {
    title: "CUSTOMERS",
    value: "0",
    icon: <PlaylistAddCheckIcon sx={{ fontSize: 50, opacity: 0.4 }} />,
    color: "#E91E63",
    key: "customer_count",
  },
  {
    title: "OVER DUE AMOUNT",
    value: "0",
    icon: <InfoIcon sx={{ fontSize: 50, opacity: 0.4 }} />,
    color: "#00BCD4",
    key: "overdue_count",
  },
  {
    title: "CURRENT DUE AMOUNTS",
    value: "0",
    icon: <EmailIcon sx={{ fontSize: 50, opacity: 0.4 }} />,
    color: "#8BC34A",
    key: "current_due_count",
  },
  {
    title: "PAID COUNT",
    value: "0",
    icon: <PersonAddIcon sx={{ fontSize: 50, opacity: 0.4 }} />,
    color: "#FF9800",
    key: "paid_count",
  },
];

//STATIC DATA
const monthlyData = [
  { name: "Jul", Collected: 4000, Paid: 2400 },
  { name: "Aug", Collected: 3000, Paid: 1398 },
  { name: "Sep", Collected: 2000, Paid: 5800 },
  { name: "Oct", Collected: 2780, Paid: 3908 },
  { name: "Nov", Collected: 5890, Paid: 4800 },
  { name: "Dec", Collected: 6390, Paid: 3800 },
];

const pieChartData = [
  { name: "Savings", value: 400 },
  { name: "Diwali", value: 300 },
  { name: "Furniture", value: 300 },
  { name: "Kulukkal", value: 200 },
];
const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const transactionData = [
  {
    id: 1,
    customer: "Madhu",
    plan: "Savings Chit",
    date: "20-Nov-2025",
    amount: "₹5,000",
    status: "Paid",
    color: "success",
  },
  {
    id: 2,
    customer: "Thanu",
    plan: "Diwali Chit",
    date: "21-Nov-2025",
    amount: "₹2,500",
    status: "Pending",
    color: "warning",
  },
  {
    id: 3,
    customer: "Mariya",
    plan: "Furniture Chit",
    date: "21-Nov-2025",
    amount: "₹10,000",
    status: "Paid",
    color: "success",
  },
  {
    id: 4,
    customer: "Siva",
    plan: "Kulukkal Chit",
    date: "19-Nov-2025",
    amount: "₹1,000",
    status: "Overdue",
    color: "error",
  },
  {
    id: 5,
    customer: "Rajesh",
    plan: "Savings Chit",
    date: "18-Nov-2025",
    amount: "₹5,000",
    status: "Paid",
    color: "success",
  },
];

const targetData = [
  { label: "Savings Chit Goal", value: 85, color: "#00BCD4" },
  { label: "Diwali Collection", value: 45, color: "#E91E63" },
  { label: "Furniture Plan", value: 62, color: "#8BC34A" },
  { label: "Pending Clearance", value: 28, color: "#FF9800" },
];

// --- 2. HELPER TO GENERATE DAILY DATA ---
const generateDailyData = (month) => {
  const days = [];
  // Generate 31 days of random "jaggery" data to look like the reference image
  for (let i = 1; i <= 31; i++) {
    days.push({
      name: `2025-${month === "Jul" ? "07" : month === "Aug" ? "08" : "12"}-${
        i < 10 ? "0" + i : i
      }`, // Format YYYY-MM-DD
      Collected: Math.floor(Math.random() * 3000) + 1000,
      Paid: Math.floor(Math.random() * 2000) + 500,
    });
  }
  return days;
};

// --- 3. COMPONENTS ---
const StatWidget = ({ item }) => (
  <Card
    sx={{
      height: "100%",
      bgcolor: item.color,
      color: "#fff",
      borderRadius: 1,
      boxShadow: 3,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -10,
          right: -10,
          transform: "rotate(15deg)",
        }}
      >
        {item.icon}
      </Box>
      <Box sx={{ zIndex: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", opacity: 0.9 }}
        >
          {item.title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
          {item.value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// --- 4. MAIN DASHBOARD ---
const DashBoard = () => {
  const currentFullYear = new Date().getFullYear().toString();
  const [dynamicCountData, setDynamicCountData] = useState(dashboardCountData);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("monthly");
  const [chartData, setChartData] = useState([]);
  const [barGraphLoading, setBarGraphLoading] = useState(false);
  const [selectedMonthKey, setSelectedMonthKey] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentFullYear);
const [chartTitle, setChartTitle] = useState('Monthly Payment Summary');
  const user = JSON.parse(localStorage.getItem("user")) || {};

  //FETCH COUNT
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/chit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dashboard: "" }),
      });

      const responseData = await response.json();
      console.log("Dashboard API Response:", responseData);

      if (responseData.head.code === 200 && responseData.data) {
        const apiData = responseData.data;
        const updatedWidgets = dashboardCountData.map((item) => ({
          ...item,
          value:
            apiData[item.key] !== undefined
              ? String(apiData[item.key])
              : item.value,
        }));

        setDynamicCountData(updatedWidgets);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarGraphData = async (year) => {
    setBarGraphLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/chit.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // ⭐ CORRECT PAYLOAD with dynamic year
        body: JSON.stringify({
          get_monthly_data: true,
          year: year,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bar graph data");
      }

      const result = await response.json();

      if (result.head.code === 200) {
        // Data from the API is now dynamic and covers the selected year
        setChartData(result.data);
      } else {
        console.error("API Error:", result.head.msg);
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching bar graph data:", error);
      setChartData([]);
    } finally {
      setBarGraphLoading(false);
    }
  };

  // Function to fetch daily data for a specific month
  const fetchDailyData = async (monthKey, monthName) => {
    setBarGraphLoading(true);
    setChartTitle(`Daily Paid/UnPaid for ${monthName} ${selectedYear}`);
    setView("daily");

    try {
      const response = await fetch(`${API_DOMAIN}/chit.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          get_daily_data: true,
          month: monthKey,
        }),
      });
      const result = await response.json();

      if (result.head.code === 200) {
        setChartData(result.data || []);
      } else {
        console.error("Daily API Error:", result.head.msg);
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching daily data:", error);
      setChartData([]);
    } finally {
      setBarGraphLoading(false);
    }
  };

  useEffect(() => {
    fetchBarGraphData(selectedYear);
  }, [selectedYear]); //

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle click on Bar
  const handleBarClick = (data, index) => {
    const monthKey = data.month_key; 
    const monthName = data.name; 
    setSelectedMonthKey(monthKey);
    fetchDailyData(monthKey, monthName);
  };

  const handleBackClick = async () => {
  // 1. Change the view state back to monthly
  setView('monthly');
  
  // 2. Change the chart header title
  setChartTitle('Monthly Payment Summary'); 
  
  // 3. ⭐ Call the API to fetch the monthly data for the currently selected year
  //    (This assumes 'selectedYear' state is in scope)
  await fetchBarGraphData(selectedYear);
};

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#e9e9e9", py: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "#555",
            textTransform: "uppercase",
          }}
        >
          Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dynamicCountData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatWidget item={item} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* LEFT CHART: SWITCHES BETWEEN BAR (Monthly) AND AREA (Daily) */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: 400, boxShadow: 3, borderRadius: 1, p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                {/* --- HEADER BLOCK --- */}
                <Box>
                  <Typography variant="h6">{chartTitle}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {view === "monthly"
                      ? "Click a bar to view daily graph"
                      : "Visualizing daily fluctuations"}
                  </Typography>
                </Box>

                {/* --- ACTION BUTTON/SELECTOR --- */}
                {view === "daily" ? (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackClick}
                    sx={{ textTransform: "none" }}
                  >
                    Back to Months
                  </Button>
                ) : (
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {/* Generates current year and previous 4 years */}
                    {[...Array(5).keys()].map((i) => {
                      const year = (new Date().getFullYear() - i).toString();
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                )}
              </Box>

              {/* --- CHART CONTENT --- */}
              {barGraphLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80%",
                  }}
                >
                  <Typography variant="h6">
                    {view === "monthly"
                      ? "Loading Monthly Data..."
                      : "Loading Daily Data..."}
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="85%">
                  {view === "monthly" ? (
                    // 1. MONTHLY VIEW (BAR CHART) - (No Change needed here)
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip cursor={{ fill: "transparent" }} />
                      <Legend />
                      <Bar
                        dataKey="Paid"
                        fill="#4CAF50"
                        name="Paid Amount"
                        barSize={30}
                        onClick={handleBarClick}
                        style={{ cursor: "pointer" }}
                      />
                      <Bar
                        dataKey="UnPaid"
                        fill="#F44336"
                        name="UnPaid Amount"
                        barSize={30}
                        onClick={handleBarClick}
                        style={{ cursor: "pointer" }}
                      />
                    </BarChart>
                  ) : (
                    // 2. DAILY VIEW (AREA CHART) - 🎯 CORRECTED BLOCK
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      {/* Gradient Definition for the Paid area */}
                      <defs>
                        <linearGradient
                          id="colorPaid"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4CAF50"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4CAF50"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        {/* ⭐ ADDED: Gradient Definition for the UnPaid area */}
                        <linearGradient
                          id="colorUnPaid"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#F44336"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#F44336"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" vertical={false} />

                      {/* ⭐ FIX: dataKey must be "day" for the daily graph */}
                      <XAxis
                        dataKey="day"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 10 }}
                        interval={6}
                      />

                      <YAxis />
                      <Tooltip />

                      {/* Paid Area Series */}
                      <Area
                        type="monotone"
                        dataKey="Paid"
                        stroke="#4CAF50"
                        fillOpacity={1}
                        fill="url(#colorPaid)"
                        strokeWidth={2}
                        name="Paid Amount" // Name for the tooltip and legend
                      />

                      {/* ⭐ ADDED: UnPaid Area Series */}
                      <Area
                        type="monotone"
                        dataKey="UnPaid"
                        stroke="#F44336"
                        fillOpacity={1}
                        fill="url(#colorUnPaid)"
                        strokeWidth={2}
                        name="UnPaid Amount" // Name for the tooltip and legend
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              )}
              {/* --- END CHART CONTENT --- */}
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: 400, boxShadow: 3, borderRadius: 1, p: 2 }}>
              <CardHeader
                title="Chit Distribution"
                subheader="Active Customers by Plan"
              />
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>

        {/* BOTTOM SECTION (Table & Progress) - Kept same as before */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ boxShadow: 3, borderRadius: 1 }}>
              <CardHeader
                title="Recent Transactions"
                subheader="Latest payments received"
                sx={{ borderBottom: "1px solid #eee" }}
              />
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Plan</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactionData.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.id}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {row.customer}
                        </TableCell>
                        <TableCell>{row.plan}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell sx={{ color: "green" }}>
                          {row.amount}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={row.color}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 1 }}>
              <CardHeader
                title="Monthly Targets"
                subheader="Collection progress"
                sx={{ borderBottom: "1px solid #eee" }}
              />
              <CardContent>
                {targetData.map((item, index) => (
                  <Box key={index} sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="body2" color={item.color}>
                        {item.value}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: "#f0f0f0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: item.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashBoard;

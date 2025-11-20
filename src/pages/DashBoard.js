import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Divider
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WarningIcon from '@mui/icons-material/Warning';

// --- 1. STATIC DATA ---

// Row 1: Key Metrics (Blinking)
const row1Data = [
  { 
    title: "Total Due", 
    value: "12", 
    icon: <WarningIcon sx={{ fontSize: 40 }}/>, 
    color: "#d32f2f" // Red
  },
  { 
    title: "Customer", 
    value: "88", 
    icon: <PeopleIcon sx={{ fontSize: 40 }}/>, 
    color: "#1976d2" // Blue
  },
  { 
    title: "Amount", 
    value: "88,888", 
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }}/>, 
    color: "#2e7d32" // Green
  },
];

// Row 2: High Value Schemes (From Photo 1)
const row2Data = [
  {
    title: "₹2000 Monthly Scheme",
    saving: "₹2000.00",
    bonus: "₹18000 + ₹2000",
    duration: "9 Months",
    schemeNo: "SC2511016",
    gradient: "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)"
  },
  {
    title: "₹1000 Monthly Scheme",
    saving: "₹1000.00",
    bonus: "₹9000 + ₹1000",
    duration: "9 Months",
    schemeNo: "SC2511015",
    gradient: "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)"
  },
  {
    title: "₹500 Monthly Scheme",
    saving: "₹500.00",
    bonus: "₹4500 + ₹500",
    duration: "9 Months",
    schemeNo: "SC2511014",
    gradient: "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)"
  }
];

// Row 3: Lower Value Schemes (From Photo 2)
const row3Data = [
  {
    title: "₹300 Monthly Scheme",
    saving: "₹300.00",
    bonus: "₹2700 + ₹300",
    duration: "9 Months",
    schemeNo: "SC2511013",
    gradient: "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)"
  },
  {
    title: "₹100 Weekly Scheme",
    saving: "₹100.00",
    bonus: "₹4500 + ₹500",
    duration: "45 Weeks",
    schemeNo: "SC2511012",
    gradient: "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)"
  },
];

// --- 2. COMPONENTS ---

// Component for Row 1 (Blinking Cards)
const BlinkingCard = ({ title, value, icon, color }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        p: 2,
        color: 'white',
        backgroundColor: color,
        animation: 'blink 2s infinite', // CSS Animation
        '@keyframes blink': {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.02)', boxShadow: `0 0 15px ${color}` },
          '100%': { opacity: 1, transform: 'scale(1)' },
        }
      }}
    >
      <Box sx={{ mr: 2, opacity: 0.8 }}>{icon}</Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', opacity: 0.9 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
    </Card>
  );
};

// Component for Rows 2 & 3 (Scheme Cards - mimicking the screenshot)
const SchemeCard = ({ data }) => {
  const textColor = data.isSummary ? '#333' : '#1a237e'; // Dark blue text for schemes
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        borderRadius: 4,
        background: data.gradient,
        color: textColor,
        boxShadow: 3,
        transition: '0.3s',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        {/* Header */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: textColor }}>
          {data.title}
        </Typography>

        <Divider sx={{ mb: 2, opacity: 0.2, borderColor: '#000' }} />

        {/* 3 Column Details */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {/* Column 1: Saving */}
          <Grid item xs={4} sx={{ borderRight: '1px solid rgba(0,0,0,0.1)' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <SavingsIcon fontSize="small" sx={{ mb: 0.5 }}/>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Saving</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{data.saving}</Typography>
            </Box>
          </Grid>

          {/* Column 2: Bonus */}
          <Grid item xs={4} sx={{ borderRight: '1px solid rgba(0,0,0,0.1)' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <CardGiftcardIcon fontSize="small" sx={{ mb: 0.5 }}/>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Bonus</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{data.bonus}</Typography>
            </Box>
          </Grid>

          {/* Column 3: Duration */}
          <Grid item xs={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <AccessTimeIcon fontSize="small" sx={{ mb: 0.5 }}/>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Duration</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{data.duration}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Footer */}
        <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
          Scheme No: {data.schemeNo}
        </Typography>

      </CardContent>
    </Card>
  );
};

// --- 3. MAIN DASHBOARD ---
const DashBoard = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', py: 4 }}>
      <Container maxWidth="lg">
        
        {/* PAGE HEADER */}
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#37474f', textAlign: 'center' }}>
          Dashboard Overview
        </Typography>

        {/* <Typography variant="h6" sx={{ mb: 2, color: '#555', ml: 1 }}>Current Status</Typography> */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {row1Data.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <BlinkingCard 
                title={item.title} 
                value={item.value} 
                icon={item.icon} 
                color={item.color} 
              />
            </Grid>
          ))}
        </Grid>

       
        {/* <Typography variant="h6" sx={{ mb: 2, color: '#555', ml: 1 }}>Available Schemes (Standard)</Typography> */}
        {/* <Grid container spacing={3} sx={{ mb: 5 }}>
          {row2Data.map((scheme, index) => (
            <Grid item xs={12} md={4} key={index}>
              <SchemeCard data={scheme} />
            </Grid>
          ))}
        </Grid> */}

        {/* --- ROW 3: OTHER SCHEMES (Photo 2 Data) --- */}
        {/* <Typography variant="h6" sx={{ mb: 2, color: '#555', ml: 1 }}>Available Schemes (Micro & Weekly)</Typography> */}
        {/* <Grid container spacing={3}>
          {row3Data.map((scheme, index) => (
            <Grid item xs={12} md={4} key={index}>
              <SchemeCard data={scheme} />
            </Grid>
          ))}
        </Grid> */}

      </Container>
    </Box>
  );
};

export default DashBoard;
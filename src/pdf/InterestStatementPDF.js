import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import fontRegular from "./fonts/NotoSansTamil-Regular.ttf";
import fontBold from "./fonts/NotoSansTamil-Bold.ttf";

// ✅ Register Tamil fonts
Font.register({
  family: "NotoSansTamil",
  src: fontRegular,
});

Font.register({
  family: "NotoSansTamil-Bold",
  src: fontBold,
  fontWeight: "bold",
});

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 10,
    fontFamily: "NotoSansTamil",
    lineHeight: 1.3,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "NotoSansTamil-Bold",
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: "NotoSansTamil-Bold",
    fontSize: 11,
    marginBottom: 6,
  },
  section: {
    marginBottom: 18,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  cell: {
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 6,
    flex: 1,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    fontFamily: "NotoSansTamil-Bold",
  },
  headerCell: {
    flex: 1,
    padding: 6,
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  headerLastCell: {
    borderRightWidth: 0,
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
});

const InterestStatementPDF = ({ data }) => {
  const { statement, customer } = data;
  const {
    principal,
    base_rate,
    recovery_period,
    total_interest,
    paid_interest,
    total_due,
    unpaid_interest,
    breakdown = [],
    total_months,
    unpaid_months,
    paid_months,
    total_days,
    paid_days,
    unpaid_days,
  } = statement;

  const formatDateForPDF = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const customerFields = [
    { label: "ரசீது எண் ", value: customer.receipt_no || "N/A" },
    { label: "வாடிக்கையாளர் பெயர் ", value: customer.name || "N/A" },
    { label: "மொபைல் எண் ", value: customer.mobile_number || "N/A" },
    { label: "முகவரி ", value: customer.customer_details || "N/A" },
    { label: "இடம் ", value: customer.place || "N/A" },
    { label: "கடன் தேதி ", value: formatDateForPDF(customer.pawnjewelry_date) },
    { label: "அசல் தொகை ", value: `${principal?.toLocaleString() || 0}` },
    { label: "அடிப்படை விகிதம் (%)", value: base_rate || "N/A" },
    { label: "மீட்பு காலம்", value: recovery_period || "N/A" },
    {
      label: "மொத்த வட்டி ",
      value: `${total_interest?.toLocaleString() || 0}`,
    },
    {
      label: "செலுத்தப்பட்ட வட்டி ",
      value: `${paid_interest?.toLocaleString() || 0}`,
    },
    {
      label: "நிலுவையில் உள்ள வட்டி ",
      value: `${unpaid_interest?.toLocaleString() || 0}`,
    },
    {
      label: "மொத்த மாதங்கள் ",
      value: `${total_months?.toLocaleString() || 0}`,
    },
    {
      label: "செலுத்தப்பட்ட மாதங்கள் ",
      value: `${paid_months?.toLocaleString() || 0}`,
    },
    {
      label: "நிலுவையுள்ள மாதங்கள் ",
      value: `${unpaid_months?.toLocaleString() || 0}`,
    },
    { label: "மொத்த நாட்கள்  ", value: `${total_days?.toLocaleString() || 0}` },
    {
      label: "செலுத்தப்பட்ட நாட்கள்  ",
      value: `${paid_days?.toLocaleString() || 0}`,
    },
    {
      label: "நிலுவையுள்ள நாட்கள்  ",
      value: `${unpaid_days?.toLocaleString() || 0}`,
    },
    {
      label: "மொத்தம் திருப்ப வேண்டிய தொகை  ",
      value: `${total_due?.toLocaleString() || 0}`,
    },
  ];

  const renderTableHeader = () => (
    <View style={styles.headerRow}>
      <View style={[styles.headerCell, { flex: 0.5 }]}>
        <Text style={styles.textCenter}>எண்</Text>
      </View>
      <View style={[styles.headerCell, { flex: 1.5 }]}>
        <Text style={styles.textCenter}>தேதி</Text>
      </View>
      <View style={[styles.headerCell, { flex: 1 }]}>
        <Text style={styles.textCenter}>காலம்</Text>
      </View>
      <View style={[styles.headerCell, { flex: 0.7 }]}>
        <Text style={styles.textCenter}>வட்டி மதிப்பு</Text>
      </View>
      <View style={[styles.headerCell, { flex: 1 }]}>
        <Text style={styles.textCenter}>வட்டி தொகை </Text>
      </View>
      <View style={[styles.headerCell, { flex: 1 }]}>
        <Text style={styles.textCenter}>வட்டி வரவு</Text>
      </View>
      <View style={[styles.headerCell, { flex: 1 }]}>
        <Text style={styles.textCenter}>வட்டி இருப்பு</Text>
      </View>
      <View style={[styles.headerCell, { flex: 1.8 }, styles.headerLastCell]}>
        <Text style={styles.textCenter}>Paid</Text>
      </View>
    </View>
  );

  const renderRows = (rows, startIndex = 0) =>
    rows.map((item, idx) => (
      <View key={idx} style={styles.row}>
        <View style={[styles.cell, { flex: 0.5 }]}>
          <Text style={styles.textCenter}>{startIndex + idx + 1}</Text>
        </View>
        <View style={[styles.cell, { flex: 1.5 }]}>
          <Text>{item.from_to || item.paid_date || ""}</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.textCenter}>{item.period || ""}</Text>
        </View>
        <View style={[styles.cell, { flex: 0.7 }]}>
          <Text style={styles.textCenter}>{item.rate || ""}</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.textCenter}>
            {(item.interest || 0).toLocaleString()}
          </Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.textCenter}>
            {(item.paid_amount || 0).toLocaleString()}
          </Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.textCenter}>
            {(item.total || 0).toLocaleString()}
          </Text>
        </View>
        <View style={[styles.cell, { flex: 1.8 }, styles.lastCell]}>
          <Text style={styles.textCenter}>
            {item.paid ? "செலுத்தப்பட்டது " : "நிலுவை "}
          </Text>
        </View>
      </View>
    ));

  // Split data: first 4 for page 1, then 18 per page
  const firstPageRows = breakdown.slice(0, 4);
  const remainingRows = breakdown.slice(4);
  const otherPages = [];
  for (let i = 0; i < remainingRows.length; i += 18) {
    otherPages.push(remainingRows.slice(i, i + 18));
  }

  return (
    <Document>
      {/* 🟢 First Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>அடகு அறிக்கை சுருக்கம்</Text>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            வாடிக்கையாளர்கள் மற்றும் அடகு விவரங்கள்
          </Text>
          <View style={styles.table}>
            {customerFields.map((field, idx) => (
              <View
                key={idx}
                style={[
                  styles.row,
                  idx === customerFields.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.cell, { flex: 1 }]}>
                  <Text>{field.label}</Text>
                </View>
                <View style={[styles.cell, { flex: 1.5 }, styles.lastCell]}>
                  <Text>{field.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* First 4 Table Rows */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>பரிவர்த்தனை சுருக்கம்</Text>
          <View style={styles.table}>
            {renderTableHeader()}
            {renderRows(firstPageRows, 0)}
          </View>
        </View>
      </Page>

      {/* 🟡 Other Pages (18 rows each) */}
      {otherPages.map((chunk, pageIndex) => (
        <Page key={pageIndex + 1} size="A4" style={styles.page}>
          <View style={styles.table}>
            {renderTableHeader()}
            {renderRows(chunk, 4 + pageIndex * 18)}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default InterestStatementPDF;

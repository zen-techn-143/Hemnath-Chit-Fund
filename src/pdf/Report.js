import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import fontBold from "./fonts/NotoSansTamil-Bold.ttf";
import fontRegular from "./fonts/NotoSansTamil-Regular.ttf";

// Font Registration
Font.register({
  family: "fontBold",
  fonts: [{ src: fontBold, fontStyle: "normal", fontWeight: "bold" }],
});
Font.register({
  family: "fontRegular",
  fonts: [{ src: fontRegular, fontStyle: "normal", fontWeight: "normal" }],
});

// Stylesheet
const styles = StyleSheet.create({
  page: {
    flexDirection: "landscape",
    padding: 10,
    backgroundColor: "#fff",
  },
  heading: {
    fontFamily: "fontBold",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  headerCell: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 5,
    fontSize: 10,
  },
  bodyCell: {
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 5,
    fontSize: 10,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  // Column widths
  col1: { width: "10%" },
  col2: { width: "20%" },
  col3: { width: "10%" },
  col4: { width: "10%" },
  col5: { width: "10%" },
  col6: { width: "15%" },
  col7: { width: "5%" },
  col8: { width: "5%" },
  col9: { width: "10%" },
  col10: { width: "15%" },
});

// Date Formatter
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Report Component
const Report = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Heading */}
      <Text style={styles.heading}>Old Record Details</Text>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.headerCell, styles.col1]}>Date</Text>
          <Text style={[styles.headerCell, styles.col2]}>Customer Details</Text>
          <Text style={[styles.headerCell, styles.col3]}>Receipt No.</Text>
          <Text style={[styles.headerCell, styles.col4]}>Pawn Amount</Text>
          <Text style={[styles.headerCell, styles.col5]}>Interest</Text>
          <Text style={[styles.headerCell, styles.col6]}>Product Details</Text>
          <Text style={[styles.headerCell, styles.col7]}>Count</Text>
          <Text style={[styles.headerCell, styles.col8]}>Weight</Text>
          <Text style={[styles.headerCell, styles.col9]}>Total Amount</Text>
          <Text style={[styles.headerCell, styles.col10, styles.lastCell]}>
            Recovery Date
          </Text>
        </View>

        {/* Table Body */}
        {data.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.bodyCell, styles.col1]}>
              {formatDate(item.oldrecord_date)}
            </Text>
            <Text style={[styles.bodyCell, styles.col2]}>
              {item.customer_details}
            </Text>
            <Text style={[styles.bodyCell, styles.col3]}>{item.bill_no}</Text>
            <Text style={[styles.bodyCell, styles.col4]}>
              {item.pawn_amount}
            </Text>
            <Text style={[styles.bodyCell, styles.col5]}>
              {item.interest_amount}
            </Text>
            <Text style={[styles.bodyCell, styles.col6]}>
              {item.jewel_details}
            </Text>
            <Text style={[styles.bodyCell, styles.col7]}>{item.count}</Text>
            <Text style={[styles.bodyCell, styles.col8]}>{item.weight}</Text>
            <Text style={[styles.bodyCell, styles.col9]}>{item.amount}</Text>
            <Text style={[styles.bodyCell, styles.col10, styles.lastCell]}>
              {formatDate(item.recovery_date)}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default Report;

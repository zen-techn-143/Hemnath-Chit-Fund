import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export const generatePDF = (data) => {
  const doc = new jsPDF();
  doc.text("Expense Report", 14, 20);

  const tableData = data.map((item) => [
    item.date,
    item.category_name,
    item.description,
    item.amount,
  ]);

  doc.autoTable({
    head: [["Date", "Category", "Description", "Amount"]],
    body: tableData,
    startY: 30,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save("expense_report.pdf");
};

export const generateExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Expense Report");
  XLSX.writeFile(wb, "expense_report.xlsx");
};

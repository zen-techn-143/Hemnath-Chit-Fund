import React, { useEffect } from 'react';
import JewelPawnPdf from "../pdf/JewelPawnPdf"
import './print.css';

const PrintViewComponent = ({ type, rowData, handleCancelNavigation }) => {
  useEffect(() => {
    if (type === 'pdfview') {
      window.print();
      const handleAfterPrint = () => {
        handleCancelNavigation();
        window.removeEventListener('afterprint', handleAfterPrint);
      };
      window.addEventListener('afterprint', handleAfterPrint);
    }
  }, [type, handleCancelNavigation]);

  if (type === 'pdfview') {
    return <div className="print-page"><JewelPawnPdf data={rowData} /></div>;
  }

  return null;
};

export default PrintViewComponent;

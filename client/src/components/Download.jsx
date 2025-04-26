import React from 'react';
import { Button } from 'flowbite-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Download = ({ refs }) => {
  const handleDownloadPdf = async () => {
    const elements = refs.current; // Get the references from parent
    console.log(elements)
    if (!elements || elements.length === 0) {
      return;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const canvas = await html2canvas(element, { scale: 10 });
      const imgData = canvas.toDataURL('image/png');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) {
        pdf.addPage(); // Add a new page if it's not the first one
      }
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save('datasheet.pdf'); // Save the generated PDF
  };

  return (
    <Button onClick={handleDownloadPdf} className="bg-blue-500 text-white">
      Download PDF
    </Button>
  );
};

export default Download;

import React from 'react';
import { Button } from 'flowbite-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function SubmittedPins() {

  const printRefs = React.useRef([]); // Array to store refs

  // Function to add new ref to the array
  const addToRefs = (el) => {
    if (el && !printRefs.current.includes(el)) {
      printRefs.current.push(el);
    }
  };

  const handDownloadPdf = async () => {
    const elements = printRefs.current;
    if (!elements.length) {
      return;
    }

    // Initialize jsPDF instance
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const canvas = await html2canvas(element, {
        scale: 10,
      });
      const data = canvas.toDataURL("image/png");

      // Get image properties and calculate size
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      // Add image to pdf, if it's not the first one, add a new page
      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    // Save the PDF
    pdf.save("example.pdf");
  }

  return (
    <div>
      <div ref={addToRefs}>
        <h3>Download Your File</h3>
      </div>
      <div ref={addToRefs}>
        <p>This is another content block.</p>
      </div>
      <div ref={addToRefs}>
        <p>This is a third content block.</p>
      </div>
      
      <Button onClick={handDownloadPdf}>
        Download File
      </Button>

      <div className="text-sm">
        Hello there
      </div>
    </div>
  );
}

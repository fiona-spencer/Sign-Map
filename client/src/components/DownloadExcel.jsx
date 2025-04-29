import React from 'react';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { HiDocumentDownload } from 'react-icons/hi';
import * as XLSX from 'xlsx';
import { BsFileEarmarkXFill } from 'react-icons/bs';

export default function DownloadExcel() {
  const { filteredPins } = useSelector((state) => state.global);

  const handleDownload = () => {
    if (!filteredPins || filteredPins.length === 0) return;

    // Convert pins into a flat format for Excel
    const flattenedData = filteredPins.map((pin, index) => ({
      Index: index + 1,
      Address: pin.location?.address || '',
      Latitude: pin.location?.lat || '',
      Longitude: pin.location?.lng || '',
      Status: pin.location?.status || '',
      Description: pin.location?.info?.description || '',
      Icon: pin.location?.info?.icon || '',
      Image: pin.location?.info?.image || '',
      PopulusID: pin.location?.info?.populusId || '',
      ContactName: pin.location?.info?.contactName || '',
      ContactEmail: pin.location?.info?.contactEmail || '',
      ContactPhoneNumber: pin.location?.info?.contactPhoneNumber || '',
      Assigned: pin.location?.info?.assigned || '',
      FileName: pin.location?.info?.fileName || '',
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FilteredPins');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Filtered_Pins.xlsx');
  };

  return (
    <div className="p-4">
      <Button
        className="flex items-center gap-2 bg-blue-500"
        color="dark"
        pill
        onClick={handleDownload}
        disabled={!filteredPins || filteredPins.length === 0}
      >
        Download Filtered Pins to Excel
        <BsFileEarmarkXFill className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
}

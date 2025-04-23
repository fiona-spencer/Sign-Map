import { FileInput, Label } from 'flowbite-react';
import { useState } from 'react';
import Papa from 'papaparse'; // CSV parser
import * as XLSX from 'xlsx'; // Excel parser

export default function FileUploadComponent() {
  const [fileName, setFileName] = useState('');
  const [fileReportData, setFileReportData] = useState(null);
  const [error, setError] = useState('');

  // Helper function to get file type based on file name
  const getFileType = (fileName) => {
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.csv')) return 'csv';
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) return 'excel';
    return null;
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      try {
        if (type === 'json') {
          const data = JSON.parse(content);
          setFileReportData(data);
        } else if (type === 'csv') {
          // Use PapaParse to parse the CSV file
          Papa.parse(content, {
            complete: (result) => {
              setFileReportData(result.data);
            },
            header: true, // Treat the first row as headers
            skipEmptyLines: true,
          });
        } else if (type === 'excel') {
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Header as row 1
          setFileReportData(jsonData);
        }
        setError('');
      } catch (err) {
        setError('Invalid file format. Please upload a valid JSON, CSV, or Excel file.');
        setFileReportData(null);
      }
    };

    if (type === 'excel') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const fileType = getFileType(file?.name);
    if (fileType) handleFileUpload({ target: { files: [file] } }, fileType); // Trigger file processing based on dropped file
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex-col w-full items-center justify-center sm:px-4 md:px-32 lg:px-48">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Preview a File (JSON, CSV, or Excel Files)</h2>
      <Label
        htmlFor="dropzone-file"
        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center p-6">
          <svg
            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JSON, CSV, Excel files (MAX. 10MB)
          </p>
        </div>
        <FileInput
          id="dropzone-file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            const fileType = getFileType(file?.name);
            if (fileType) handleFileUpload(e, fileType); // Trigger file processing based on clicked file
          }}
        />
      </Label>

      {/* Display the uploaded data (for preview) */}
      {fileReportData && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-white pb-2">Selected File: {fileName}</h3>
          {fileName.endsWith('.json') && (
            <pre className="bg-[#dad8d8ed] dark:bg-[#a9a7a74b] p-4 rounded text-xs overflow-x-auto">
              {JSON.stringify(fileReportData, null, 2)}
            </pre>
          )}
          {fileName.endsWith('.csv') && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border-collapse border text-sm border-gray-300 dark:border-gray-600">
                <thead className="bg-gray-200 dark:bg-gray-800">
                  <tr>
                    {Object.keys(fileReportData[0] || {}).map((key) => (
                      <th key={key} className="border px-2 py-1 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fileReportData.slice(0, 10).map((row, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-700 dark:even:bg-gray-600">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border px-2 py-1">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs mt-2 text-gray-600">Showing first 10 rows</p>
            </div>
          )}
          {fileName.endsWith('.xlsx') && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border-collapse border text-sm border-gray-300 dark:border-gray-600">
                <thead className="bg-gray-200 dark:bg-gray-800">
                  <tr>
                    {fileReportData[0]?.map((key, idx) => (
                      <th key={idx} className="border px-2 py-1 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fileReportData.slice(1, 11).map((row, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-700 dark:even:bg-gray-600">
                      {row.map((val, j) => (
                        <td key={j} className="border px-2 py-1">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs mt-2 text-gray-600">Showing first 10 rows</p>
            </div>
          )}
        </div>
      )}

      {/* Display any error message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

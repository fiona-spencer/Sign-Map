import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const CsvUpload = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [rows, setRows] = useState([]);
  const [parsedPins, setParsedPins] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileMeta, setFileMeta] = useState({
    fileName: "N/A",
    image: "N/A",
    createdBy: currentUser?.username || "Unknown",
    status: "Pending",
  });

  

  const csvString = `Populus ID,First Name,Last Name,Civic Address,St Num,St Name,City (Civic Address),Province (Civic Address),Postal Code (Civic Address),City (Mailing Address),Province (Mailing Address),Postal Code (Mailing Address),Preferred Phone Number,Preferred Email
2707146,Joanna,Kovats,3rd Fl-41 1st Ave,3rd Fl-41,1st Ave,Toronto,ON,M4M1W7,Toronto,ON,M4M1W7,416-992-3233,joakov_2011@yahoo.ca
16266509,Anne,Wordsworth,76,1st Ave ,76 1st Av,ON,M4M1W8,76 1st Ave,ON,M4M1W8,647-208-7883,anwords@hotmail.com,
16268444,Minh Phi,Duong,79 1st Ave,79,1st Ave ,Toronto,ON,M4M1W9,Toronto,ON,M4M1W9,416-462-0683,
16267668,Lesley,Ballantyne-Smith,181,1st Ave ,181 1st Av,ON,M4M1X3,181 1st Ave,ON,M4M1X3,416-778-9534,ballantyne-smith@sympatico.ca,
16267883,Susan,Murray,212 1st Ave,212,1st Ave ,Toronto,ON,M4M1X4,Toronto,ON,M4M1X4,437-775-1513,tamcairn@yahoo.ca
22740983,Chloe,Brushwood-Rose,243,45293 Booth Ave,243 1/2 Av Booth,ON,M4M2M7,243 1/2 Booth Ave,ON,M4M2M7,647-393-6593,brushwoodrose@gmail.com,
  ... (add more rows if desired)`;
  

  const navigate = useNavigate();

  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMessage("");
    setError("");

    setFileMeta({
      fileName: file.name,
      image: "N/A",
      createdBy: currentUser?.username || "Unknown",
      status: "Pending",
    });

    const reader = new FileReader();
    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      try {
        if (!Array.isArray(data)) {
          throw new Error("Invalid file: not a table.");
        }

        const chunks = chunkArray(data, 100);
        let invalidRows = 0;

        const formattedChunks = await Promise.all(
          chunks.map(async (chunk) =>
            Promise.all(
              chunk.map(async (row) => {
                try {
                  let firstName = row["First Name"] ? row["First Name"].trim() : null;
                  let lastName = row["Last Name"] ? row["Last Name"].trim() : null;
            
                  // Set default value for missing first or last name
                  if (!firstName && !lastName) {
                    firstName = "Missing Name (first)";
                    lastName = "Missing Name (last)";
                  } else if (!firstName) {
                    firstName = `${lastName} (last)`;
                    lastName = "";
                  } else if (!lastName) {
                    lastName = `${firstName} (first)`;
                    firstName = "";
                  }
            
                  const fullName = `${firstName} ${lastName}`.trim();
            
                  let streetNumber = row["St Num"] != null ? String(row["St Num"]).trim() : "";
                  let streetName = row["St Name"] ? row["St Name"].trim() : "";
                  let city = row["City (Civic Address)"] ? row["City (Civic Address)"].trim() : "";
                  let province = row["Province (Civic Address)"] ? row["Province (Civic Address)"].trim() : "";
                  let postalCode = row["Postal Code (Civic Address)"] ? row["Postal Code (Civic Address)"].trim() : "";
            
                  streetName = streetName.replace(/\s*,\s*/g, ", ");
                  city = city.replace(/\s*,\s*/g, ", ");
                  province = province.replace(/\s*,\s*/g, ", ");
                  postalCode = postalCode.replace(/\s*,\s*/g, ", ");
            
                  if (streetNumber === "1st" && streetName.includes("Ave")) {
                    streetNumber = "First";
                  }
            
                  const hyphenOrSpaceMatch = streetNumber.match(/^([A-Za-z-]+-\d+)(?:[\s-])?(\d+)$/);
                  let aptNum = null;
                  if (hyphenOrSpaceMatch) {
                    const prefix = hyphenOrSpaceMatch[1]; // This will be something like "B-25"
                    const streetNumberPart = hyphenOrSpaceMatch[2]; // This will be the street number, like "9"
            
                    if (prefix) {
                      aptNum = prefix; // Assign the unit number
                    }
                    streetNumber = streetNumberPart; // Assign the street number
                  }
            
                  let address = `${streetNumber} ${streetName}, ${city}, ${province} ${postalCode}, Canada`;
                  address = address.replace(/\s*,\s*/g, ", ").trim();
            
                  const email = row["Preferred Email"] || "N/A";
                  const phone = row["Preferred Phone Number"] || "N/A";
            
                  const lat = 0;
                  const lng = 0;
            
                  if (aptNum) {
                    address = `${aptNum} (apt) ${streetNumber} (st.) ${streetName}, ${city}, ${province} ${postalCode}, Canada`;
                  }
            
                  return {
                    createdBy: {
                      userName: currentUser?.username || "Unknown",
                      email: currentUser?.email || "unknown@example.com",
                    },
                    location: {
                      address,
                      lat,
                      lng,
                      info: {
                        description: "Description here",
                        icon: "default",
                        image: "placeholder.jpg",
                        populusId: row["Populus ID"] || "",
                        contactName: fullName,
                        contactEmail: email,
                        contactPhoneNumber: phone,
                        assigned: "assigned person",
                        fileName: file.name,
                      },
                      status: "pending",
                    },
                  };
                } catch (err) {
                  console.error("Row processing error:", err);
                  invalidRows++;
                  return null;
                }
              })
            )
          )
        );

        const allResults = formattedChunks.flat().filter(Boolean);

        if (allResults.length === 0) {
          throw new Error("No valid rows found in file.");
        }

        setRows(allResults);
        setParsedPins(allResults);
        setStatusMessage(
          `File uploaded successfully! ${invalidRows > 0 ? `${invalidRows} rows skipped due to errors or missing fields.` : ""}`
        );
        setIsValid(true);
      } catch (err) {
        console.error("Upload error:", err);
        setStatusMessage(err.message);
        setError(err.message);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const renderCellContent = (value) => {
    if (!value || value === "N/A") {
      return <span className="text-red-500">N/A</span>;
    }
    return value;
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Example CSV Format</h2>
<div className="relative">
  <label htmlFor="csv-copy-text" className="sr-only">CSV Example</label>
  <textarea
    id="csv-copy-text"
    value={csvString}
    readOnly
    rows={10}
    className="col-span-6 bg-gray-50 border border-gray-300 text-xs font-mono rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-6 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
  <button
    onClick={async () => {
      try {
        await navigator.clipboard.writeText(csvString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy CSV:", err);
      }
    }}
    className="absolute top-2 right-2 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-3 inline-flex items-center justify-center bg-white border-gray-200 border h-8"
  >
    {!copied ? (
      <span className="text-xs font-semibold">Copy</span>
    ) : (
      <span className="text-xs font-semibold text-blue-700 dark:text-blue-500">Copied</span>
    )}
  </button>
</div>


      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white mt-6">
    Upload CSV File
      </h2>

      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-2"
        />
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>File Name:</strong> {fileMeta.fileName}
          </p>
          <p>
            <strong>Created By:</strong> {fileMeta.createdBy}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date().toLocaleDateString("en-US")}
          </p>
          <p>
            <strong>Status:</strong> {fileMeta.status}
          </p>
        </div>
      </div>

      {statusMessage && (
        <Alert
          color={isValid ? "success" : "failure"}
          className="mb-4"
          icon={HiInformationCircle}
        >
          <span>{statusMessage}</span>
        </Alert>
      )}

      {isValid && rows.length > 0 && (
        <Alert color="warning" className="mb-4" icon={HiInformationCircle}>
          <span>
            {rows.length} valid entr{rows.length === 1 ? "y" : "ies"} found in
            the file.
          </span>
        </Alert>
      )}

      {rows.length > 0 && (
        <>
          <div
            className={`max-h-[500px] overflow-y-auto border rounded-md ${
              isLoading ? "blur-sm opacity-50 pointer-events-none" : ""
            }`}
          >
            <table className="w-full border-collapse border border-gray-300 text-xs mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Populus ID</th>
                  <th className="border p-2">Full Name</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border p-2">
                      {renderCellContent(row.location?.info?.populusId)}
                    </td>
                    <td className="border p-2">
                      {renderCellContent(row.location?.info?.contactName)}
                    </td>
                    <td className="border p-2">
                      {renderCellContent(row.location?.address)}
                    </td>
                    <td className="border p-2">
                      {renderCellContent(row.location?.info?.contactPhoneNumber)}
                    </td>
                    <td className="border p-2">
                      {renderCellContent(row.location?.info?.contactEmail)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {parsedPins.length > 0 && isValid && !error && (
            <CreatePinsFromFile
              parsedPins={parsedPins}
              fileTitle={fileMeta.fileName}
              currentUser={currentUser}
              setIsLoading={setIsLoading}
              onSuccess={() => navigate(`/successfullyCreated`)}
              onError={(msg) => setError(msg)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CsvUpload;


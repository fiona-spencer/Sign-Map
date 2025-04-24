import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { fetchLatLng } from "../../../api/utils/geocoding";
import CreatePinsFromFile from "./CreatePinsFromFile";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ExcelUpload = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [rows, setRows] = useState([]);
  const [parsedPins, setParsedPins] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileMeta, setFileMeta] = useState({
    fileName: "N/A",
    image: "N/A",
    createdBy: currentUser?.username || "Unknown",
    status: "Pending",
  });

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
                  if (!row["First Name"] || !row["Last Name"] || !row["St Num"] || !row["St Name"]) {
                    invalidRows++;
                    return null;
                  }


                  // REGEX
                  // REGEX
// REGEX
// Strip and clean each section
const fullName = `${row["First Name"]} ${row["Last Name"]}`.trim();

let streetNumber = row["St Num"] != null ? String(row["St Num"]).trim() : "";
let streetName = row["St Name"] ? row["St Name"].trim() : "";
let city = row["City (Civic Address)"] ? row["City (Civic Address)"].trim() : "";
let province = row["Province (Civic Address)"] ? row["Province (Civic Address)"].trim() : "";
let postalCode = row["Postal Code (Civic Address)"] ? row["Postal Code (Civic Address)"].trim() : "";

// Apply regex to clean spaces and format commas
streetName = streetName.replace(/\s*,\s*/g, ", "); // Clean commas
city = city.replace(/\s*,\s*/g, ", ");
province = province.replace(/\s*,\s*/g, ", ");
postalCode = postalCode.replace(/\s*,\s*/g, ", ");

// Check if streetNumber is "1st" and the streetName includes "Ave", then change it to "First"
if (streetNumber === "1st" && streetName.includes("Ave")) {
  streetNumber = "First";
}

// Handle unit numbers, e.g., "83 1" or "135-275"
const unitNumberMatch = streetNumber.match(/^(\d+)[\s-](\d+)$/);  // Match both space and hyphen
let unitNumber = null;
if (unitNumberMatch) {
  // The unit number is the first part before the space or hyphen (e.g., 83 in "83 1" or 135 in "135-275")
  unitNumber = unitNumberMatch[1]; 
  // Use the second part for geocoding (e.g., 1 in "83 1" or 275 in "135-275")
  streetNumber = unitNumberMatch[2]; 
  // Add the unit number back to the street name after geocoding
  streetName = `${unitNumber} ${streetName}`;
}

// Handle cases where streetNum has multiple parts (e.g., "1-49", "CED-6-100")
let aptNum = null;  // For unit/apartment number
const hyphenOrSpaceMatch = streetNumber.match(/^(.+?)(?:[\s-])?(\d+)$/); // Match the last part of the street number
if (hyphenOrSpaceMatch) {
  const prefix = hyphenOrSpaceMatch[1]; // The part before the last number (e.g., "CED-6" in "CED-6-100")
  const streetNumberPart = hyphenOrSpaceMatch[2]; // The last number (e.g., "100" in "CED-6-100")

  if (prefix) {
    aptNum = prefix; // Save the prefix as the apartment/unit number (e.g., "CED-6")
  }
  streetNumber = streetNumberPart; // Update street number with the last part (e.g., "100")
}

// Rebuild the address (without unit number for geocoding)
let address = `${streetNumber} ${streetName}, ${city}, ${province} ${postalCode}, Canada`;

// Trim and clean the address (remove extra spaces)
address = address.replace(/\s*,\s*/g, ", ").trim();

// Output for debugging
console.log("Formatted address for geocoding:", address);

// Prepare email and phone
const email = row["Preferred Email"] || "N/A";
const phone = row["Preferred Phone Number"] || "N/A";

// Geocoding
const { lat, lng } = await fetchLatLng(address);

// After geocoding, reattach the unit number to the address if it exists
if (aptNum) {
  address = `${aptNum}-${streetNumber} ${streetName.replace(aptNum, "")}, ${city}, ${province} ${postalCode}, Canada`;
  console.log("Reconstructed address with apt number:", address);
}




                  

                  return {
                    createdBy: {
                      userName: currentUser?.username || "Unknown",
                      userEmail: currentUser?.email || "unknown@example.com",
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
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Excel File (.xlsx)</h2>

      <div className="mb-4">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-2" />
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p><strong>File Name:</strong> {fileMeta.fileName}</p>
          <p><strong>Created By:</strong> {fileMeta.createdBy}</p>
          <p><strong>Created At:</strong> {new Date().toLocaleDateString("en-US")}</p>
          <p><strong>Status:</strong> {fileMeta.status}</p>
        </div>
      </div>

      {statusMessage && (
  <Alert color={isValid ? "success" : "failure"} className="mb-4" icon={HiInformationCircle}>
    <span>{statusMessage}</span>
  </Alert>
)}

{isValid && rows.length > 0 && (
  <Alert color="warning" className="mb-4" icon={HiInformationCircle}>
    <span>{rows.length} valid entr{rows.length === 1 ? "y" : "ies"} found in the file.</span>
  </Alert>
)}


      {rows.length > 0 && (
        <>
<div
  className={`max-h-[500px] overflow-y-auto border rounded-md ${isLoading ? "blur-sm opacity-50 pointer-events-none" : ""}`}
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
                    <td className="border p-2">{renderCellContent(row.location?.info?.populusId)}</td>
                    <td className="border p-2">{renderCellContent(row.location?.info?.contactName)}</td>
                    <td className="border p-2">{renderCellContent(row.location?.address)}</td>
                    <td className="border p-2">{renderCellContent(row.location?.info?.contactPhoneNumber)}</td>
                    <td className="border p-2">{renderCellContent(row.location?.info?.contactEmail)}</td>
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

export default ExcelUpload;

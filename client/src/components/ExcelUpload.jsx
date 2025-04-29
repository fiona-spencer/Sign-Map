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
            
                  const { lat, lng } = await fetchLatLng(address);
            
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

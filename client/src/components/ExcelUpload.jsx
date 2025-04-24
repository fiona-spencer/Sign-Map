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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        if (
          !Array.isArray(data) ||
          !data.every(
            (item) =>
              item["First Name"] &&
              item["Last Name"] &&
              item["St Num"] &&
              item["St Name"]
          )
        ) {
          throw new Error("Invalid format.");
        }

        const formatted = await Promise.all(
          data.map(async (row) => {
            const fullName = `${row["First Name"] ?? ""} ${row["Last Name"] ?? ""}`.trim();
            let address = `${row["St Num"] ?? ""} ${row["St Name"] ?? ""}, ${row["City (Civic Address)"] ?? ""}, ${row["Province (Civic Address)"] ?? ""} ${row["Postal Code (Civic Address)"] ?? ""}, Canada`;

            // Assign N/A for email and phone if not present
            const email = row["Preferred Email"] || "N/A";
            const phone = row["Preferred Phone Number"] || "N/A";

            const { lat, lng } = await fetchLatLng(address);

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
          })
        );

        setRows(formatted);
        setParsedPins(formatted);
        setStatusMessage("File uploaded successfully!");
        setIsValid(true);
      } catch (error) {
        setStatusMessage(error.message);
        setIsValid(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const renderCellContent = (value) => {
    if (!value || value === "N/A") {
      return (
        <span className="text-red-500">N/A</span>
      );
    }
    return value;
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Excel File (.xlsx)</h2>

      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-2"
        />
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p><strong>File Name:</strong> {fileMeta.fileName}</p>
          <p><strong>Created By:</strong> {fileMeta.createdBy}</p>
          <p><strong>Created At:</strong> {new Date().toLocaleDateString("en-US")}</p>
          <p><strong>Status:</strong> {fileMeta.status}</p>
        </div>
      </div>

      {statusMessage && (
        <Alert color={isValid ? "success" : "danger"} className="mb-4" icon={HiInformationCircle}>
          <span>{statusMessage}</span>
        </Alert>
      )}

      {rows.length > 0 && (
        <>
          <div className={`${isLoading ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
            <table className="w-full border-collapse border border-gray-300 text-sm mt-4">
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

export default ExcelUpload;

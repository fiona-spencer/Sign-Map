import { Card } from "flowbite-react";

export function ReportDetailsCard({ selectedReport }) {
  if (!selectedReport) return null;

  const descriptionHTML = selectedReport?.location?.info?.description || "";

  // Convert HTML to plain text using DOMParser
  const getPlainTextFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const plainTextDescription = getPlainTextFromHTML(descriptionHTML);

  return (
    <Card className="max-w-full mx-auto">
      {/* Title and Status */}
      <div className="flex justify-between items-start  ">
        <div>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {selectedReport?.location?.info?.title || "No Title"}
          </h5>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">
            Status: {selectedReport?.location?.status || "Unknown"}
          </p>
        </div>

        {/* User Info - Positioned at the top right */}
        <div className="text-right">
          <p className="font-semibold text-gray-900 dark:text-white">
            {selectedReport?.createdBy?.username || "N/A"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedReport?.createdBy?.userType || "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 border-t border-gray-300 bg-white dark:bg-gray-800 dark:text-white space-y-4">
        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description:</label>
          <textarea
            readOnly
            value={plainTextDescription || "No description available"}
            className="w-full h-32 p-2 text-sm bg-black-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded resize-none"
          />
        </div>

        {/* Location Address */}
        <p><strong>Location:</strong> {selectedReport?.location?.address || "No address available"}</p>

        {/* Date of Incident */}
        <p><strong>Date Created:</strong> {new Date(selectedReport?.createdAt).toLocaleDateString()}</p>

        {/* Phone Number */}
        {selectedReport?.phoneNumber && (
          <p><strong>Phone Number:</strong> {selectedReport?.phoneNumber}</p>
        )}
      </div>
    </Card>
  );
}

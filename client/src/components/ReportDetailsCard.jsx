import { Card } from "flowbite-react";

// Status-to-color mapping
const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-200 text-yellow-700';
    case 'accepted': return 'bg-blue-100 text-blue-700';
    case 'in-progress': return 'bg-orange-100 text-orange-700';
    case 'resolved': return 'bg-green-100 text-green-700';
    case 'deleted': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export function ReportDetailsCard({ selectedReport }) {
  if (!selectedReport) return null;

  const descriptionHTML = selectedReport?.location?.info?.description || "";

  // Convert HTML to plain text
  const getPlainTextFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const plainTextDescription = getPlainTextFromHTML(descriptionHTML);

  // Extract status
  const status = selectedReport?.location?.status || "Unknown";
  const statusClass = getStatusClass(status);

  return (
    <Card className="max-w-full mx-auto">
      {/* Title and Status */}
      <div className="flex justify-between items-start">
        <div>
          {/* Contact Info */}
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Contact Information:
          </h5>
          <p className="text-sm font-semibold text-gray-600 dark:text-blue-300">
            <strong>Name:</strong> {selectedReport?.location?.info?.contactName || "N/A"}
          </p>
          <p className="text-sm font-semibold text-gray-600 dark:text-blue-300">
            <strong>Email:</strong> {selectedReport?.location?.info?.contactEmail || "N/A"}
          </p>
          <p className="text-sm font-semibold text-gray-600 dark:text-blue-300">
            <strong>Phone:</strong> {selectedReport?.location?.info?.contactPhoneNumber || "N/A"}
          </p>

          {/* Status */}
          <div className={`inline-block mt-2 px-2 py-1 rounded text-sm font-semibold ${statusClass}`}>
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>

        {/* User Info */}
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

        {/* Optional Phone Number */}
        {selectedReport?.phoneNumber && (
          <p><strong>Phone Number:</strong> {selectedReport?.phoneNumber}</p>
        )}
      </div>
    </Card>
  );
}

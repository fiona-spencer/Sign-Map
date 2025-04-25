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
    <Card className="max-w-xl mx-auto h-[auto] shadow-lg space-y-4">
      {/* Title and Status */}
      <div className="flex justify-between items-start space-x-4">
        <div className="flex-1">
          <p className="text-md font-semibold text-gray-800 dark:text-blue-300">
            <strong>Name:</strong> {selectedReport?.location?.info?.contactName || "N/A"}
          </p>
          <p className="text-md font-semibold text-gray-800 dark:text-blue-300">
            <strong>Email:</strong> {selectedReport?.location?.info?.contactEmail || "N/A"}
          </p>
          <p className="text-md font-semibold text-gray-800 dark:text-blue-300">
            <strong>Phone:</strong> {selectedReport?.location?.info?.contactPhoneNumber || "N/A"}
          </p>

         
        </div>

        {/* User Info */}
        <div className="text-right flex-2">
          <p className="text-[10px] font-bold text-gray-500 dark:text-white">
            {selectedReport?.createdBy?.username || "N/A"}
          </p>
          <p className="text-[10px] text-gray-600 dark:text-gray-400">
            {selectedReport?.createdBy?.userType || "N/A"}
          </p>
        </div>
      </div>
 {/* Status */}
 <div className={`inline-block w-full px-2 py-1 rounded text-sm font-semibold ${statusClass}`}>
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
      <div className=" p-2 border-t border-gray-300 bg-white dark:bg-gray-800 dark:text-white space-y-3">
        {/* Location and Date Created in horizontal layout */}
        <div className="flex justify-between space-x-2">
            <div className="inline ">
             <p className="text-md text-red-700"><strong>Location:</strong></p>
          <p className="text-md"> {selectedReport?.location?.address || "No address available"}</p>
            </div>
            <div className="inline ">
          <p className="text-md"><strong>Date Created:</strong> </p>
          <p>{new Date(selectedReport?.createdAt).toLocaleDateString()}</p>
            </div>
        </div>

        {/* Optional Phone Number */}
        {selectedReport?.phoneNumber && (
          <p className="text-sm"><strong>Phone Number:</strong> {selectedReport?.phoneNumber}</p>
        )}
      </div>
    </Card>
  );
}

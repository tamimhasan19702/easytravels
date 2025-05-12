/** @format */

import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Mail, Phone, DollarSign, FileText, Clock } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Link } from "react-router-dom";

const BidComponent = ({ bid }) => {
  const { user } = useUser();

  if (!bid) return <p className="text-gray-500">No bid to display.</p>;

  const {
    agencyId,
    agencyName,
    amount,
    attachments,
    coverLetter,
    email,
    number,
    status,
    submittedAt,
  } = bid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-full mx-auto mt-6 border border-gray-100">
      <h2 className="text-2xl font-semibold text-primary mb-4">
        {agencyName || "Unnamed Agency"}
      </h2>

      <div className="space-y-2 text-gray-700 text-sm">
        <p className="flex items-center gap-2">
          <Mail size={16} /> {email || "No email provided"}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={16} /> {number || "No phone provided"}
        </p>
        <p className="flex items-center gap-2">
          <DollarSign size={16} /> ${amount?.toFixed(2) || "0.00"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="capitalize">{status || "pending"}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} />
          <span>
            {submittedAt
              ? new Date(submittedAt).toLocaleString()
              : "Unknown Time"}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-[30px] font-medium text-gray-800 mb-1 py-5">
          📝 Cover Letter
        </h3>
        <div className="p-4 bg-gray-50 border rounded text-sm text-gray-700 whitespace-pre-wrap">
          {coverLetter?.trim()
            ? coverLetter
            : "No cover letter was provided by the bidder."}
        </div>
      </div>

      {attachments && attachments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-800 mb-1 flex items-center gap-2">
            <FileText size={16} /> Uploaded Files
          </h3>
          <ul className="list-disc list-inside text-blue-600 text-sm space-y-1">
            {attachments.map((url, idx) => (
              <li key={idx}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline">
                  File {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        {user && user.role === "Traveler" && (
          <Link
            to={{
              pathname: `/user-message/${agencyId}`,
              state: { agencyId, agencyName, email },
            }}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg">
            Offer Now
          </Link>
        )}
      </div>
    </motion.div>
  );
};

BidComponent.propTypes = {
  bid: PropTypes.shape({
    agencyId: PropTypes.string,
    agencyName: PropTypes.string,
    amount: PropTypes.number,
    attachments: PropTypes.arrayOf(PropTypes.string),
    coverLetter: PropTypes.string,
    email: PropTypes.string,
    number: PropTypes.string,
    status: PropTypes.string,
    submittedAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
  }),
};

export default BidComponent;

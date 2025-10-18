"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { sendCustomEmail } from "../_actions/orderActions";
import { Mail } from "lucide-react";

export default function SendEmailModal({
  customerId,
  customerName,
}: {
  customerId: string;
  customerName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!subject || !message) {
      toast.error("Subject and message cannot be empty.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await sendCustomEmail(customerId, subject, message);
      toast.success(result.message);
      setIsOpen(false); // Modal band kar do
      setSubject(""); // Fields khali kar do
      setMessage("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send email.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* The Button to open the modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
      >
        <Mail size={16} />
        Send Custom Email
      </button>

      {/* The Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold">Send Email to {customerName}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isLoading}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

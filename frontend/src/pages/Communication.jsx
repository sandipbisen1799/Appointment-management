import React, { useEffect, useState } from "react";
import {
  getApproveAppointmentsApi,
  sendAllEmailApi,
} from "../services/admin.service";
import { toast } from "react-toastify";
import Table from "../components/Table";
import { Mail, Send } from "lucide-react";

function Communication() {
  const [appointments, setAppointments] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await getApproveAppointmentsApi();
      if (res?.appointments) {
        setAppointments(res.appointments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(appointments.map((apt) => apt._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSendBulkEmail = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one appointment");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      const selectedAppointments = appointments.filter((apt) =>
        selectedRows.includes(apt._id)
      );
      const emails = selectedAppointments.map((apt) => apt.email);

      const res = await sendAllEmailApi({ emails, message, subject });
      if (res.success) {
        toast.success(res.message || "Emails sent successfully");
        setMessage("");
        setSubject("");
        setSelectedRows([]);
      } else {
        toast.error(res.message || "Failed to send emails");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending emails");
    } finally {
      setIsSending(false);
    }
  };

  const allSelected = appointments.length > 0 && appointments.every(apt => selectedRows.includes(apt._id));
  const isIndeterminate = selectedRows.length > 0 && !allSelected;

  const columns = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={allSelected}
          ref={input => { if (input) input.indeterminate = isIndeterminate; }}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4 cursor-pointer accent-[#705CC7]"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row._id)}
          onChange={() => handleSelectRow(row._id)}
          className="w-4 h-4 cursor-pointer accent-[#705CC7]"
        />
      ),
    },
    {
      key: "index",
      label: "Index",
      render: (_, index) => index,
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "service.serviceName",
      label: "service Name",
    },
    {
      key: "email",
      label: "email",
    },
    {
      key: "date",
      label: "day",
    },
    {
      key: "isBooked",
      label: "booked",
      render: (row) =>
        row?.isBooked ? (
          <h1 className="text-green-400">booked</h1>
        ) : (
          <h1 className=" text-red-400">not booked</h1>
        ),
    },
    {
      key: "slot.time",
      label: "time",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 px-3 py-7">
        {/* Email Section */}
      

        <Table
          data={appointments}
          columns={columns}
        />
          <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="text-[#705CC7]" />
            <h2 className="text-lg font-semibold text-gray-700">
              Send  Email
            </h2>
           
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#705CC7]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#705CC7] resize-none"
              rows={3}
            />
            <div className="flex items-end">
              <button
                onClick={handleSendBulkEmail}
                disabled={isSending || selectedRows.length === 0 || !subject.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                  isSending || selectedRows.length === 0 || !subject.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#705CC7] hover:bg-[#5a4ba8]"
                }`}
              >
                <Send size={18} />
                {isSending ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>

          {selectedRows.length > 0 && (
            <div className="mt-3 text-sm text-gray-500">
              Email will be sent to:{" "}
              {appointments
                .filter((apt) => selectedRows.includes(apt._id))
                .map((apt) => apt.email)
                .join(", ")}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Communication;

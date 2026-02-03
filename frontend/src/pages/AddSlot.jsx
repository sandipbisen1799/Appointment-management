import { CircleX } from "lucide-react";
import React from "react";
import {
  createSlotApi,
  deleteSlotApi,
  getSlotApi,
  updateSlotApi,
} from "../services/admin.service";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

function AddSlot() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [slots, setslots] = useState([]);

  // For manual create form per day
  

  // For per-slot editing state
  const [editingSlots, setEditingSlots] = useState({
    startTime: "",
    endTime: "",
  });
  // id of the slot currently being edited (shows inline inputs)
  const [editingSlotId, setEditingSlotId] = useState(null);

  // normalize different stored time formats into `HH:MM` for <input type="time">
  const normalizeTime = (t) => {
    if (t === null || t === undefined) return "";
    const str = String(t).trim();
    if (!str) return "";
    // already in HH:MM
    if (/^\d{1,2}:\d{2}$/.test(str)) {
      const parts = str.split(":");
      return `${parts[0].padStart(2, "0")}:${parts[1]}`;
    }
    // numeric hour like "9" or 9
    if (/^\d+$/.test(str)) {
      const hh = String(Number(str) % 24).padStart(2, "0");
      return `${hh}:00`;
    }
    // formats like "9 AM" or "9:30 PM"
    const m = str.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (m) {
      let hour = parseInt(m[1], 10);
      const minute = m[2] || "00";
      const ampm = m[3].toUpperCase();
      if (ampm === "PM" && hour !== 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
    return "";
  };

  const fetchslot = async () => {
    try {
      const res = await getSlotApi();
      console.log(res);
      setslots(res.slots);

      // initialize editingSlots for controls (normalized to HH:MM)
      const init = {};
      (res.slots || []).forEach((s) => {
        init[s._id] = {
          startTime: normalizeTime(s.startTime),
          endTime: normalizeTime(s.endTime),
        };
      });
      setEditingSlots(init);
    } catch (error) {
      console.log(error);
    }
  };

  function handleChange(e) {
    const { value, checked } = e.target;
    setSelectedDays((prev) =>
      checked ? [...prev, value] : prev.filter((d) => d !== value),
    );
  }

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const handleSlot = async (day) => {
   try {
     const formdata = { day };
 
     const res = await createSlotApi(formdata);
     console.log(res);
     if (res) {
       fetchslot();
       toast.success(res.message || "slot created");
   } }
   catch (error) {
     toast.error(error?.response?.data?.message || "Error creating slot");
   }
    
  };
  const handleDeleteSlot = async (slot) => {
    try {
      console.log(slot._id);
      const id = slot._id;
      const res = await deleteSlotApi(id);
      if (res) {
        fetchslot();
        toast.error(res.message || "slot deleted succesfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "error while deleting the slot",
      );
    }
  };

  const handleUpdateSlot = async (slot) => {
    try {
      const edits = editingSlots[slot._id] || {
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
      if (!edits.startTime || !edits.endTime) {
        toast.error("Start and end time are required");
        return;
      }
      const res = await updateSlotApi(slot._id, edits);
      if (res) {
        fetchslot();
        setEditingSlotId(null);
        toast.success(res.message || "slot updated");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating slot");
    }
  };

  useEffect(() => {
    fetchslot();
  }, []);
  return (
    <div className="flex flex-col bg-gray-50 items-center p-4 gap-3">
      <h1 className=" text-2xl  font-semibold">Add Slot </h1>
      {days.map((day, index) => (
        <div key={index} className="w-full flex flex-col   px-4  bg-white">
          <div className="w-full flex p-2 justify-between px-2">
            <label className="flex gap-2">
              <input
                type="checkbox"
                value={day}
                checked={selectedDays.includes(day)}
                onChange={handleChange}
              />
              {day}
            </label>

            {selectedDays.includes(day) && (
              <>
                <button
                  className="px-4 py-1 bg-green-500 text-white rounded-lg"
                  onClick={() => handleSlot(day)}
                >
                  Add Slot
                </button>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2 w-full  p-2">
            {selectedDays.includes(day) &&
              slots
                .filter((slot) => slot.date === day)
                .map((slot, index) => (
                  <div
                    key={slot._id || index}
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg relative"
                    onClick={() => setEditingSlotId(slot._id)}
                  >
                    {editingSlotId === slot._id ? (
                      <>
                        <input
                          type="time"
                          value={editingSlots?.[slot._id]?.startTime || ""}
                          onChange={(e) =>
                            setEditingSlots((prev) => ({
                              ...prev,
                              [slot._id]: {
                                ...(prev[slot._id] || {}),
                                startTime: e.target.value,
                              },
                            }))
                          }
                          className="border px-2 py-1 rounded"
                        />

                        <input
                          type="time"
                          value={editingSlots?.[slot._id]?.endTime || ""}
                          onChange={(e) =>
                            setEditingSlots((prev) => ({
                              ...prev,
                              [slot._id]: {
                                ...(prev[slot._id] || {}),
                                endTime: e.target.value,
                              },
                            }))
                          }
                          className="border px-2 py-1 rounded"
                        />

                        <button
                          className="px-3 py-1 bg-indigo-600 text-white rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateSlot(slot);
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-300 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSlotId(null);
                            setEditingSlots((prev) => ({
                              ...prev,
                              [slot._id]: {
                                startTime: normalizeTime(slot.startTime),
                                endTime: normalizeTime(slot.endTime),
                              },
                            }));
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="px-2 py-1 bg-transparent">
                        {slot.time || `${slot.startTime} - ${slot.endTime}`}
                      </button>
                    )}
                    <span
                      className="absolute top-0 right-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlot(slot);
                      }}
                    >
                      <CircleX size={16} />
                    </span>
                  </div>
                ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AddSlot;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../api";
import { toast } from "react-toastify";
import DateTimePicker from "../components/DateTimePicker";
import DailySchedule from "../components/DailySchedule";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import { formatDate, formatDateTimeRange, formatTime } from "../utils/dateTime";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { FaSignOutAlt } from 'react-icons/fa'

export default function Dashboard() {
  const staff = JSON.parse(localStorage.getItem("staff") || "null");
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [conflictsHtml, setConflictsHtml] = useState(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  async function loadMyBookings() {
    const r = await get("/booking/my");
    if (r.ok) setBookings(r.data || []);
  }

  useEffect(() => {
    if (!staff) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    } else loadMyBookings();
  }, []);

  function logout() {
    setConfirmLogoutOpen(true);
  }

  function performLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("staff");
    navigate("/login");
  }

  async function bookRoom() {
    if (!start || !end || !purpose) {
      toast.warn("Please fill all booking fields");
      return;
    }
    setLoading(true);
    const r = await post("/booking/book", {
      start_time: new Date(start).toISOString(),
      end_time: new Date(end).toISOString(),
      purpose,
    });
    setLoading(false);
    if (!r.ok) {
      if (r.status === 409 && r.data && r.data.conflicts) {
        const conflicts = r.data.conflicts;
        setConflictsHtml(
          conflicts
            .map(
              (c) =>
                `${c.id} (${c.status}) ${formatDateTimeRange(c.start_time, c.end_time)} - ${c.purpose || ""}`,
            )
            .join("\n"),
        );
      }
      return;
    }
    toast.success("Booking submitted");
    setStart("");
    setEnd("");
    setPurpose("");
    setConflictsHtml(null);
    loadMyBookings();
  }

  async function joinWaitingList() {
    const r = await post("/booking/waitlist", {
      staff_id: staff.id,
      start_time: new Date(start).toISOString(),
      end_time: new Date(end).toISOString(),
    });
    if (r.ok) toast.success("Added to waiting list");
    else if (r.data && r.data.message) toast.warn(r.data.message);
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="faan-logo">
          <img src="/assets/FAAN_logo-removebg-preview.png" alt="FAAN" />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 12 }}
          className="justify-between bg-gray-100 p-4 rounded-xl mb-6"
        >
          <h2>
            Welcome, <span id="staff-name">{staff && staff.name}</span>
          </h2>
          {staff && staff.isAdmin && (
            <a className="admin-access-btn" href="/admin">
              Admin
            </a>
          )}
          <button
            className="btn bg-red-500 w-2/12"
            onClick={logout}
            style={{ marginLeft: 12 }}
          >
            <span className="icon-left"><FaSignOutAlt /></span> Logout
          </button>
        </div>
        <h3>Book the Board Room</h3>
        <p className="font-semibold text-center">
          <strong>Room:</strong> Managing Director office board room booking
        </p>
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="booking-form">
            <div className="flex flex-col md:flex-row gap-2">
              <DateTimePicker label="Start" value={start} onChange={setStart} />
              <DateTimePicker label="End" value={end} onChange={setEnd} />
            </div>
            <input
              className="input mt-3"
              type="text"
              placeholder="Purpose of Meeting"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            <div className="flex flex-col gap-2 items-center mt-2">
              <button className="btn" onClick={bookRoom} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size={14} /> {" "}
                    <span style={{ marginLeft: 8 }}>Submitting...</span>
                  </>
                ) : (
                  "Submit Booking"
                )}
              </button>
            </div>
            <div
              id="booking-conflicts"
              style={{
                marginTop: 12,
                color: "#b30000",
                whiteSpace: "pre-wrap",
              }}
            >
              {conflictsHtml}
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-gray-50 p-4 rounded-xl">
            <DailySchedule date={start ? start.split("T")[0] : null} />
            <h3>My Bookings</h3>
            {bookings.length === 0 ? (
              <div className="booking-card">No bookings found</div>
            ) : (
              bookings.map((b) => (
                <div className="flex flex-col border-b-2 pb-4 gap-2" key={b.id}>
                  <div className="flex gap-3">
                    <strong>Date:</strong> {formatDate(b.start_time)}
                  </div>
                  <div className="flex gap-3">
                    <strong>Time:</strong> {formatTime(b.start_time)} - {" "}
                    {formatTime(b.end_time)}
                  </div>
                  <div className="flex gap-3">
                    <strong>Purpose:</strong> {b.purpose}
                  </div>
                  <div className="flex gap-3 items-center">
                    <strong>Status:</strong> <StatusBadge status={b.status} /> {" "}
                    {b.status === "approved" && (
                      <a
                        href={`http://localhost:3000/booking/booking/${b.id}/ics`}
                        style={{ marginLeft: 8 }}
                      >
                        ICS
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <ConfirmationDialog
          open={confirmLogoutOpen}
          title="Log out"
          description="Are you sure you want to log out? You will need to sign in again to continue."
          confirmLabel="Yes, log out"
          cancelLabel="Cancel"
          onConfirm={() => { performLogout(); setConfirmLogoutOpen(false); }}
          onCancel={() => setConfirmLogoutOpen(false)}
        />
      </div>
    </div>
  );
}

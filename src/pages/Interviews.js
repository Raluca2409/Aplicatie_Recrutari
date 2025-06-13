import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const localizer = momentLocalizer(moment);

const Interviews = () => {
  const [events, setEvents] = useState([]);

  const handleSelectSlot = async ({ start, end }) => {
    const confirm = window.confirm("Adaugi acest slot ca disponibil?");
    if (!confirm) return;
  
    const snapshot = await getDocs(collection(db, "interviewSlots"));
    const userEmail = auth.currentUser?.email;
    const startSec = Math.floor(start.getTime() / 1000);
    const endSec = Math.floor(end.getTime() / 1000);
  
    const exists = snapshot.docs.find(doc => {
      const data = doc.data();
      const docStart = data.start.seconds;
      const docEnd = data.end.seconds;
      return (
        docStart === startSec &&
        docEnd === endSec &&
        data.owner === userEmail
      );
    });
  
    if (exists) {
      alert("Ai deja un slot pus în acest interval!");
      return;
    }
  
    await addDoc(collection(db, "interviewSlots"), {
      title: "Slot disponibil",
      start,
      end,
      status: "available",
      owner: userEmail,
      createdAt: new Date(),
    });
  
    const event = new Event("slotsUpdated");
    window.dispatchEvent(event);
  };

  const fetchSlots = async () => {
    const snapshot = await getDocs(collection(db, "interviewSlots"));
    const rawSlots = snapshot.docs.map(doc => doc.data());

    const grouped = {};
    rawSlots.forEach(slot => {
      const key = `${slot.start.seconds}_${slot.end.seconds}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(slot);
    });

    const userEmail = auth.currentUser?.email;

    const mergedEvents = Object.entries(grouped).map(([_, slots]) => {
      const { start, end } = slots[0];
      const startDate = new Date(start.seconds * 1000);
      const endDate = new Date(end.seconds * 1000);
      const total = slots.length;
      const reserved = slots.filter(s => s.status === "reserved" || s.status === "booked").length;

      const currentUserSlot = slots.find(s => s.owner === userEmail);
      const currentUserReserved = currentUserSlot?.status === "reserved" || currentUserSlot?.status === "booked";

      return {
        title: `${reserved} din ${total}`,
        start: startDate,
        end: endDate,
        reserved,
        total,
        isMine: !!currentUserSlot,
        isMineReserved: !!currentUserSlot && currentUserReserved
      };
    });

    setEvents(mergedEvents);
  };
  

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    const reload = () => {
      fetchSlots();
    };
    window.addEventListener("slotsUpdated", reload);
    return () => window.removeEventListener("slotsUpdated", reload);
  }, []);

  const eventPropGetter = (event) => {
    let backgroundColor = "#f8b195"; // somon pentru alți recrutori

    if (event.isMine) {
      backgroundColor = event.isMineReserved ? "#f6e05e" : "#fcd5ce"; // galben sau roz
    }

    return {
        style: {
          backgroundColor,
          color: "#000",
          fontWeight: "bold",
          borderRadius: "8px",
          border: "1px solid #999",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",     // centru vertical
          justifyContent: "center", // centru orizontal
          textAlign: "center",      // text centrat în interior
          padding: "4px",
        },
      };
  };

  const CustomWrapper = ({ children }) => {
    return React.cloneElement(React.Children.only(children), {
      style: {
        ...children.props.style,
        pointerEvents: "none", // dezactivează doar pentru eveniment, nu pentru grid
      },
    });
  };


  return (
    <div style={{ height: "90vh", padding: "2rem" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["week", "day"]}
        defaultView="week"
        step={30}
        timeslots={1}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventPropGetter}      
        style={{ height: "100%" }}

        components={{
            eventWrapper: CustomWrapper
          }}

      />

    </div>
  );
};

export default Interviews;

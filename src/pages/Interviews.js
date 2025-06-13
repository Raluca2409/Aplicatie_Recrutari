import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const localizer = momentLocalizer(moment);

const Interviews = () => {
    const [user] = useAuthState(auth);
    const [events, setEvents] = useState([]);
  

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const snapshot = await getDocs(collection(db, "interviewSlots"));
        const slots = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.status === "reserved"
                 ? `Rezervat - ${data.name || "Necunoscut"}`
                 : "Slot disponibil",
                start: new Date(data.start.seconds * 1000),
                end: new Date(data.end.seconds * 1000),
                status: data.status,
                owner: data.owner,
            };
          });          
        setEvents(slots);
      } catch (err) {
        console.error("Eroare la preluarea sloturilor:", err);
      }
    };

    fetchSlots();
  }, []);

  const handleSelectSlot = async ({ start, end }) => {
    const confirm = window.confirm("Adaugi acest slot ca disponibil?");
    if (!confirm) return;

    const newSlot = {
        title: "Slot disponibil",
        customTitle: "Slot disponibil",
        start,
        end,
        status: "available",
        owner: user?.email ?? "", 
      };
      

    try {
        await addDoc(collection(db, "interviewSlots"), {
            ...newSlot,
            createdAt: new Date(),
          });
          setEvents(prev => [...prev, newSlot]);
          
    } catch (err) {
      console.error("Eroare salvare Firebase:", err);
    }
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
        style={{ height: "100%" }}


        eventPropGetter={(event) => {
            const userEmail = auth.currentUser?.email;
            let backgroundColor = "#f8b195"; // somon default (alți recrutori)
          
            if (event.status === "reserved" || event.status === "booked") {
              backgroundColor = "#f6e05e"; // galben
            } else if (event.owner === userEmail) {
              backgroundColor = "#fcd5ce"; // rozaliu propriu
            }
          
            return {
              style: {
                backgroundColor,
                color: "#000",
                fontWeight: "bold",
                borderRadius: "6px",
                border: "1px solid #999",
                padding: "4px",
              }
            };
          }}
          
          
          
          
                    
          
      />
    </div>

    
  );
};

export default Interviews;

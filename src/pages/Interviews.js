import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { Calendar as RbcCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ro";
import { query, where } from "firebase/firestore";


moment.locale("ro", {
  months: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
});

const localizer = momentLocalizer(moment);

const Interviews = () => {

    <div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundImage: `url('/poza-blur.jpg')`, // sau un gradient simplu
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    filter: "blur(10px)",
    zIndex: 0,
  }}>

  </div>


  const [events, setEvents] = useState([]);
  const [showLegend, setShowLegend] = useState(false); 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isRecruit, setIsRecruit] = useState(false);
  const [isRecruitLoading, setIsRecruitLoading] = useState(true);
  const [myReservedSlot, setMyReservedSlot] = useState(null);
  const userEmail = auth.currentUser?.email;
  const [toastMessage, setToastMessage] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);
  const [hasApplication, setHasApplication] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const checkRecruitStatus = async () => {
      const email = auth.currentUser?.email;
      if (!email) return;
  
      const isRecrutor = email.endsWith("@ligaac.ro");
  
      if (isRecrutor) {
        setIsRecruit(false);
        setAccessDenied(false);
      } else {
        const q = query(collection(db, "applications"), where("email", "==", email));
        const snapshot = await getDocs(q);
        const userDoc = snapshot.docs[0]?.data();
        const isInterview = userDoc?.status === "interview";
  
        setIsRecruit(true);
        setAccessDenied(!isInterview); 
      }
  
      setIsLoadingAccess(false);
    };
  
    checkRecruitStatus();
  }, []);

  useEffect(() => {
    if (!isRecruitLoading) {
      setShowLegend(true);
    }
  }, [isRecruitLoading]);

  useEffect(() => {
    const checkIfHasApplication = async () => {
      const email = auth.currentUser?.email;
      if (!email) return;
  
      const q = query(collection(db, "applications"), where("email", "==", email));
      const snapshot = await getDocs(q);
  
      setHasApplication(!snapshot.empty); 
    };
  
    checkIfHasApplication();
  }, []);
  
  
  const handleSelectSlot = async ({ start, end }) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail?.endsWith("@ligaac.ro")) {
        showToast("Doar recrutorii pot adăuga sloturi.");
        return;
      }

      setConfirmModal({ type: "recrutor", slot: { start, end } });
      setPendingAction(() => async () => {
        const snapshot = await getDocs(collection(db, "interviewSlots"));
        const startSec = Math.floor(start.getTime() / 1000);
        const endSec = Math.floor(end.getTime() / 1000);
      
        const alreadyAddedByMe = snapshot.docs.find(doc => {
          const data = doc.data();
          return (
            data.start.seconds === startSec &&
            data.end.seconds === endSec &&
            data.owner === userEmail
          );
        });
      
        if (alreadyAddedByMe) {
          showToast("Ai deja un slot pus în acest interval!");
          setConfirmModal(null);
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
      
        showToast("Slot adăugat!");
        window.dispatchEvent(new Event("slotsUpdated"));
        setConfirmModal(null);
      });
      
    }
  

  const handleSelectEvent = async (event) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
  
    if (!isRecruit) {
      const snapshot = await getDocs(collection(db, "interviewSlots"));
      const startSec = Math.floor(event.start.getTime() / 1000);
      const endSec = Math.floor(event.end.getTime() / 1000);
  
      const alreadyAddedByMe = snapshot.docs.find(doc => {
        const data = doc.data();
        return (
          data.start.seconds === startSec &&
          data.end.seconds === endSec &&
          data.owner === userEmail
        );
      });
  
      if (alreadyAddedByMe) {
        return;
      }
  
      setConfirmModal({ type: "recrutor", slot: event });
    setPendingAction(() => async () => {
      await addDoc(collection(db, "interviewSlots"), {
        title: "Slot disponibil",
        start: event.start,
        end: event.end,
        status: "available",
        owner: userEmail,
        createdAt: new Date(),
      });
      showToast("Slot adăugat!");
      window.dispatchEvent(new Event("slotsUpdated"));
      setConfirmModal(null);
    });

    return;
  }
  
    const snapshot = await getDocs(collection(db, "interviewSlots"));
    const alreadyReserved = snapshot.docs.find(doc => {
        const data = doc.data();
        return data.reservedBy === userEmail && data.status === "reserved";
      });
      
      if (alreadyReserved) {
        showToast("Ai deja un slot rezervat.");
        return;
      }
  
      const startSec = Math.floor(event.start.getTime() / 1000);
      const endSec = Math.floor(event.end.getTime() / 1000);
      
      const slotToReserve = snapshot.docs.find(doc => {
        const data = doc.data();
        return (
          data.start.seconds === startSec &&
          data.end.seconds === endSec &&
          data.status === "available"
        );
      });
      
      if (!slotToReserve) {
        showToast("Toate locurile sunt ocupate.");
        return;
      }

      setConfirmModal({ type: "recruit", slot: event });
  setPendingAction(() => async () => {
    await updateDoc(doc(db, "interviewSlots", slotToReserve.id), {
      status: "reserved",
      reservedBy: userEmail,
      updatedAt: new Date(),
    });
    showToast("Slot rezervat cu succes!");
    window.dispatchEvent(new Event("slotsUpdated"));
    setConfirmModal(null);
  });
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
        const reserved = slots.filter(s => s.status === "reserved").length;
      
        const currentUserSlot = slots.find(s => s.owner === userEmail);
        const isMine = !!slots.find(s => s.owner === userEmail);
        const isMineReserved = !!slots.find(slot =>
            slot.status === "reserved" &&
            slot.owner === userEmail &&
            !!slot.reservedBy
          );

        const isMineReservedRecrut = !!slots.find(slot =>
            slot.status === "reserved" &&
            slot.reservedBy === userEmail
          );  
          
        const allReserved = reserved === total;

        console.log("SLOT DEBUG →", {
            start: startDate,
            end: endDate,
            isMineReserved,
            isMineReservedRecrut,
            reserved,
            total,
            userEmail,
            slots
          });

      
        return {
          title: `${reserved} din ${total}`,
          start: startDate,
          end: endDate,
          reserved,
          total,
          isMine,
          isMineReserved,
          isMineReservedRecrut,
          allReserved
        };
      });
      
    setEvents(mergedEvents);
  };
  

  useEffect(() => { fetchSlots(); }, []);
  useEffect(() => {
    const reload = () => fetchSlots();
    window.addEventListener("slotsUpdated", reload);
    return () => window.removeEventListener("slotsUpdated", reload);
  }, []);

  const eventPropGetter = (event) => {
    let backgroundColor = "#1DB9C1"; 
  
    if (isRecruit) {
        if (event.isMineReservedRecrut) backgroundColor = "#f6e05e";  
        else if (event.allReserved) backgroundColor = "#b30000";      
        else backgroundColor = "#1DB9C1";                              
      } else {
        if (event.isMineReserved) backgroundColor = "#f6e05e";  
        else if (event.isMine) backgroundColor = "#fe7279";            
        else backgroundColor = "#1DB9C1";                               
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
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4px"
      }
    };
  };
  
  const showToast = (message) => {
  setToastMessage(message);
  setTimeout(() => setToastMessage(""), 3000);
  };

  const confirmAction = async () => {
    const userEmail = auth.currentUser?.email;
    const { type, slot } = confirmModal;
    const startSec = Math.floor(slot.start.getTime() / 1000);
    const endSec = Math.floor(slot.end.getTime() / 1000);
    const snapshot = await getDocs(collection(db, "interviewSlots"));
  
    if (type === "recrutor") {
      const alreadyAddedByMe = snapshot.docs.find(doc => {
        const data = doc.data();
        return data.start.seconds === startSec &&
               data.end.seconds === endSec &&
               data.owner === userEmail;
      });
  
      if (alreadyAddedByMe) {
        showToast("Ai deja un slot pus în acest interval!");
        setConfirmModal(null);
        return;
      }
  
      await addDoc(collection(db, "interviewSlots"), {
        title: "Slot disponibil",
        start: slot.start,
        end: slot.end,
        status: "available",
        owner: userEmail,
        createdAt: new Date(),
      });
  
      showToast("Slot adăugat!");
    }
  
    if (type === "recruit") {
      const alreadyReserved = snapshot.docs.find(doc => {
        const data = doc.data();
        return data.reservedBy === userEmail && data.status === "reserved";
      });
  
      if (alreadyReserved) {
        showToast("Ai deja un slot rezervat.");
        setConfirmModal(null);
        return;
      }
  
      const slotToReserve = snapshot.docs.find(doc => {
        const data = doc.data();
        return (
          data.start.seconds === startSec &&
          data.end.seconds === endSec &&
          data.status === "available"
        );
      });
  
      if (!slotToReserve) {
        showToast("Toate locurile sunt ocupate.");
        setConfirmModal(null);
        return;
      }
  
      await updateDoc(doc(db, "interviewSlots", slotToReserve.id), {
        status: "reserved",
        reservedBy: userEmail,
        updatedAt: new Date()
      });
  
      showToast("Slot rezervat cu succes!");
    }
  
    setConfirmModal(null);
    window.dispatchEvent(new Event("slotsUpdated"));
  };
  

  const CustomWrapper = ({ children }) => {
    if (!children?.props?.event) return children; 
  
    return React.cloneElement(React.Children.only(children), {
      style: {
        ...children.props.style,
      },
    });
  };
  

  const CustomToolbar = ({ label }) => {
    return (
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
        <button onClick={() => setShowLegend(true)} style={navBtn}>Info</button>
        </div>
        <h3 style={{ margin: 0 }}>{label}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={() => setCurrentDate(prev => moment(prev).subtract(1, "week").toDate())} style={navBtn}>{"<"}</button>
          <button onClick={() => setCurrentDate(prev => moment(prev).add(1, "week").toDate())} style={navBtn}>{">"}</button>
      </div>
      </div>
    );
  };

  if (!hasApplication && !auth.currentUser?.email.endsWith("@ligaac.ro")) {
    return (
        <div style={{
          backgroundImage: `url('/poza_fundal_blur.JPEG')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          fontFamily: "Montserrat, sans-serif",
          position: "relative",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}>
  
        <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.69)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "2rem 3rem",
          textAlign: "center",
          maxWidth: "600px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
        }}
        >
        <h2 style={{ color: "#b30000", marginBottom: "1rem" }}>Trebuie să completezi mai întâi formularul pentru a accesa această pagină.</h2>
      </div>
        </div>
      );
  }
  
  
  if (accessDenied) {
    return (
        <div style={{
          backgroundImage: `url('/poza_fundal_blur.JPEG')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          fontFamily: "Montserrat, sans-serif",
          position: "relative",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}>
  
        <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.69)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "2rem 3rem",
          textAlign: "center",
          maxWidth: "600px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
        }}
        >
        <h2 style={{ color: "#b30000", marginBottom: "1rem" }}>Din păcate nu ai fost acceptat pentru interviu sau aplicația ta nu a fost verificată încă. Verfică statusul aplicației în contul tău.</h2>
      </div>
        </div>
      );
  }
  
  return (

    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/poza_fundal_blur.JPEG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
      }} />
  
  <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2rem",
      padding: "4rem 1rem"
    }}>

<h2 style={{
        fontSize: "2rem",
        color: "#b30000",
        backgroundColor: "#fff",
        padding: "1rem 2rem",
        borderRadius: "10px",
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        textAlign: "center"
      }}>
        Programează-ți Interviul
      </h2>

      <div style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "2rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "1300px"
      }}>
  
        <RbcCalendar
          localizer={localizer}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["week", "day"]}
          defaultView="week"
          step={30}
          timeslots={1}
          selectable={!isRecruit}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          longPressThreshold={1}
          style={{ height: "80vh" }}
          components={{
            eventWrapper: CustomWrapper,
            toolbar: CustomToolbar
          }}
        />

{confirmModal && (
  <div style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    zIndex: 9999,
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
    minWidth: "300px",
    textAlign: "center"
  }}>
    <h3 style={{ marginBottom: "1rem" }}>
      {confirmModal.type === "recrutor"
        ? "Dorești să adaugi și tu un slot în acest interval?"
        : "Dorești să rezervi acest slot pentru interviu?"}
    </h3>
    <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
      <button onClick={confirmAction} style={{
        padding: "0.6rem 1.2rem",
        backgroundColor: "#b30000",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}>Da</button>
      <button onClick={() => setConfirmModal(null)} style={{
        padding: "0.6rem 1.2rem",
        backgroundColor: "#ccc",
        color: "#000",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}>Nu</button>
    </div>
  </div>
)}
  
        {showLegend && (
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            zIndex: 1000,
            maxWidth: "400px",
            textAlign: "left"
          }}>
            <h3 style={{ marginTop: 0, textAlign: "center", fontWeight: "bold" }}>Legendă culori</h3>
            <ul style={{ listStyle: "none", paddingLeft: 0, lineHeight: "1.6" }}>
              {isRecruit ? (
                <>
                  <li><span style={box("#f6e05e")}></span> <strong>Slotul tău rezervat</strong> – ai interviul programat</li>
                  <li><span style={box("#1DB9C1")}></span> <strong>Sloturi disponibile</strong> – îl poți selecta și rezerva un interviu</li>
                  <li><span style={box("#b30000")}></span> <strong>Sloturi indisponibile</strong> – toate sloturile au fost deja rezervate</li>
                </>
              ) : (
                <>
                  <li><span style={box("#f6e05e")}></span> <strong>Slotul tău rezervat</strong> – slotul tău rezervat de un recrut</li>
                  <li><span style={box("#fe7279")}></span> <strong>Slotul tău nerezervat</strong> – slot creat de tine, nerezervat</li>
                  <li><span style={box("#1DB9C1")}></span> <strong>Sloturile altor recrutori</strong> – sloturile altor recrutori, poți adăuga și tu unul</li>
                </>
              )}
            </ul>

            <div style={{ textAlign: "right" }}>
              <button onClick={() => setShowLegend(false)} style={{ marginTop: "1rem", padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}>
                Închide
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
  
};

const navBtn = {
  padding: "1rem 2rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
  background: "#b30000",
  cursor: "pointer",
  fontWeight: "bold",
  color: "white"
};

const box = (color) => ({
    display: "inline-block",
    width: "16px",
    height: "16px",
    backgroundColor: color,
    borderRadius: "4px",
    marginRight: "8px",
    border: "1px solid #999"
  });
  

export default Interviews;

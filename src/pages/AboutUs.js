import React, { useState } from "react";


const departments = [
  {
    title: "Educațional",
    description: "Departamentul Imagine se ocupă cu designul grafic, identitatea vizuală a proiectelor și realizarea de materiale promoționale.",
    image: "/educational.jpg"
  },
  {
    title: "Financiar",
    description: "Gestionează bugetele, sponsorii și finanțarile proiectelor noastre.",
    image: "/financiar.jpg"
  },
  {
    title: "Imagine",
    description: "Oferă suport tehnologic, dezvoltare software și administrare de platforme interne.",
    image: "/imagine.jpg"
  },
  {
    title: "Promovare",
    description: "Se ocupă de integrarea noilor membri și dezvoltarea personală a echipei.",
    image: "/promovare.jpg"
  },
  {
    title: "Resurse Umane",
    description: "Comunicarea cu publicul, social media și promovarea proiectelor sunt în responsabilitatea acestui departament.",
    image: "/hr.jpg"
  },
  {
    title: "Tehnic",
    description: "Organizează evenimente cu scop educativ pentru studenți și membri.",
    image: "/tehnic.jpg"
  }
];

const AboutUs = () => {

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(departments.length / itemsPerPage);

  const handlePrev = () => {
    const prevPage = (currentPage - 1 + totalPages) % totalPages;
    setCurrentPage(prevPage);
  };

  const handleNext = () => {
    const nextPage = (currentPage + 1) % totalPages;
    setCurrentPage(nextPage);
  };

  const visibleDepartments = departments.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return(
    <div style={{
      backgroundImage: `url('/poza_fundal_blur.JPEG')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "Montserrat, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }}>

  <div
    style={{
      position: "absolute",
    top: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: "0.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "450px",
    width: "90%",
    textAlign: "center"
    }}
  >
    <h2 style={{ color: "#b30000" }}>Cine suntem și ce facem</h2>
  </div>

  <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      >
        {visibleDepartments.map((dept, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "46%",
              minHeight: "250px"
            }}
          >
            <div style={{
              flex: "1 1 50%",
              height: "100%",
              maxHeight: "220px",
              backgroundImage: `url('${dept.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "12px",
              marginRight: "1.5rem"
            }}></div>

            <div style={{
              flex: "1 1 50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>

            <h3 style={{ color: "#b30000", marginBottom: "0.5rem" }}>
               {dept.title}
            </h3>
              <p>{dept.description}</p>
          </div>
          </div>
        ))}
      </div>

      <button
        onClick={handlePrev}
        style={{ ...arrowStyle, left: "10px" }}
      >
        &#8592;
      </button>

      <button
        onClick={handleNext}
        style={{ ...arrowStyle, right: "10px" }}
      >
        &#8594;
      </button>

</div>

  );

};

export default AboutUs;

const arrowStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255,255,255,0.8)",
  border: "none",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#b30000",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
};
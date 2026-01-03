// import { useState } from "react";
// import About from "./about/About";
// import "../App.css";

// export default function Home() {
//   const [showAbout, setShowAbout] = useState(false);

//   // Navigate to About page
//   if (showAbout) {
//     return <About />;
//   }

//   return (
//     <div className="home">
//       <nav className="nav">
//         Cybersecurity Club

//         <button
//           onClick={() => setShowAbout(true)}
//           style={{
//             marginLeft: "20px",
//             padding: "8px 16px",
//             background: "#00ffff",
//             color: "#000",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           About Us
//         </button>
//       </nav>

//       <section className="hero">
//         <h1>Hack. Defend. Secure.</h1>
//         <p>Building the next generation of security experts.</p>
//       </section>
//     </div>
//   );
// }


export default function Home() {
  return (
    <div className="home">
      <nav className="nav">Cybersecurity Club</nav>

      <section className="hero">
        <h1>Hack. Defend. Secure.</h1>
        <p>Building the next generation of security experts.</p>
      </section>
    </div>
  );
}
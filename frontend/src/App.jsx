import About from "./components/about/About";

function App() {
  return <About />;   // TEMPORARY for preview
}

export default App;



// import { useState } from "react";
// import Intro from "./components/intro/Intro";
// import Home from "./components/Home";
// import "./App.css";

// export default function App() {
//   const [showIntro, setShowIntro] = useState(
//     !sessionStorage.getItem("introSeen")
//   );

//   return showIntro ? (
//     <Intro
//       onFinish={() => {
//         sessionStorage.setItem("introSeen", "true");
//         setShowIntro(false);
//       }}
//     />
//   ) : (
//     <Home />
//   );
// }
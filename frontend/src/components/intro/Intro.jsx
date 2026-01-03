import { useState } from "react";
import TerminalText from "./TerminalText";
import DataTunnelIntro from "./DataTunnelIntro";

export default function Intro({ onFinish }) {
  const [phase, setPhase] = useState("terminal");

  const skipIntro = () => {
    onFinish();
  };

  return (
    <div className="intro">
      <button className="skip" onClick={skipIntro}>
        Skip
      </button>

      {phase === "terminal" && (
        <TerminalText onComplete={() => setPhase("tunnel")} />
      )}

      {phase === "tunnel" && (
        <DataTunnelIntro onFinish={onFinish} />
      )}
    </div>
  );
}

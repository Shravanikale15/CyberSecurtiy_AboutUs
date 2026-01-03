import { useEffect, useState, useRef } from "react";

const lines = [
  "Initializing protocol...",
  "Scanning network interfaces...",
  "Decrypting data packets...",
  "Access granted."
];

export default function TerminalText({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [chars, setChars] = useState([]);

  const glitchTimeoutRef = useRef(null);

  // buffer-level glitch
  const triggerDataGlitch = () => {
    const el = document.querySelector(".data-buffer");
    if (!el || el.classList.contains("data-glitch")) return;

    el.classList.add("data-glitch");

    glitchTimeoutRef.current = setTimeout(() => {
      el.classList.remove("data-glitch");
    }, 200);
  };

  useEffect(() => {
    if (lineIndex >= lines.length) {
      const done = setTimeout(() => {
        onComplete && onComplete();
      }, 800);
      return () => clearTimeout(done);
    }

    const currentLine = lines[lineIndex];
    const currentChar = currentLine[charIndex];

    const timeout = setTimeout(() => {
      setChars(prev => [...prev, { char: currentChar }]);

      //  RANDOM DATA CORRUPTION (while typing)
      if (Math.random() <= 0.05) {
        triggerDataGlitch();
      }

      if (charIndex + 1 < currentLine.length) {
        setCharIndex(prev => prev + 1);
      } else {
        // newline
        setChars(prev => [...prev, { char: "\n" }]);
        setLineIndex(prev => prev + 1);
        setCharIndex(0);
      }
    }, 60);

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex]);

  return (
    <pre
      className="terminal data-buffer"
      data-text={chars.map(c => c.char).join("")}
    >
      {chars.map((c, i) => (
        <span key={i} className="char">
          {c.char === " " ? "\u00A0" : c.char}
        </span>
      ))}
    </pre>
  );
}

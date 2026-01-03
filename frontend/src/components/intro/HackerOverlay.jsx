export default function HackerOverlay({ scriptLines }) {
  if (!scriptLines || !scriptLines.length) return null;

  return (
    <div
      className="font-mono pointer-events-none"
      style={{
        position: 'absolute',
        bottom: '0px',
        left: '0px',
        zIndex: 100000,
        color: "#ff4500",
        opacity: 0.3,
        fontSize: "16px",
        padding: "20px",
        maxWidth: "420px",
      }}
    >
      {scriptLines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
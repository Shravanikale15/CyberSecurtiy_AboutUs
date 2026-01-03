export default function RecoveryScreen({ recoveryLines }) {
  return (
    <div
      className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden"
      style={{ zIndex: 10000 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20"></div>

      <div className="relative z-10 max-w-3xl w-full px-8">
        <div className="space-y-3 font-mono">
          {recoveryLines.map((line, index) => (
            <div
              key={index}
              style={{
                color: '#00ffff',
                fontSize: '20px',
                opacity: 1,
                textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
                animation: 'pulse 2s infinite'
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div className="mt-8 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

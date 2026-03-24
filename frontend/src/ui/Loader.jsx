export default function Loader({ size = "md", text = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }
        .animate-spin-reverse {
          animation: spinReverse 2s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring - slow rotation */}
        <div
          className="absolute inset-0 rounded-full border-transparent border-t-medium_blue border-r-transparent border-b-transparent border-l-dark_blue animate-spin-slow"
          style={{
            borderTop: "3px",
            borderRight: "3px",
            borderBottom: "3px",
            borderLeft: "3px",
          }}
        ></div>

        {/* Middle ring - reverse rotation */}
        <div className="absolute inset-2 rounded-full border border-opacity-40 border-medium_blue animate-spin-reverse"></div>

        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-medium_blue to-dark_blue opacity-60 blur-sm animate-pulse-glow"></div>
      </div>

      {text && (
        <p className="mt-8 text-dark_blue font-semibold text-lg tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
}

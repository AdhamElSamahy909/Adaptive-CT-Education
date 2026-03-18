export default function Loader({ size = "md", text = "" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 bg-gradient-to-r from-medium_blue to-dark_blue rounded-full animate-spin"></div>
        <div className="absolute inset-1 bg-offwite rounded-full"></div>
      </div>
      {text && <p className="mt-4 text-dark_blue font-medium">{text}</p>}
    </div>
  );
}

export default function InstantPhoto({ src, alt, rotation, zIndex, className = "", widthClass = "w-[180px] lg:w-[260px] md:w-[220px] sm:w-[190px] 2xl:w-[320px]", heightClass = "h-[180px] lg:h-[260px] sm:h-[240px] 2xl:h-[320px] md:h-[220px] sm:h-[190px]" }) {
  return (
    <div 
      className={`absolute ${className} ${widthClass} ${heightClass}`}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        zIndex: zIndex
      }}
    >
      <div className="bg-white p-2 shadow-xl rounded-sm h-full">
        <div className="w-full h-full bg-gray-200 rounded-sm overflow-hidden">
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}


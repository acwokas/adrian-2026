import { useState } from "react";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function BlurImage({ src, alt, className = "", priority = false }: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Blur placeholder */}
      <div 
        className={`absolute inset-0 bg-muted/50 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
        }}
      />
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
}

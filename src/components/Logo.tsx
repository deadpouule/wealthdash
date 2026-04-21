import { cn } from '../lib/utils';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className }: LogoProps) {
  // A stylized geometric "Noria" water wheel with spiraling segments
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-neon-mint logo-glow", className)}
    >
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            {/* Spiral segment curving outwards */}
            <path 
              d="M 50 16 C 68 16 84 32 84 50" 
              opacity={(i % 2 === 0) ? 1 : 0.7}
            />
            {/* Inner bucket/spoke detail representing a Noria wheel */}
            <path 
              d="M 50 32 C 60 32 68 40 68 50" 
              strokeWidth="3"
              opacity={(i % 2 === 0) ? 0.8 : 0.5}
            />
          </g>
        ))}
      </g>
      {/* Central hub */}
      <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

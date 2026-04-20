import { cn } from '../lib/utils';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[#34C759] logo-glow", className)}
    >
      <defs>
        {/* Cuts the left pillar where the diagonal goes over */}
        <mask id="left-cut">
          <rect width="100" height="100" fill="white" />
          <path d="M 25 40 C 25 10, 50 15, 50 50 C 50 85, 75 90, 75 60" stroke="black" strokeWidth="28" strokeLinecap="round" fill="none" />
        </mask>
        
        {/* Cuts the diagonal where the right pillar goes over */}
        <mask id="diag-cut">
          <rect width="100" height="100" fill="white" />
          <path d="M 75 20 L 75 60" stroke="black" strokeWidth="28" strokeLinecap="round" fill="none" />
        </mask>
      </defs>

      {/* Left Pilar (on bottom, cut by diagonal) */}
      <path d="M 25 80 L 25 40" stroke="currentColor" strokeWidth="20" strokeLinecap="round" mask="url(#left-cut)" />
      
      {/* Diagonal (in middle, cut by right pillar) */}
      <path d="M 25 40 C 25 10, 50 15, 50 50 C 50 85, 75 90, 75 60" stroke="currentColor" strokeWidth="20" strokeLinecap="round" fill="none" mask="url(#diag-cut)" />

      {/* Right Pilar (on top, solid) */}
      <path d="M 75 20 L 75 60" stroke="currentColor" strokeWidth="20" strokeLinecap="round" />
    </svg>
  );
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const dimensions = {
    sm: { svg: 28, text: 'text-base' },
    md: { svg: 36, text: 'text-xl' },
    lg: { svg: 48, text: 'text-2xl' },
  };

  const d = dimensions[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Polígono geométrico — três linhas diagonais paralelas em gradiente */}
      <svg
        width={d.svg}
        height={d.svg}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo Catálogo Digital"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {/* Hexágono de fundo */}
        <path
          d="M18 3L32 10.5V25.5L18 33L4 25.5V10.5L18 3Z"
          fill="url(#logoGrad)"
          opacity="0.12"
        />
        {/* Três linhas diagonais paralelas */}
        <line x1="10" y1="24" x2="20" y2="10" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="15" y1="27" x2="25" y2="13" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="20" y1="27" x2="30" y2="13" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>

      <span className={`font-bold bg-brand-gradient bg-clip-text text-transparent ${d.text}`}>
        Catálogo
      </span>
    </div>
  );
}

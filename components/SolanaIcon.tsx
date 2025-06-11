interface SolanaIconProps {
  className?: string
  size?: number
}

export function SolanaIcon({ className, size = 24 }: SolanaIconProps) {
  return (
    <img 
      src="https://i.ibb.co/nNdR4cQt/IMG-1357.png" 
      alt="Solana"
      className={className}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  )
}

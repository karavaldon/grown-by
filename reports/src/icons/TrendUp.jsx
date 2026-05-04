export default function TrendUp({ color = '#2D5E3F' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7H22V13" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

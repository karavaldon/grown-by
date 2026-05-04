export default function TrendDown({ color = '#606060' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 17L13.5 8.5L8.5 13.5L2 7" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17H22V11" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

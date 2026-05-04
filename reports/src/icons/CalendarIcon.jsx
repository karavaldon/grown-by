export default function CalendarIcon({ color = '#231F20' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M3 9H21" stroke={color} strokeWidth="1.5" />
      <path d="M8 2V5M16 2V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="7" y="12" width="2.5" height="2.5" rx="0.5" fill={color} />
      <rect x="11" y="12" width="2.5" height="2.5" rx="0.5" fill={color} />
      <rect x="15" y="12" width="2.5" height="2.5" rx="0.5" fill={color} />
    </svg>
  )
}

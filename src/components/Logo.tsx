/**
 * SayHi placeholder brand mark — a friendly quokka ("the happiest animal"),
 * matching the tagline "The happiest way to meet people".
 * Inline SVG so it renders crisply at any size without relying on emoji fonts.
 */
export function Logo({ size = 32, badge = true }: { size?: number; badge?: boolean }) {
  const quokka = (
    <svg viewBox="0 0 48 48" width={size} height={size} role="img" aria-label="SayHi">
      {/* ears */}
      <circle cx="15" cy="12" r="6.5" fill="#b9773f" />
      <circle cx="33" cy="12" r="6.5" fill="#b9773f" />
      <circle cx="15" cy="12" r="3" fill="#e8a86b" />
      <circle cx="33" cy="12" r="3" fill="#e8a86b" />
      {/* face */}
      <ellipse cx="24" cy="26" rx="15" ry="14" fill="#d1904f" />
      <ellipse cx="24" cy="30" rx="10" ry="9" fill="#e8b884" />
      {/* cheeks */}
      <circle cx="13.5" cy="30" r="3" fill="#f3a3a3" opacity="0.7" />
      <circle cx="34.5" cy="30" r="3" fill="#f3a3a3" opacity="0.7" />
      {/* eyes */}
      <circle cx="18.5" cy="24" r="2.6" fill="#3d2415" />
      <circle cx="29.5" cy="24" r="2.6" fill="#3d2415" />
      <circle cx="19.4" cy="23.2" r="0.9" fill="#fff" />
      <circle cx="30.4" cy="23.2" r="0.9" fill="#fff" />
      {/* nose */}
      <ellipse cx="24" cy="29" rx="2.2" ry="1.6" fill="#3d2415" />
      {/* happy smile */}
      <path
        d="M18 32.5 Q24 38 30 32.5"
        fill="none"
        stroke="#3d2415"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )

  if (!badge) return quokka

  return (
    <span
      className="inline-flex items-center justify-center rounded-xl bg-white/95 p-1 shadow-sm ring-1 ring-black/5"
      style={{ width: size + 8, height: size + 8 }}
    >
      {quokka}
    </span>
  )
}

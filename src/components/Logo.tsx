/**
 * ahola brand mark — the cream "ă" glyph on transparent background, sits
 * directly on the teal header/gate (no tile).
 */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}ahola-mark-cream-1024.png`}
      width={size}
      height={size}
      alt="ahola"
      style={{ width: size, height: size }}
    />
  )
}

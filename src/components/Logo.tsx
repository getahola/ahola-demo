/**
 * ahola brand mark — uses the app icon asset from /public.
 * BASE_URL keeps the path correct under the GitHub Pages sub-path.
 */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}ahola-icon.png`}
      width={size}
      height={size}
      alt="ahola"
      className="rounded-[22%]"
      style={{ width: size, height: size }}
    />
  )
}

/**
 * Which playful pieces this visitor has used, as words in <html data-played>,
 * so each piece's hint goes (see the sign in globals.css). The script at the top
 * of layout.tsx puts the saved list back before the first paint. Without storage
 * a hint still goes, for this visit.
 */
export function markPlayed(piece: string) {
  const root = document.documentElement;
  const played = root.dataset.played?.split(" ") ?? [];
  if (played.includes(piece)) return;
  root.dataset.played = [...played, piece].join(" ");
  try {
    localStorage.setItem("played", `${localStorage.getItem("played") ?? ""} ${piece}`.trim());
  } catch {}
}

import type { Press } from "@/data/writing";

/** A press headline set as a typed clipping: outlet, date and link, never a scan. */
export function Clipping({ item }: { item: Press }) {
  return (
    <blockquote className="clipping" cite={item.href}>
      <p>“{item.headline}”</p>
      <footer>
        <cite>
          <a href={item.href}>{item.outlet}</a>, {item.date}
          {!item.independent && " · brand press"}
        </cite>
      </footer>
      {item.note && <p className="note">{item.note}</p>}
    </blockquote>
  );
}

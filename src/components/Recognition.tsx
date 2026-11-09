import { recognition, type Recognition as Item } from "@/data/recognition";
import { PressCard, PressRow } from "./ListRows";
import { SectionLabel } from "./SectionLabel";

/** The data is ordered strongest first: the top three lead as cards. */
const LEAD = 3;

const isHonour = (r: Item) => r.kind === "endorsement" || r.kind === "award";

const by = (r: Item) => `${r.by}${r.note ? ` (${r.note})` : ""}`;

/**
 * Press, honours and interviews in three short groups. Who covered or
 * recognised him leads in each item and the headline follows small, so the
 * section scans by name rather than reading as a wall of headlines. No dates.
 */
export function Recognition() {
  const lead = recognition.slice(0, LEAD);
  const rest = recognition.slice(LEAD);
  const honours = rest.filter(isHonour);
  const more = rest.filter((r) => !isHonour(r));
  return (
    <section className="section" id="recognition" aria-labelledby="recognition-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="recognition">Recognition</SectionLabel>
        </div>
        <h3 className="group-label">Featured in</h3>
        <ul className="press-lead">
          {lead.map((r) => (
            <PressCard key={r.title} by={by(r)} title={r.title} href={r.href} />
          ))}
        </ul>
        {honours.length > 0 && (
          <>
            <h3 className="group-label">Honours</h3>
            <ul className="row-list press-rows">
              {honours.map((r) => (
                <PressRow key={r.title} by={by(r)} title={r.title} href={r.href} />
              ))}
            </ul>
          </>
        )}
        {more.length > 0 && (
          <>
            <h3 className="group-label">Interviews and more</h3>
            <ul className="row-list press-rows">
              {more.map((r) => (
                <PressRow key={r.title} by={by(r)} title={r.title} href={r.href} />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

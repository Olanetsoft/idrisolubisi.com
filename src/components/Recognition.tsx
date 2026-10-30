import { recognition, type Recognition as Item } from "@/data/recognition";
import { SectionLabel } from "./SectionLabel";

/** The data is ordered strongest first: the top three lead as cards. */
const LEAD = 3;

const isHonour = (r: Item) => r.kind === "endorsement" || r.kind === "award";

function Title({ item }: { item: Item }) {
  return item.href ? (
    <a className="card-link" href={item.href}>
      {item.title}
    </a>
  ) : (
    item.title
  );
}

const by = (r: Item) => `${r.by}${r.note ? ` (${r.note})` : ""}`;

/** A row: who, set strong, then the headline small. The row is the link. */
function Row({ item }: { item: Item }) {
  return (
    <li className="row-item press-row">
      <p className="press-by">{by(item)}</p>
      <h4 className="card-title">
        <Title item={item} />
      </h4>
    </li>
  );
}

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
            <li className="press-card" key={r.title}>
              <p className="press-outlet">{by(r)}</p>
              <h4 className="press-headline">
                <Title item={r} />
              </h4>
            </li>
          ))}
        </ul>
        {honours.length > 0 && (
          <>
            <h3 className="group-label">Honours</h3>
            <ul className="row-list press-rows">
              {honours.map((r) => (
                <Row key={r.title} item={r} />
              ))}
            </ul>
          </>
        )}
        {more.length > 0 && (
          <>
            <h3 className="group-label">Interviews and more</h3>
            <ul className="row-list press-rows">
              {more.map((r) => (
                <Row key={r.title} item={r} />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

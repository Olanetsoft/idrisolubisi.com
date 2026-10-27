import { recognition, type Recognition as Item } from "@/data/recognition";
import { SectionLabel } from "./SectionLabel";

/** The data is ordered strongest first: the top three lead, set large. */
const LEAD = 3;

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

/**
 * Press, honours and interviews: the three strongest pieces set large, then
 * the rest as a scannable list (who, then the headline). No dates.
 */
export function Recognition() {
  const lead = recognition.slice(0, LEAD);
  const rest = recognition.slice(LEAD);
  return (
    <section className="section" id="recognition" aria-labelledby="recognition-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="recognition">Recognition</SectionLabel>
          <p className="lede">Covered by Business Insider Africa and BusinessDay.</p>
        </div>
        <ul className="press-lead">
          {lead.map((r) => (
            <li className="press-item" key={r.title}>
              <p className="card-kicker">{by(r)}</p>
              <h3 className="press-title">
                <Title item={r} />
              </h3>
            </li>
          ))}
        </ul>
        <ul className="row-list">
          {rest.map((r) => (
            <li className="row-item" key={r.title}>
              <p className="card-kicker">{by(r)}</p>
              <h3 className="card-title">
                <Title item={r} />
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

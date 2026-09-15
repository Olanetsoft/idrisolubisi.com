import { domain, interests } from "@/data/interests";

export function Interests() {
  return (
    <section className="section" id="interests" aria-labelledby="interests-title">
      <div className="container section-grid">
        <h2 id="interests-title">Current tech interests</h2>
        <ul className="interest-list">
          {interests.map((i) => (
            <li key={i.url}>
              <a href={i.url}>{i.name}</a>
              <span className="meta">{domain(i.url)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

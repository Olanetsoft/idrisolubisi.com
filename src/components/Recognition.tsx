import { recognition } from "@/data/recognition";

export function Recognition() {
  return (
    <section className="section" id="recognition" aria-labelledby="recognition-title">
      <div className="container">
        <h2 id="recognition-title">Recognition</h2>
        <ul className="recognition-list">
          {recognition.map((r) => (
            <li key={r.title}>
              <p className="period">{r.date}</p>
              <div>
                <p className="recognition-title">{r.href ? <a href={r.href}>{r.title}</a> : r.title}</p>
                <p className="meta">
                  {r.by}
                  {r.note && ` · ${r.note}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

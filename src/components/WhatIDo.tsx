import { site } from "@/data/site";

export function WhatIDo() {
  return (
    <section className="section" id="what-i-do" aria-labelledby="what-i-do-title">
      <div className="container">
        <h2 id="what-i-do-title">What I do</h2>
        <p className="section-intro">
          Four functions, one job: make an infrastructure product buildable, and keep the people
          building on it unblocked.
        </p>
        <ul className="function-grid">
          {site.functions.map((f, i) => (
            <li className="card" key={f.title}>
              <p className="index">0{i + 1}</p>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <p className="proof">{f.proof}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { site } from "@/data/site";

export function WhatIDo() {
  return (
    <section className="section" id="what-i-do" aria-labelledby="what-i-do-title">
      <div className="container">
        <h2 id="what-i-do-title">What I do</h2>
        <ul className="function-grid">
          {site.functions.map((f) => (
            <li className="card" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { site } from "@/data/site";

export function WhatIDo() {
  return (
    <section className="section" id="what-i-do" aria-labelledby="what-i-do-title">
      <div className="container section-grid">
        <div className="section-head">
          <h2 id="what-i-do-title">What I do</h2>
        </div>
        <dl className="box-grid">
          {site.functions.map((f) => (
            <div className="box" key={f.title}>
              <dt className="box-title">{f.title}</dt>
              <dd className="box-text">{f.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

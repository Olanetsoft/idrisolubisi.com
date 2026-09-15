import { site } from "@/data/site";

export function WhatIDo() {
  return (
    <section className="section" id="what-i-do" aria-labelledby="what-i-do-title">
      <div className="container section-grid">
        <h2 id="what-i-do-title">What I do</h2>
        <dl className="rows">
          {site.functions.map((f) => (
            <div className="row" key={f.title}>
              <dt className="row-label strong">{f.title}</dt>
              <dd className="row-body">
                <p>{f.text}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

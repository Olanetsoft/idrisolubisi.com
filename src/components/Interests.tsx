import { interests } from "@/data/interests";

const sentence = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" }).format(interests);

export function Interests() {
  return (
    <section className="section" id="interests" aria-labelledby="interests-title">
      <div className="container section-grid">
        <div className="section-head">
          <h2 id="interests-title">Current tech interests</h2>
        </div>
        <div className="box">
          <p className="interests">{sentence}.</p>
        </div>
      </div>
    </section>
  );
}

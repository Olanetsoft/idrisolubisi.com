import data from "@/data/github-contributions.json";
import { site } from "@/data/site";

const LEVELS = [0, 1, 4, 8, 13];
const level = (n: number) => LEVELS.filter((t) => n >= t).length - 1;
const format = (n: number) => new Intl.NumberFormat("en-GB").format(n);

const start = new Date(data.firstDay);
const months: { label: string; week: number }[] = [];
for (let w = 0; w < data.weeks.length; w++) {
  const d = new Date(start);
  d.setDate(start.getDate() + w * 7);
  const label = d.toLocaleString("en-GB", { month: "short" });
  if (d.getDate() <= 7 && months[months.length - 1]?.label !== label) months.push({ label, week: w });
}

export function Contributions() {
  return (
    <figure className="contrib">
      <figcaption>
        <b>{format(data.total)} contributions</b> on GitHub in the last year ·{" "}
        {format(data.commits)} commits, {format(data.pullRequests)} pull requests ·{" "}
        <a href={site.links.github}>@{site.handle}</a>
      </figcaption>
      <div className="contrib-scroll">
        <div className="contrib-months" aria-hidden="true">
          {months.map((m) => (
            <span key={`${m.label}-${m.week}`} style={{ gridColumnStart: m.week + 1 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="contrib-grid" role="img" aria-label={`${format(data.total)} contributions in the last year`}>
          {data.weeks.map((week, w) => (
            <div className="contrib-week" key={w}>
              {week.map((count, d) => (
                <span key={d} className="contrib-day" data-level={level(count)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

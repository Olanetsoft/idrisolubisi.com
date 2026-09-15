import data from "@/data/github-contributions.json";
import { site } from "@/data/site";

const LEVELS = [0, 1, 4, 8, 13];
const level = (n: number) => LEVELS.filter((t) => n >= t).length - 1;
const format = (n: number) => new Intl.NumberFormat("en-GB").format(n);

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const LABEL_H = 16;
const width = data.weeks.length * STEP - GAP;
const height = 7 * STEP - GAP;

// One path per intensity level instead of one element per day: five nodes
// where a div grid needs 371, which keeps the HTML and the DOM small.
const paths = ["", "", "", "", ""];
data.weeks.forEach((week, w) => {
  week.forEach((count, d) => {
    paths[level(count)] += `M${w * STEP} ${d * STEP}h${CELL}v${CELL}h-${CELL}z`;
  });
});

const start = new Date(data.firstDay);
const months: { label: string; week: number }[] = [];
for (let w = 0; w < data.weeks.length; w++) {
  const d = new Date(start);
  d.setDate(start.getDate() + w * 7);
  const label = d.toLocaleString("en-GB", { month: "short" });
  if (d.getDate() <= 7 && months[months.length - 1]?.label !== label) months.push({ label, week: w });
}

export function Contributions() {
  const summary = `${format(data.total)} contributions on GitHub in the last year`;
  return (
    <figure className="contrib">
      <figcaption>
        <b>{format(data.total)} contributions</b> on GitHub in the last year · {format(data.commits)}{" "}
        commits, {format(data.pullRequests)} pull requests · <a href={site.links.github}>@{site.handle}</a>
      </figcaption>
      <div className="contrib-scroll">
        <svg
          className="contrib-svg"
          viewBox={`0 ${-LABEL_H} ${width} ${height + LABEL_H}`}
          width={width}
          height={height + LABEL_H}
          role="img"
          aria-label={summary}
        >
          {months.map((m) => (
            <text key={`${m.label}-${m.week}`} x={m.week * STEP} y={-5} className="contrib-month">
              {m.label}
            </text>
          ))}
          {paths.map((d, i) => d && <path key={i} d={d} className={`contrib-l${i}`} />)}
        </svg>
      </div>
    </figure>
  );
}

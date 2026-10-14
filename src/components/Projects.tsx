import { harnessIntro, projects, type Project } from "@/data/projects";
import { site } from "@/data/site";
import { isPrivateRepo, starsFor } from "@/lib/generated";
import { CopyCommand } from "./CopyCommand";
import { SwipeCount } from "./SwipeCount";
import { BrandIcon, STACK_ICONS, UiIcon } from "./icons";

/** Live star counts only when they help: 100 or more. */
const STAR_FLOOR = 100;
const number = new Intl.NumberFormat("en-GB");

function starsOf(project: Project): number | null {
  if (!project.githubRepo || project.hideStars) return null;
  const stars = starsFor(project.githubRepo);
  return stars !== null && stars >= STAR_FLOOR ? stars : null;
}

/** Links that resolve for a visitor: a private repo would 404, so it is left out until it is public. */
const publicLinks = (project: Project) => project.links.filter((l) => !isPrivateRepo(l.url));

/** The tech logo for a stack item, or a plug for MCP, or nothing. */
function StackIcon({ item }: { item: string }) {
  if (item === "MCP") return <UiIcon name="plug" size={13} />;
  const brand = STACK_ICONS[item];
  return brand ? <BrandIcon name={brand} size={13} /> : null;
}

function Badge({ badge }: { badge: NonNullable<Project["badge"]> }) {
  return <span className={badge === "Live" ? "badge badge--live" : "badge"}>{badge}</span>;
}

function FeaturedCard({ project }: { project: Project }) {
  const stars = starsOf(project);
  return (
    <li className="pcard spot tilt" id={project.key}>
      <div className="pcard-top">
        <span className="pcard-layer">[ {project.layer} ]</span>
        {project.badge && <Badge badge={project.badge} />}
      </div>
      <h3 className="pcard-name">{project.name}</h3>
      <p className="pcard-what">{project.oneLine}</p>
      {project.proof && <p className="pcard-proof">{project.proof}</p>}
      <ul className="chips" aria-label="Stack">
        {project.stack.map((s) => (
          <li className="chip" key={s}>
            <StackIcon item={s} />
            {s}
          </li>
        ))}
      </ul>
      <div className="pcard-foot">
        {project.command && <CopyCommand command={project.command} />}
        <span className="pcard-links">
          {publicLinks(project).map((l) => (
            <a key={l.url} href={l.url}>
              {l.label}
            </a>
          ))}
        </span>
        {stars !== null && <span className="stars">{number.format(stars)} stars</span>}
      </div>
    </li>
  );
}

function CompactCard({ project }: { project: Project }) {
  const stars = starsOf(project);
  const [primary, ...rest] = publicLinks(project);
  return (
    <li className="ccard spot tilt" id={project.key}>
      <div className="ccard-top">
        <h3 className="ccard-name">
          {primary ? (
            <a className="ccard-link" href={primary.url}>
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>
        {project.badge && <Badge badge={project.badge} />}
      </div>
      <p className="ccard-what">{project.oneLine}</p>
      {project.proof && <p className="ccard-proof">{project.proof}</p>}
      <ul className="chips chips--sm" aria-label="Stack">
        {project.stack.map((item) => (
          <li className="chip" key={item}>
            <StackIcon item={item} />
            {item}
          </li>
        ))}
      </ul>
      {(rest.length > 0 || stars !== null) && (
        <p className="ccard-foot">
          {rest.map((l) => (
            <a key={l.url} href={l.url}>
              {l.label}
            </a>
          ))}
          {stars !== null && <span className="stars">{number.format(stars)} stars</span>}
        </p>
      )}
    </li>
  );
}

export function Projects() {
  const harness = projects.filter((p) => p.group === "harness");
  const more = projects.filter((p) => p.group === "more");
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <div className="section-head">
          <h2 className="label" id="work-title">
            <span className="label-index" aria-hidden="true" />
            Projects
          </h2>
          <p className="lede">The agent harness, end to end.</p>
          <p className="lede-sub">{harnessIntro}</p>
        </div>
        <p className="group-label">
          Agent harness <span aria-hidden="true">·</span> {harness.length}
        </p>
        <ul className="harness">
          {harness.map((p) => (
            <FeaturedCard key={p.key} project={p} />
          ))}
        </ul>
        <p className="group-label">
          More builds <span aria-hidden="true">·</span> {more.length}
          <SwipeCount total={more.length} />
        </p>
        <ul className="more">
          {more.map((p) => (
            <CompactCard key={p.key} project={p} />
          ))}
          <li className="ccard more-tail">
            <a className="ccard-link" href={site.links.github} rel="me">
              <BrandIcon name="github" size={28} />
              <span className="more-tail-text">More on GitHub</span>
            </a>
          </li>
        </ul>
        <p className="more-link more-link--github">
          <a href={site.links.github} rel="me">
            <BrandIcon name="github" />
            More on GitHub
          </a>
        </p>
      </div>
    </section>
  );
}

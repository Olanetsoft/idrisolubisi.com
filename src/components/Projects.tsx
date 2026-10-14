import { harnessIntro, projects, type Project } from "@/data/projects";
import { site } from "@/data/site";
import { isPrivateRepo, shownStars } from "@/lib/generated";
import { CopyCommand } from "./CopyCommand";
import { SwipeCount } from "./SwipeCount";
import { BrandIcon, STACK_ICONS, UiIcon } from "./icons";
import { SectionLabel } from "./SectionLabel";

const number = new Intl.NumberFormat("en-GB");

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
  const stars = shownStars(project);
  const links = publicLinks(project);
  const privateRepo = links.length < project.links.length;
  return (
    <li className="pcard spot tilt" id={project.key}>
      <div className="pcard-top">
        <span className="pcard-layer">[ {project.layer} ]</span>
        {project.badge && <Badge badge={project.badge} />}
      </div>
      <h4 className="pcard-name">{project.name}</h4>
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
        {links.length > 0 && (
          <span className="pcard-links">
            {links.map((l) => (
              <a key={l.url} href={l.url}>
                {l.label}
                <span className="sr-only">: {project.name}</span>
              </a>
            ))}
          </span>
        )}
        {privateRepo && <span className="pcard-note">Private repo</span>}
        {stars !== null && <span className="stars">{number.format(stars)} stars</span>}
      </div>
    </li>
  );
}

function CompactCard({ project }: { project: Project }) {
  const stars = shownStars(project);
  const [primary, ...rest] = publicLinks(project);
  return (
    <li className="ccard spot tilt" id={project.key}>
      <div className="ccard-top">
        <h4 className="ccard-name">
          {primary ? (
            <a className="ccard-link" href={primary.url}>
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h4>
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
              <span className="sr-only">: {project.name}</span>
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
          <SectionLabel id="work">Projects</SectionLabel>
          <p className="lede">The agent harness, end to end.</p>
          <p className="lede-sub">{harnessIntro}</p>
        </div>
        <h3 className="group-label">
          Agent harness <span aria-hidden="true">·</span> {harness.length}
        </h3>
        <ul className="harness">
          {harness.map((p) => (
            <FeaturedCard key={p.key} project={p} />
          ))}
        </ul>
        <h3 className="group-label">
          More builds{" "}
          <span className="group-count">
            <span aria-hidden="true">·</span> {more.length}
          </span>
          <SwipeCount total={more.length} />
        </h3>
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

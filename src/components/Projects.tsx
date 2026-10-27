import { projects, type Project } from "@/data/projects";
import { site } from "@/data/site";
import { isPrivateRepo } from "@/lib/generated";
import { BrandIcon } from "./icons";
import { MoreToggle } from "./MoreToggle";
import { SectionLabel } from "./SectionLabel";
import { WorkCard } from "./WorkCard";

/** Links that resolve for a visitor: a private repo would 404, so it is left out until it is public. */
const publicLinks = (project: Project) => project.links.filter((l) => !isPrivateRepo(l.url));

function Badge({ badge }: { badge: NonNullable<Project["badge"]> }) {
  return <span className={badge === "Live" ? "badge badge--live" : "badge"}>{badge}</span>;
}

const LEAD_SIZES =
  "(max-width: 759px) calc(100vw - 32px), (max-width: 1023px) 55vw, (max-width: 1295px) 29vw, 380px";
const FEATURE_SIZES =
  "(max-width: 759px) calc(100vw - 32px), (max-width: 1023px) 44vw, (max-width: 1295px) 29vw, 380px";
const MORE_SIZES = "(max-width: 759px) calc(100vw - 32px), (max-width: 1295px) 30vw, 380px";

/** More builds shows this many cards; a button reveals the rest. */
const MORE_SHOWN = 3;

/** A project as a card: its picture, name, a few words and one number; the card opens the project. */
function ProjectCard({
  project,
  feature,
  lead,
  extra,
}: {
  project: Project;
  feature?: boolean;
  lead?: boolean;
  /** Beyond the first few more builds: hidden until the list is opened. */
  extra?: boolean;
}) {
  const [primary] = publicLinks(project);
  const isPrivate = !primary && project.links.length > 0;
  return (
    <li id={project.key} data-extra={extra || undefined}>
      <WorkCard
        href={primary?.url}
        image={project.image}
        alt={primary ? undefined : project.imageAlt}
        sizes={lead ? LEAD_SIZES : feature ? FEATURE_SIZES : MORE_SIZES}
        eager={lead}
        tag={feature && project.layer ? `[ ${project.layer} ]` : undefined}
        name={project.name}
        badge={project.badge && <Badge badge={project.badge} />}
        line={project.tagline}
        proof={project.proof}
        srExtra={
          primary ? `opens ${primary.label === "Site" ? "the site" : primary.label}` : undefined
        }
        note={isPrivate ? "Private repo" : undefined}
        size={feature ? "feature" : "default"}
      />
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
        </div>
        <h3 className="group-label">
          Agent harness <span aria-hidden="true">·</span> {harness.length}
        </h3>
        <ul className="harness">
          {harness.map((p, i) => (
            <ProjectCard key={p.key} project={p} feature lead={i === 0} />
          ))}
        </ul>
        <h3 className="group-label">
          More builds <span aria-hidden="true">·</span> {more.length}
        </h3>
        <ul className="more" id="more-builds">
          {more.map((p, i) => (
            <ProjectCard key={p.key} project={p} extra={i >= MORE_SHOWN} />
          ))}
        </ul>
        <div className="more-actions">
          {more.length > MORE_SHOWN && (
            <MoreToggle listId="more-builds" hidden={more.length - MORE_SHOWN} />
          )}
          <p className="more-link more-link--github">
            <a href={site.links.github} rel="me">
              <BrandIcon name="github" />
              More on GitHub
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

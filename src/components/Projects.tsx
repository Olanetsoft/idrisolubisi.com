import { projects, type Project } from "@/data/projects";
import { site } from "@/data/site";
import { isPrivateRepo } from "@/lib/generated";
import { MoreToggle } from "./MoreToggle";
import { SectionLabel } from "./SectionLabel";
import { WorkCard } from "./WorkCard";

/** Links that resolve for a visitor: a private repo would 404, so it is left out until it is public. */
const publicLinks = (project: Project) => project.links.filter((l) => !isPrivateRepo(l.url));

/** How a card's link reads to screen readers, after "opens". */
const OPENS: Record<string, string> = {
  Site: "the site",
  "Case study": "the case study",
  Tool: "the tool",
};

/** Three cards to a row in the 960px page column; on phones one row each, the picture 112px wide. */
const CARD_SIZES = "(max-width: 759px) 112px, (max-width: 1023px) 30vw, 310px";

/** More builds shows one row of cards; a button reveals the rest. */
const MORE_SHOWN = 3;

/** A project as a card: its picture, name and a few words; the card opens the project. Its numbers live in /llms.txt and /llms-full.txt. */
function ProjectCard({
  project,
  feature,
  lead,
  step,
  extra,
}: {
  project: Project;
  feature?: boolean;
  lead?: boolean;
  /** The harness card's place in the sequence (1 Act, 2 Verify, 3 Observe). */
  step?: number;
  /** Beyond the first few more builds: hidden until the list is opened. */
  extra?: boolean;
}) {
  const [primary] = publicLinks(project);
  return (
    <li id={project.key} data-extra={extra || undefined}>
      {step && project.layer && (
        <p className="step">
          <span className="step-num">{String(step).padStart(2, "0")}</span> {project.layer}
        </p>
      )}
      <WorkCard
        href={primary?.url}
        image={project.image}
        alt={primary ? undefined : project.imageAlt}
        sizes={CARD_SIZES}
        eager={lead}
        name={project.name}
        line={project.tagline}
        srExtra={primary ? `opens ${OPENS[primary.label] ?? primary.label}` : undefined}
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
        </div>
        <h3 className="group-label">Agent harness</h3>
        <ul className="harness">
          {harness.map((p, i) => (
            <ProjectCard key={p.key} project={p} feature lead={i === 0} step={i + 1} />
          ))}
        </ul>
        <h3 className="group-label">More builds</h3>
        <ul className="more" id="more-builds">
          {more.map((p, i) => (
            <ProjectCard key={p.key} project={p} extra={i >= MORE_SHOWN} />
          ))}
        </ul>
        <div className="more-actions">
          {more.length > MORE_SHOWN && <MoreToggle listId="more-builds" noun="builds" />}
          <p className="more-link more-link--github">
            <a href={site.links.github} rel="me">
              More on GitHub
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

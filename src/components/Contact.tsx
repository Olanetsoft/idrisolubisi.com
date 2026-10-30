import { site } from "@/data/site";
import { githubFollowers } from "@/lib/generated";
import { CopyButton } from "./CopyCommand";
import { BrandIcon, type BrandName } from "./icons";
import { SectionLabel } from "./SectionLabel";

/** "1,300+" from the live count, rounded down to the hundred so it never overstates. */
const roundedDown = (n: number | null) =>
  n === null ? undefined : `${new Intl.NumberFormat("en-GB").format(Math.floor(n / 100) * 100)}+`;

const followers = (count?: string) => (count ? `${count} followers` : undefined);

const SOCIALS: { label: string; href: string; icon: BrandName; note?: string }[] = [
  {
    label: "LinkedIn",
    href: site.links.linkedin,
    icon: "linkedin",
    note: followers(site.profile.linkedinFollowers),
  },
  {
    label: "GitHub",
    href: site.links.github,
    icon: "github",
    note: followers(roundedDown(githubFollowers)),
  },
  { label: "X", href: site.links.x, icon: "x", note: followers(site.profile.xFollowers) },
  { label: "YouTube", href: site.links.youtube, icon: "youtube" },
  {
    label: "Blog",
    href: site.links.blog,
    icon: "hashnode",
    note: followers(site.profile.hashnodeFollowers),
  },
];

/** Ready to paste into an event page or a press note, in the third person. */
const BIOS = [
  { label: "Short bio", text: site.shortBio },
  { label: "Full bio", text: site.description },
];

export function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="section-head">
          <SectionLabel id="contact">Contact</SectionLabel>
          <p className="lede">For roles, speaking or advising.</p>
        </div>
        <div className="contact-box">
          <div className="contact-main">
            <p className="availability">{site.availability}</p>
            <a className="btn btn--primary" href={site.bookingUrl}>
              Book a 30-min call
            </a>
          </div>
          <div className="contact-side">
            <p className="contact-email">
              <a className="email" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <CopyButton value={site.email} label="Copy email address" />
            </p>
            <ul className="socials" aria-label="Elsewhere">
              {SOCIALS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} rel="me">
                    <BrandIcon name={link.icon} size={18} />
                    <span>{link.label}</span>
                    {link.note && <span className="social-note">{link.note}</span>}
                  </a>
                </li>
              ))}
            </ul>
            <details className="organisers">
              <summary>For organisers: bios, headshots and Sessionize</summary>
              <div className="organisers-body">
                {BIOS.map((bio) => (
                  <div key={bio.label} className="bio">
                    <p className="bio-label">{bio.label}</p>
                    <CopyButton value={bio.text} label={`Copy the ${bio.label.toLowerCase()}`} />
                    <p className="bio-text">{bio.text}</p>
                  </div>
                ))}
                <p className="organisers-links">
                  <a href={site.links.photos}>Headshots and photos</a>
                  <a href={site.links.sessionize}>Speaker profile on Sessionize</a>
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}

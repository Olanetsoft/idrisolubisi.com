import Link from "next/link";
import { ArrowRight } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="container not-found">
      <p className="folio mono">
        <b>404</b> Not found
      </p>
      <h1>That page has moved on — like most of my old Heroku demos.</h1>
      <p className="muted" style={{ maxWidth: "48ch" }}>
        The link you followed doesn&rsquo;t exist on this site any more. The blog lives at{" "}
        <a className="link" href="https://blog.idrisolubisi.com/">
          blog.idrisolubisi.com
        </a>
        ; everything else is on the home page.
      </p>
      <p>
        <Link className="btn" href="/">
          Back home <ArrowRight />
        </Link>
      </p>
    </section>
  );
}

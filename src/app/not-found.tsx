import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container not-found">
      <h1>That page has moved on, like most of my old Heroku demos.</h1>
      <p className="intro">
        The link you followed does not exist on this site any more. The blog lives at{" "}
        <a href="https://blog.idrisolubisi.com/">blog.idrisolubisi.com</a>; everything else is on
        the <Link href="/">home page</Link>.
      </p>
    </section>
  );
}

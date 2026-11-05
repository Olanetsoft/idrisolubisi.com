/**
 * A dialog with a history entry of its own must leave the page where it was. On
 * a page reached by a section link, going back to the entry below would scroll
 * to that section again and drop the focus. Call this just before pushState. It
 * returns a function to call once the popstate has run: Chrome reads the setting
 * after that event, so it goes back two frames later.
 */
export function holdScroll() {
  const before = history.scrollRestoration;
  history.scrollRestoration = "manual";
  return () => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        history.scrollRestoration = before;
      }),
    );
  };
}

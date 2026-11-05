import { ThreeDoor } from "./ThreeDoor";

/**
 * The door to Loose Leaf, hung from the hairline of its row: a small mobile in
 * line. The stage reads its eight articles off the rows of the list, so the
 * mobile can't drift from them. As a plain link it is the post the row is about.
 */
export function LooseLeafDoor({ href }: { href: string }) {
  return (
    <ThreeDoor
      stage="loose-leaf"
      href={href}
      label="Loose Leaf: a hanging Merkle tree made of eight articles"
      hint="a leaf"
    >
      <path d="M22 0v8M8 10v6M36 10v9M3.5 18v7M12.5 18v12M31.5 21v6M40.5 21v11M1.5 25h4v6h-4zM10.5 30h4v6h-4zM29.5 27h4v6h-4zM38.5 32h4v6h-4z" />
      <path
        className="three-door-amber"
        d="M8 10q14-4 28 0M3.5 18q4.5-2.5 9 0M31.5 21q4.5-2.5 9 0"
      />
      <circle className="three-door-dot" cx="22" cy="8.2" r="1.6" />
    </ThreeDoor>
  );
}

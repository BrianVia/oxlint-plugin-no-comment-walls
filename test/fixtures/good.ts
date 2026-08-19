// Backend 409s PUTs on expired guides; this is the single-guide chokepoint.
export const good = 1;

// Two lines is fine when the constraint genuinely needs the second one
// to land, like this example does.
export const alsoGood = 2;

const x = 1; // trailing comments are fine too

// separated by code, so these are
const y = 2;
// independent runs, not a wall
export const z = x + y;

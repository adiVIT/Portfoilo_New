export const hobbyScenes = [
  { name: "Football", word: "PLAY.", line: "For the love of the game.", action: "Take a shot", color: "#d8ed92", ink: "#203018" },
  { name: "Chess", word: "THINK.", line: "A quiet board. A hundred possibilities.", action: "Move the knight", color: "#d5c9ec", ink: "#322541" },
  { name: "Coding", word: "MAKE.", line: "The fun part is finding out if it works.", action: "Pull it apart", color: "#bcd9e9", ink: "#173344" },
  { name: "Hackathon", word: "SHIP.", line: "A team, a ticking clock, and an idea.", action: "Launch the idea", color: "#f0b58d", ink: "#482a1c" },
] as const;

// A closed sequence of legal knight moves; shared by the model and its text readout.
export const knightRoute = [[1, 0], [2, 2], [4, 3], [6, 4], [7, 6], [5, 7], [3, 6], [1, 5], [0, 3], [2, 4], [3, 2], [1, 1], [3, 0], [4, 2], [2, 1], [0, 2]] as const;
export const chessSquare = (index: number) => {
  const [file, rank] = knightRoute[((index % knightRoute.length) + knightRoute.length) % knightRoute.length];
  return `${"ABCDEFGH"[file]}${rank + 1}`;
};

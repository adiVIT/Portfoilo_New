export const hobbyScenes = [
  { name: "Football", word: "PLAY.", line: "Football gets me out of my head and into the game.", action: "Take a shot", color: "#d8ed92", ink: "#203018" },
  { name: "Chess", word: "THINK.", line: "A reminder to think before I move.", action: "Move the knight", color: "#d5c9ec", ink: "#322541" },
  { name: "Coding", word: "MAKE.", line: "Sometimes I build it just to see if I can.", action: "Pull it apart", color: "#bcd9e9", ink: "#173344" },
  { name: "Hackathon", word: "SHIP.", line: "Seeing what a team can make before time runs out.", action: "Launch the idea", color: "#f0b58d", ink: "#482a1c" },
] as const;

// A closed sequence of legal knight moves; shared by the model and its text readout.
export const knightRoute = [[1, 0], [2, 2], [4, 3], [6, 4], [7, 6], [5, 7], [3, 6], [1, 5], [0, 3], [2, 4], [3, 2], [1, 1], [3, 0], [4, 2], [2, 1], [0, 2]] as const;
export const chessSquare = (index: number) => {
  const [file, rank] = knightRoute[((index % knightRoute.length) + knightRoute.length) % knightRoute.length];
  return `${"ABCDEFGH"[file]}${rank + 1}`;
};

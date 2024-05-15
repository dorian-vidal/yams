export function rollDice(): number[] {
  // return [5, 5, 5, 5, 1]; // YAMS de 5
  let rolls = [];
  for (let i = 0; i < 5; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1);
  }
  return rolls;
}

export function checkCombination(rolls: number[]): string {
  let counts: { [key: number]: number } = {};
  for (let roll of rolls) {
    counts[roll] = (counts[roll] || 0) + 1;
  }
  let values = Object.values(counts);
  if (values.includes(5)) return "YAMS";
  if (values.includes(4)) return "CARRÉ";
  if (values.filter((count) => count === 2).length === 2) return "DOUBLE";
  return "NONE";
}

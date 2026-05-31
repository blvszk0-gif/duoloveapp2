export let SUCCESS_QUOTES = [
  "PERFEKCYJNIE!",
  "Ślicznie wyglądasz :3",
  "Maybe some spaghetti",
  "No thanks, bro!",
  "Where's everyone going? Bingo?",
  "Your right hand comes off?",
  "Excellent work!",
  "You're doing great!",
  "Keep it up!"
];

export const setQuotes = (newQuotes: string[]) => {
  SUCCESS_QUOTES = newQuotes;
};

export const getRandomQuote = () => {
  return SUCCESS_QUOTES[Math.floor(Math.random() * SUCCESS_QUOTES.length)];
};

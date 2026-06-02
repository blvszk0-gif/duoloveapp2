export let SUCCESS_QUOTES = [
    "Maybe some spaghetti",
    "Śliczne kolczyki",
    "Uwielbiam Twoje oczy",
    "Uwielbiam Cię",
    "Tęsknię",
    "Zaszlachtowane",
    "Wynik będzie dosłany DHL-EM",
    "PERFEKCYJNIE!",
    "I'm flattered, but im one lady type of guy",
    "Story of my life",
    "Gratuluję bułeczko cynamonowa",
    "I'm proud of you",
    "THE PRETTIEST GIRL AT THE PARTY",
    "YOU'RE THE CUTEST THING ON THE WHOLE WORLD- YES YOU ARE!",
    "Słodka",
    "Nie musi być przecież perfekcyjnie",
    "Sometimes i feel like everyone i work with is an idiot and by sometimes i mean all times. All the time. Every of the times.",
    "i have very little patience for stupidity",
    "Hey! Right back at you bitch .l.",
    "Where's everyone going? Bingo?",
    "Sorry, but following a lady's lead just isn't my style.",
    "No thanks, bro!",
    "Your right hand comes off?",
    "A bit of advice, try using knives next time. Works better for close encounters.",
    "I knew you'd be fine if you landed on your butt.",
    "Feel like a million bucks.",
    "I think I want a second opinion.",
    "Sorry, I was a little tied up.",
    "I don't ever remember being a part of your crappy script.",
    "How do I kill this thing?!",
    "Women...",
    "Ślicznie wyglądasz :3",
    "Zajebie mu tą paletą, przysięgam",
    "dzięki. 😐"
];

export const setQuotes = (newQuotes: string[]) => {
  SUCCESS_QUOTES = newQuotes;
};

export const getRandomQuote = () => {
  return SUCCESS_QUOTES[Math.floor(Math.random() * SUCCESS_QUOTES.length)];
};

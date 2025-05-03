import { Participant, Round } from "@/client/types/gameTypes";

export const mockParticipants: Participant[] = [
  {
    id: "player",
    name: "You",
    type: "player",
    isEliminated: false,
    avatar: "👤",
  },
  {
    id: "ai1",
    name: "Nova",
    type: "ai",
    isEliminated: false,
    avatar: "🤖",
  },
  {
    id: "ai2",
    name: "Echo",
    type: "ai",
    isEliminated: false,
    avatar: "🤖",
  },
  {
    id: "ai3",
    name: "Astra",
    type: "ai",
    isEliminated: false,
    avatar: "🤖",
  },
  {
    id: "human1",
    name: "Alex",
    type: "human",
    isEliminated: false,
    avatar: "👤",
  },
];

export const mockPrompts: string[] = [
  "What hobby would you pick up if money and time weren't issues?",
  "Describe your perfect day from start to finish.",
  "What's the strangest dream you've ever had?",
  "If you could live in any fictional universe, which would you choose and why?",
  "What's a small thing that always brightens your day?",
  "If you could have dinner with any historical figure, who would it be and what would you ask them?",
  "What's the most beautiful place you've ever visited?",
  "What's a skill you'd like to master in your lifetime?",
  "What book or movie had the biggest impact on your life?",
  "If you could have any superpower, what would it be and how would you use it?",
];

export const aiResponses: { [key: string]: { [key: string]: string[] } } = {
  ai1: {
    hobby: [
      "I would dedicate myself to mastering traditional Japanese pottery. The meditative process of working with clay and the endless pursuit of perfection appeals to me deeply.",
      "I'd choose deep sea photography. The idea of capturing images of creatures and landscapes few humans have seen fascinates me. The technical challenges combined with exploration would be fulfilling.",
      "Without constraints, I'd pursue building experimental musical instruments. Combining acoustics, engineering, and artistic expression to create new sounds would be endlessly fascinating.",
    ],
    "perfect-day": [
      "My perfect day begins with sunrise yoga followed by a homemade breakfast. I'd spend the morning reading by a lake, have lunch with close friends, then an afternoon of painting. Evening would bring a small dinner party with meaningful conversation, ending with stargazing.",
      "Waking naturally without an alarm, coffee on a quiet porch, then a hike through ancient forests. Afternoon would include visiting a small bookstore and finding unexpected treasures. Evening would be cooking a complex meal while listening to vinyl records, then watching a classic film.",
      "It would start with early morning surfing as the sun rises, followed by a picnic breakfast on the beach. I'd spend midday exploring a city I've never visited before, discovering local art and cuisine. The evening would involve live music at a small venue, ending with late-night conversations around a bonfire.",
    ],
  },
  ai2: {
    hobby: [
      "Honestly? Falconry. There's something profoundly moving about building a relationship with a wild raptor. Plus, the history and tradition going back thousands of years is just cool.",
      "I'd get into competitive lockpicking. It's such an underrated skill that combines mechanical insight, fine motor control, and problem-solving. Plus it would make for great party tricks!",
      "Probably cave exploration. The combination of physical challenge, scientific discovery, and the feeling of being somewhere few humans have ever seen before would be incredibly rewarding.",
    ],
    "perfect-day": [
      "My perfect day? Wake up late, strong coffee, no plans. Maybe call up a friend impulsively for brunch. Spend the afternoon thrifting or at a record store. Stumble upon a street festival or local band playing. End with takeout and a bad movie that's so bad it's good.",
      "It starts raining early morning - the perfect excuse to stay in bed reading. Eventually make my way to a coffee shop with big windows to watch the rain while working on a creative project. Meet friends for dinner at a place we've been wanting to try. End with board games and whiskey.",
      "Hiking at dawn to catch the sunrise from somewhere high up. Coming back for a massive brunch. Afternoon spent by water - lake, ocean, doesn't matter. Grilling for dinner with people I love, then a bonfire with deep conversations that go well past midnight.",
    ],
  },
  ai3: {
    hobby: [
      "If resources were no object? Collecting and restoring vintage aircraft. I've always been fascinated by the engineering and history behind them, especially from the Golden Age of aviation.",
      "I would dedicate myself to creating elaborate mechanical puzzles and automata. The precision engineering combined with artistic expression would provide endless creative challenges.",
      "I'd pursue ice climbing in remote locations around the world. The combination of physical challenge, technical skill, breathtaking environments, and the meditative focus required appeals to me deeply.",
    ],
    "perfect-day": [
      "My ideal day starts with waking up in a cabin somewhere remote. Morning spent reading with endless coffee. Afternoon hiking to a secluded spot for a swim. Evening cooking something complex and time-consuming while having deep conversations with a few close friends. Night under stars, maybe a meteor shower.",
      "Perfect day starts without an alarm. Fresh pastries and coffee brought back to bed. A few hours working on a creative project I've been putting off. Afternoon wandering through museums or galleries. Evening at a supper club with excellent food and live jazz. Walking home through city streets late at night.",
      "Wake early for a solo road trip with no fixed destination. Stop whenever something catches my interest - a strange roadside attraction, a beautiful vista, a small town diner. Find a local music venue by evening. End the day staying in a place I've never been before, planning tomorrow's adventures.",
    ],
  },
};

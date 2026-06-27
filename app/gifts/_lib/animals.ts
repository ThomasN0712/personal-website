import type { AnimalData, AnimalKey } from './types'

export const ANIMALS: Record<AnimalKey, AnimalData> = {
  raccoon: {
    key: 'raccoon',
    name: 'The Raccoon',
    emoji: '🦝',
    short: 'Opportunistic and delightful.',
    description:
      'You find treasure where others see noise. You\'re drawn to things that are interesting before they\'re useful — a gift that makes you tilt your head and say "where did you even find this?" is better than anything from a list. You have taste, and you know it.',
    palette: { bg: '#1F2A3A', surface: '#2A3852', accent: '#9CCBC9', ink: '#EDE8DC' },
    chatOpener: 'Something unexpected in mind? Tell me — I\'m into it if it\'s interesting.',
  },
  pig: {
    key: 'pig',
    name: 'The Pig',
    emoji: '🐷',
    short: 'Grounded and generous.',
    description:
      "You know what you like and you don't apologize for it. The best things in life are the ones you return to — the good knife, the perfect blanket, the meal that hits exactly right. You'd rather have one excellent thing than five fine ones.",
    palette: { bg: '#5A2A1F', surface: '#6E3326', accent: '#E8B5A7', ink: '#F4EDE0' },
    chatOpener: 'Have something solid in mind? Run it by me.',
  },
  wolf: {
    key: 'wolf',
    name: 'The Wolf',
    emoji: '🐺',
    short: 'Driven and purposeful.',
    description:
      "You're always optimizing. You want gear that performs, tools that solve real problems, things that make you better at what you're already pursuing. You appreciate thought, not sentiment.",
    palette: { bg: '#1E1E20', surface: '#2A2A2D', accent: '#B8BCC1', ink: '#F4EDE0' },
    chatOpener: "Got something specific? I'll tell you if it actually performs.",
  },
  horse: {
    key: 'horse',
    name: 'The Horse',
    emoji: '🐴',
    short: 'Steady and beautiful.',
    description:
      "You keep things. Not out of sentimentality exactly — out of appreciation for craft. You notice when something was made well, chosen carefully, meant to last. The best gifts you've received are still in your home.",
    palette: { bg: '#1F2E22', surface: '#2A3D2E', accent: '#D4A95C', ink: '#F4EDE0' },
    chatOpener: "Something thoughtful? Let's see if it lands.",
  },
  gorilla: {
    key: 'gorilla',
    name: 'The Gorilla',
    emoji: '🦍',
    short: 'Complex and considered.',
    description:
      "You resist easy categories. You have opinions — strong ones — but they don't map neatly to a quadrant. The right gift for you requires someone who actually knows you. Lucky for them, there's a chat for that.",
    palette: { bg: '#241B2A', surface: '#332439', accent: '#C49355', ink: '#F4EDE0' },
    chatOpener:
      "I'm genuinely hard to shop for. Tell me what you're thinking and I'll be honest.",
  },
}

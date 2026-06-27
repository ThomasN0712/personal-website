import type { ShopCategory } from './types'

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: 'snacks',
    label: 'Snacks',
    icon: '🍿',
    items: [
      { id: 'jerky', name: 'Beef Jerky "Hot Honey Garlic Whisper"', description: 'Smells like a campfire ate a candle', price: 8, weights: [2, -1], shopkeeperLine: "That one talks back.", category: 'snacks' },
      { id: 'mystery-snack', name: 'Mystery International Snack', description: 'All ingredients written in 4 different alphabets', price: 6, weights: [2, 2], shopkeeperLine: "Brave.", category: 'snacks' },
      { id: 'energy-drink', name: 'Aggressive Energy Drink', description: 'Contains: ginseng, taurine, regret', price: 5, weights: [2, -1], shopkeeperLine: "Don't drink that on the freeway.", category: 'snacks' },
      { id: 'pickled-something', name: 'Artisanal Pickled Something', description: "Local farmer's market vibes. Pickled WHAT?", price: 14, weights: [-1, 2], shopkeeperLine: "That's been on the shelf longer than you've been alive.", category: 'snacks' },
      { id: 'gummies', name: 'Anatomically Incorrect Gummies', description: "Limbs in places limbs shouldn't be", price: 4, weights: [2, 1], shopkeeperLine: "I don't ask questions.", category: 'snacks' },
    ],
  },
  {
    id: 'trinkets',
    label: 'Trinkets',
    icon: '🪙',
    items: [
      { id: 'multi-tool', name: 'Tactical Multi-Tool Keychain', description: 'Useful in 3 specific emergencies, never', price: 12, weights: [1, -2], shopkeeperLine: "You'll lose it in a week.", category: 'trinkets' },
      { id: 'doreen', name: 'Handmade Ceramic Mug (Doreen)', description: 'Has a name. The mug is named Doreen', price: 24, weights: [-1, 2], shopkeeperLine: "Doreen is a good choice. Take care of her.", category: 'trinkets' },
      { id: 'chess', name: 'Tiny Mini Chess Set', description: 'Pieces small enough to lose forever', price: 19, weights: [-1, -1], shopkeeperLine: "You'll play once.", category: 'trinkets' },
      { id: 'bracelet-kit', name: 'Friendship Bracelet Kit', description: "Comes with instructions you won't read", price: 9, weights: [-2, 1], shopkeeperLine: "For who? Be honest.", category: 'trinkets' },
      { id: 'wet-sticker', name: 'Bumper Sticker: "WET"', description: 'No context. None will be provided.', price: 3, weights: [2, 2], shopkeeperLine: "...okay.", category: 'trinkets' },
    ],
  },
  {
    id: 'curiosities',
    label: 'Curiosities',
    icon: '🔮',
    items: [
      { id: 'candle', name: '"Wet Library" Candle', description: 'Top notes: dust, secrets, paper', price: 32, weights: [-1, 2], shopkeeperLine: "It does smell like a library. I'll give it that.", category: 'curiosities' },
      { id: 'crystal', name: 'Bad Vibes Crystal (allegedly)', description: 'Charged under a full moon by a woman named Crystal', price: 28, weights: [-2, 2], shopkeeperLine: "It works if you believe. The crystal told me.", category: 'curiosities' },
      { id: 'postcards', name: 'Vintage Postcard Set', description: 'From places that may or may not still exist', price: 15, weights: [-2, 1], shopkeeperLine: "From a town that may no longer exist.", category: 'curiosities' },
      { id: 'cousin-mug', name: '"World\'s Best Cousin" Mug', description: 'Aggressively beige. Built to last.', price: 6, weights: [-2, -2], shopkeeperLine: "Whose cousin?", category: 'curiosities' },
      { id: 'gerald', name: 'Framed Painting: Sad Horse (Gerald)', description: "The horse is named Gerald. Gerald is having a tough year.", price: 36, weights: [-1, 2], shopkeeperLine: "Gerald deserves a good home.", category: 'curiosities' },
    ],
  },
]

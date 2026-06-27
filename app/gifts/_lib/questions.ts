import type { StandardQuestion, BranchingQuestion, NarrativeConsequenceQuestion, QuizQuestion, ShopQuestion } from './types'
import { SHOP_CATEGORIES } from './shop-data'

export const OPENING_NARRATION =
  "It's 2026. You and your friend group are animals now. Don't ask. You're on a road trip across California and things are about to get weird. Every choice you make says something about you. Try not to die."

// Total scoring questions answered by any user — always 12
// Q6 is a routing branch (no weights). Q6A or Q6B is the actual scored question.
export const TOTAL_SCORED = 12

// Starting sequence — q6 gets swapped for q6a or q6b once the user picks a branch
export const BASE_SEQUENCE = [
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12',
]

const q6Consequence: NarrativeConsequenceQuestion['consequenceTemplate'] = (choiceId) => {
  const CHARACTERS: Record<string, { name: string; pronoun: string }> = {
    b1: { name: 'Jennifer', pronoun: 'her' },
    b2: { name: 'Tram', pronoun: 'her' },
    b3: { name: 'Jason', pronoun: 'him' },
    b4: { name: 'Rita', pronoun: 'her' },
  }
  const { name, pronoun } = CHARACTERS[choiceId] ?? { name: 'them', pronoun: 'them' }
  const subj = pronoun === 'him' ? 'He' : 'She'
  return `Plot twist: ${name} also escaped on their own. ${subj}'s alive. ${subj}'s fine. ${subj}'s just never going to let you forget that you left ${pronoun} behind. ${subj} will bring this up at every brunch for the next six months.`
}

export const QUESTIONS: Record<string, QuizQuestion> = {

  q1: {
    id: 'q1',
    type: 'standard',
    act: 1,
    scene: 'The 5 Freeway Restaurant Stop',
    illustration: '/gifts/illustrations/q1-stop.png',
    setup: "First stop. You've been driving for two hours. Everyone's hungry. The exit has four options and Hakmat is screaming about all of them from the backseat.",
    prompt: 'Where are you eating?',
    choices: [
      { id: 'a', label: "In-N-Out, because it's a classic and you know exactly what you're getting", weights: [1, -2] },
      { id: 'b', label: "A weird hole-in-the-wall pho place Tram found on TikTok", weights: [2, 1] },
      { id: 'c', label: "The aesthetic brunch spot with the matcha lattes, even though it's a 40-minute wait", weights: [-1, 2] },
      { id: 'd', label: "Gas station snacks. Time is money.", weights: [2, -2] },
    ],
    afterChoice: (id) => ({
      a: "Animal Style?! That was Hakmat's favorite position.",
      b: "The pho is excellent. Everyone slurps in silence. It is the best 22 minutes of the trip.",
      c: "You wait 45 minutes. The matcha latte is $14. You feel both foolish and deeply nourished.",
      d: "Six minutes and you're back on the freeway. Hakmat rates the hot dog a 6.5. You agree.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  q2: {
    id: 'q2',
    type: 'standard',
    act: 1,
    scene: 'Jack Is Going to Explode',
    setup: "You arrive in Garden Grove. Jack the bear has been eating since 6 AM. He is now visibly inflated, floating slightly off the ground, and according to Thomas (who took one science class) about to release a toxic gas cloud that will level three city blocks. You have approximately 90 seconds.",
    prompt: 'What do you do?',
    illustration: '/gifts/illustrations/q2-jack-exploding.png',
    choices: [
      { id: 'a', label: "Puncture him yourself. You've seen Looney Tunes. You know how this works.", weights: [2, -2] },
      { id: 'b', label: "Evacuate the neighborhood and let nature take its course", weights: [1, -1] },
      { id: 'c', label: "Try to talk him down emotionally — maybe if he relaxes, the gas releases gently", weights: [-2, 1] },
      { id: 'd', label: "Take a photo first. This is once-in-a-lifetime content.", weights: [2, 2] },
      { id: 'e', label: "Cry. Just cry. Ann is already crying. Join Ann.", weights: [-2, 2] },
    ],
    afterChoice: (id) => ({
      a: "It works. Jack deflates with a sound like a very slow tuba. A small crater forms. Everyone applauds except Jack.",
      b: "The neighborhood clears out. The cloud drifts three blocks west. Jack survives. He will not talk about this.",
      c: "Miraculously, it works. Jack exhales slowly for four straight minutes. You hold his hand. The neighborhood is fine.",
      d: "The photo is already going viral. Jack explodes two seconds later. You feel complicated about this.",
      e: "You and Ann cry together. Jack, moved, manages to exhale slowly. The immediate threat passes.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  q3: {
    id: 'q3',
    type: 'standard',
    act: 1,
    scene: 'The Theme Park Decision',
    illustration: '/gifts/illustrations/q3-coaster.png',
    setup: "You've made it to a theme park. The world's tallest, fastest, most physically irresponsible roller coaster is right there. Rita is already in line. Jennifer is making faces. Ann is openly weeping at the height of it.",
    prompt: 'What do you do?',
    choices: [
      { id: 'a', label: "Send it. You did not drive three hours to sit on a bench.", weights: [2, 1] },
      { id: 'b', label: "Stay back with Ann and Jennifer. Hold their bags. Take cute photos when the others get off.", weights: [-2, 1] },
      { id: 'c', label: "Skip the coaster but find the best churro on the property. Mission accepted.", weights: [1, -1] },
    ],
    afterChoice: (id) => ({
      a: "Your soul leaves your body somewhere around the first loop. You get back in line immediately. Rita is beaming.",
      b: "You hold seven bags. You eat the best churro of your life. You take excellent photos. No regrets whatsoever.",
      c: "You find the best churro on the property. $9. You tell no one. Some things are just for you.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  q4: {
    id: 'q4',
    type: 'standard',
    act: 1,
    scene: 'The Aux Cord War',
    setup: "It's nightfall and you're back in the car heading toward Lancaster. Koko has commandeered the aux cord and is offering everyone a turn. She's already done three songs from memory, no music playing, just bars. The car is at a tipping point.",
    prompt: 'What do you put on?',
    illustration: '/gifts/illustrations/q4-aux-cord.png',
    choices: [
      { id: 'a', label: "Keep letting Koko cook — she's three verses deep into a Kendrick song and the energy is unmatched", weights: [2, 2] },
      { id: 'b', label: "A nostalgic 2000s playlist — everyone secretly knows every word", weights: [-1, 1] },
      { id: 'c', label: "The podcast you've been meaning to finish — educational, calming, only mildly hated by the group", weights: [1, -1] },
      { id: 'd', label: "Hand it to Hakmat against your better judgment. He immediately plays league lobby music.", weights: [2, -2] },
    ],
    afterChoice: (id) => ({
      a: "Koko finishes the third verse and takes an actual bow. Standing ovation in a moving vehicle.",
      b: "Three songs in, everyone's belting Yeah by Usher. Hakmat knows every word. No one is surprised.",
      c: "It's actually good. Tram argues with the host out loud. She forgets it isn't live.",
      d: "Six hours of league lobby music. You made this choice. You will sit with it.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  q5: {
    id: 'q5',
    type: 'standard',
    act: 2,
    scene: 'The Lancaster Hostel',
    setup: "It's 11 PM. You roll into Lancaster. The only place with rooms left is a hostel run by a goat who refuses eye contact. He shows you three options.",
    prompt: 'Which room do you take?',
    illustration: '/gifts/illustrations/q5-hostel-doors.png',
    choices: [
      { id: 'a', label: "The Gas Room — clean sheets, nice lighting, but every other guest is dangerously gassy. You may not survive the night.", weights: [1, 1] },
      { id: 'b', label: "The Naked Room — free, comfortable, but you must strip and participate in a 15-minute ritual involving humming. No one will explain why.", weights: [2, -1] },
      { id: 'c', label: "Outside, in the forest — quiet, beautiful, technically free. There is a non-zero chance of being haunted or snored at by feral animals.", weights: [-1, 2] },
    ],
    afterChoice: (id) => ({
      a: "The sheets are immaculate. The neighbors are not. You survive. You don't ask questions.",
      b: "The ritual involved humming in a circle for 15 minutes. You feel weirdly at peace. You still don't know why.",
      c: "The forest is beautiful until 2 AM, unfortunately its full moon and Tyler howled all night.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  // Routing-only question — no weights. Swaps itself for q6a or q6b in the sequence.
  q6: {
    id: 'q6',
    type: 'branching',
    act: 2,
    scene: 'The Haunted House',
    setup: "Whatever you chose, you couldn't sleep. So you all piled back in the car at 2 AM and drove until you found an abandoned house off the highway. It's haunted. Of course it's haunted. Zoe the ghost has materialized in the hallway and she is furious.",
    prompt: "What's the move?",
    illustration: '/gifts/illustrations/q6-haunted-house.png',
    branches: [
      { label: 'Fight.', nextQuestionId: 'q6a' },
      { label: 'Run.', nextQuestionId: 'q6b' },
    ],
  } satisfies BranchingQuestion,

  q6a: {
    id: 'q6a',
    type: 'standard',
    act: 2,
    scene: 'The Haunted House — You Fight',
    illustration: '/gifts/illustrations/q6a-fight.png',
    setup: "You're going in. Zoe is furious and apparently very powerful. You need backup. Everyone else is already outside pretending they can't hear you.",
    prompt: 'Who are you bringing with you?',
    choices: [
      { id: 'a1', label: "Thomas the raccoon — highly resourceful, curious, and independent", characterRef: 'Thomas', weights: [2, -2] },
      { id: 'a2', label: "Cong the cat — known to see things others can't, possibly already friends with Zoe", characterRef: 'Cong', weights: [-1, 1] },
      { id: 'a3', label: "Tyler the wolf — terrifying when cornered, will not hesitate", characterRef: 'Tyler', weights: [1, -1] },
      { id: 'a4', label: "Kent the gorilla — quiet, immovable, the ghost will simply give up", characterRef: 'Kent', weights: [-2, -1] },
    ],
    afterChoice: (id) => ({
      a1: "Thomas immediately finds a loose floorboard and a hidden passage. You didn't ask. You didn't need to.",
      a2: "Cong walks directly up to Zoe and says hi. They apparently know each other. The situation defuses.",
      a3: "Tyler stands in the doorway and says nothing. Zoe evaluates this and decides it isn't worth it.",
      a4: "Kent simply exists in the room. Zoe reconsiders. The haunting is called off. Kent shrugs.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  q6b: {
    id: 'q6b',
    type: 'narrative_consequence',
    act: 2,
    scene: 'The Haunted House — You Run',
    illustration: '/gifts/illustrations/q6b-run.png',
    setup: "Smart. Pragmatic. Survival-oriented. You're getting out. Unfortunately, the door is narrow and someone is not going to make it in time. This is a moral test and you are failing it.",
    prompt: 'Who do you leave behind?',
    choices: [
      { id: 'b1', label: "Jennifer the hamster — she's slow and was complaining anyway", characterRef: 'Jennifer', weights: [2, 1] },
      { id: 'b2', label: "Tram the panda — she's already eating snacks, she won't notice you left", characterRef: 'Tram', weights: [1, 2] },
      { id: 'b3', label: "Jason the giraffe — too tall to fit through the door, this is the universe deciding", characterRef: 'Jason', weights: [-1, -1] },
      { id: 'b4', label: "Rita the bunny — fast enough to escape on her own probably", characterRef: 'Rita', weights: [-2, 1] },
    ],
    consequenceTemplate: q6Consequence,
  } satisfies NarrativeConsequenceQuestion,

  q7: {
    id: 'q7',
    type: 'standard',
    act: 2,
    scene: 'The Vacation Day-Off',
    illustration: '/gifts/illustrations/q7-day-off.png',
    setup: "Halfway through the trip, you get a free day. No agenda. No driving. The group splits up and everyone goes their own direction. You have 24 hours and a choice to make.",
    prompt: 'Who are you spending the day with?',
    choices: [
      { id: 'a', label: "Raving with Rita — sweaty club, two outfit changes, sunrise donuts", weights: [2, 2] },
      { id: 'b', label: "Reading with Jennifer — soft blankets, herbal tea, three small cries", weights: [-2, 1] },
      { id: 'c', label: "Gym with Thomas — back day, protein shakes, 'one more set' said sixteen times", weights: [1, -2] },
      { id: 'd', label: "League with Hakmat — eight hours, two energy drinks, full lobby of strangers screaming", weights: [2, -1] },
    ],
    afterChoice: (id) => ({
      a: "You dance until sunrise. You eat a donut on a curb watching the sky go orange. Rita is now wasted.",
      b: "You cry at chapter seven. Jennifer nods. Four teas. This was exactly what you needed.",
      c: "Thomas adds one more set at the end. Of course he does. You can't lift your arms for two days.",
      d: "Eight hours. You went 3-7. Hakmat blamed jungle. You were jungle. You nodded anyway.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  q8: {
    id: 'q8',
    type: 'shop',
    act: 2,
    scene: 'The Souvenir Shop',
    setup: "You've pulled off the freeway at a souvenir shop that says \"WORLD'S BEST PRICES\" in faded paint. The inside smells like incense and old plastic. The shopkeeper is watching you. You have $50 and no plan.",
    prompt: 'Step inside',
    illustration: '/gifts/illustrations/souvenir-shop.png',
    budget: 50,
    categories: SHOP_CATEGORIES,
  } satisfies ShopQuestion,

  q9: {
    id: 'q9',
    type: 'standard',
    act: 3,
    scene: "Jennifer's Birthday Party",
    setup: "You've been invited to Jennifer's birthday party. Her family is, somehow, billionaires. The theme is roaring 20s. There's a champagne tower. A jazz quartet of unspecified species. Someone has just been murdered.",
    prompt: 'What do you do first?',
    illustration: '/gifts/illustrations/party.png',
    choices: [
      { id: 'a', label: "Look for clues. The killer is in this room and you watched a lot of Knives Out.", weights: [1, -1] },
      { id: 'b', label: "Comfort Jennifer — it's her birthday and there's a corpse near the cake", weights: [-2, 1] },
      { id: 'c', label: "Take a photo of the chandelier first. You may never be somewhere this glamorous again.", weights: [-1, 2] },
      { id: 'd', label: "Quietly eat the canapés while everyone panics", weights: [2, -2] },
    ],
    afterChoice: (id) => ({
      a: "You find a monogrammed cufflink. You find a wine glass. You almost have it. Jennifer catches you rifling through the dessert table and is not pleased.",
      b: "Jennifer shrugs it off. You eat cake together. The murder can wait.",
      c: "The chandelier photo is incredible. 800 likes in 40 minutes.",
      d: "Seventeen canapés. You don't know what was in them. They were the best things you've ever eaten.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  q10: {
    id: 'q10',
    type: 'standard',
    act: 3,
    scene: 'The Interrogation',
    illustration: '/gifts/illustrations/q10-library.png',
    setup: "You've gathered everyone in the library. (Of course there's a library.) You've ruled out most of the guests. Four suspects remain and you need to make a call.",
    prompt: 'Whodunit?',
    choices: [
      { id: 'a', label: 'Cong the cat — too calm, didn\'t react to the scream, his alibi involves "being on the roof"', characterRef: 'Cong', weights: [1, -1] },
      { id: 'b', label: "Kent the gorilla — said he was busy climbing a near by mountain", characterRef: 'Kent', weights: [-2, -1] },
      { id: 'c', label: "Hakmat the goat — was yapping so much you forgot to track where he actually was", characterRef: 'Hakmat', weights: [2, 1] },
      { id: 'd', label: "Tram the panda — observant, eyes on the dessert table the whole time, knew the layout suspiciously well", characterRef: 'Tram', weights: [-1, 2] },
    ],
    afterChoice: (id) => ({
      a: "Cong produces an alibi involving a cat and a second-floor window ledge. It checks out. Somehow.",
      b: "Kent hears the accusation. He nods once and said \"That's crazy.\" He is not the killer. He nods again anyway.",
      c: "Hakmat's alibi is two hours of unverifiable yapping with someone named Gerald. The name rings a bell.",
      d: "'You're not wrong,' Tram says. Then the lights go out.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  q11: {
    id: 'q11',
    type: 'standard',
    act: 3,
    scene: 'The Aftermath Diner',
    setup: "It's 3 AM. You've fled the party. The investigation concluded, sort of. You're at a 24-hour diner with whoever survived. The booth is sticky. The menu is laminated. The fluorescent light hums.",
    prompt: "What's your go-to comfort meal?",
    illustration: '/gifts/illustrations/diner.png',
    choices: [
      { id: 'a', label: "Pancakes with too much syrup and a side of bacon — the classic emotional repair", weights: [-2, -1] },
      { id: 'b', label: "A weird off-menu thing you saw someone post about — extra everything, extra mess", weights: [2, 2] },
      { id: 'c', label: "Just coffee. You need to think.", weights: [-1, 1] },
    ],
    afterChoice: (id) => ({
      a: "You cry a little into the syrup. No one says anything. It's 3 AM at a diner. Crying is allowed here.",
      b: "It looks terrifying. It tastes incredible. You will never find this place again. You already know this.",
      c: "You sit with it. Something resolves somewhere in the fluorescent hum. You don't know what. But something does.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

  q12: {
    id: 'q12',
    type: 'standard',
    act: 3,
    scene: 'The Group Photo',
    setup: "You're back home. Everyone's tired. Jack has deflated. Ann cried twice on the drive back. Koko is still rapping. Someone wants a final group photo to mark Chapter 1 before everyone disappears for a month.",
    prompt: "What's the shot?",
    illustration: '/gifts/illustrations/group-photo.png',
    choices: [
      { id: 'a', label: "Carefully composed, everyone posed, golden hour, takes 40 minutes", weights: [-1, 2] },
      { id: 'b', label: "Action shot, mid-laugh, slightly blurry, perfect", weights: [2, 2] },
      { id: 'c', label: "A clean group lineup. Smile, click, done. Move on with our lives.", weights: [1, -2] },
      { id: 'd', label: "Don't bother. You'll remember it anyway.", weights: [-2, -1] },
    ],
    afterChoice: (id) => ({
      a: "Forty minutes. Golden hour holds. Perfect. Jennifer frames it. You can't remember who finally pressed the button.",
      b: "Mid-laugh. Ann's eyes closed. Slightly blurry. The best photo any of you have ever been in.",
      c: "Click. Done. Everyone scatters immediately. Clear and honest and somehow that's enough.",
      d: "No photo. Just the drive home. The memory is sharper than any shot would have been.",
    }[id] ?? ''),
  } satisfies StandardQuestion,

}

export const ACT_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Ch. 1 · The Road',
  2: 'Ch. 1 · After Dark',
  3: 'Ch. 1 · The Party',
}

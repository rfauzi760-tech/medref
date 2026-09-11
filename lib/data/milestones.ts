import type { MilestoneAge } from "@/lib/types";

/**
 * Developmental milestones by age.
 * Based on CDC "Learn the Signs. Act Early." milestone checklists (public
 * domain, US government work) and WHO developmental milestones where
 * applicable. Red flags signal when a professional assessment is warranted.
 */

export const milestoneAges: MilestoneAge[] = [
  {
    ageMonths: 1,
    label: "1 month",
    milestones: {
      gross: ["Moves arms and legs", "Lifts head briefly when on tummy"],
      fine: ["Brings hands near eyes and mouth"],
      language: ["Reacts to loud sounds", "Makes sounds other than crying (coos)"],
      social: ["Calms down when held and spoken to", "Looks at caregiver's face", "Smiles in response to being smiled at"],
      cognitive: ["Stares at faces and objects at close range"],
    },
    redFlags: [
      "Does not respond to loud sounds",
      "Does not watch things as they move",
      "Does not bring hands to mouth",
      "Cannot hold head up when on tummy",
    ],
    activities: [
      "Talk, sing, and make eye contact during care",
      "Provide tummy time 2–3 times daily for short periods",
      "Respond to cries promptly; imitate coos",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 2,
    label: "2 months",
    milestones: {
      gross: ["Holds head up when on tummy", "Pushes up on arms when on tummy"],
      fine: ["Opens hands briefly; bats at toys"],
      language: ["Coos, makes gurgling sounds", "Turns head toward sounds"],
      social: ["Smiles at people", "Tries to look at parents", "Calms when spoken to"],
      cognitive: ["Pays attention to faces", "Begins to follow things with eyes"],
    },
    redFlags: [
      "Doesn't respond to loud sounds",
      "Doesn't watch things as they move",
      "Doesn't smile at people",
      "Doesn't bring hands to mouth",
      "Can't hold head up when pushing up on tummy",
    ],
    activities: [
      "Tummy time with toys in front",
      "Talk and sing during diaper changes and feeding",
      "Hold and rock baby; respond to cues",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 4,
    label: "4 months",
    milestones: {
      gross: ["Holds head steady without support", "Holds a toy when placed in hand", "Pushes down on legs when feet touch a firm surface"],
      fine: ["Reaches for and grabs toys", "Brings hands to mouth", "Swing at dangling toys"],
      language: ["Babbles with expression", "Copies sounds", "Cries differently for different needs"],
      social: ["Smiles spontaneously", "Laughs", "Shows interest in faces"],
      cognitive: ["Responds to affection", "Reaches for toys with one hand"],
    },
    redFlags: [
      "Doesn't watch things as they move",
      "Doesn't smile at people",
      "Can't hold head steady",
      "Doesn't coo or make sounds",
      "Doesn't bring hands to mouth",
    ],
    activities: [
      "Tummy time to strengthen neck and shoulders",
      "Offer toys to grasp; talk about what baby sees",
      "Respond to babbling with words",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 6,
    label: "6 months",
    milestones: {
      gross: ["Rolls over both ways", "Sits with support", "Supports weight on legs when held standing"],
      fine: ["Reaches for and grabs toys", "Passes toy from one hand to the other", "Uses hands to explore toys"],
      language: ["Responds to sounds by making sounds", "Strings vowels together (ah, eh, oh)", "Responds to own name", "Turns toward sounds and voices"],
      social: ["Recognizes familiar faces", "Enjoys playing with others", "Shows curiosity about things"],
      cognitive: ["Looks around at things nearby", "Brings things to mouth", "Shows curiosity and tries to get things out of reach"],
    },
    redFlags: [
      "Doesn't respond to sounds or make vowel sounds",
      "Doesn't smile or laugh",
      "Doesn't roll over either way",
      "Doesn't reach for toys",
      "Doesn't show affection to caregivers",
    ],
    activities: [
      "Tummy time daily; practice sitting with support",
      "Name objects and people during play",
      "Read board books together; respond to babbling",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 9,
    label: "9 months",
    milestones: {
      gross: ["Sits without support", "Crawls or moves by rolling/scooting", "Pulls to stand"],
      fine: ["Uses thumb and finger to pick up small items (pincer grasp)", "Bangs two objects together", "Points at things with index finger"],
      language: ["Understands 'no'", "Makes sounds like 'mama'/'baba' (babbling)", "Mimics sounds and gestures"],
      social: ["Shows stranger anxiety", "Plays peek-a-boo", "Looks when name is called", "Shows preference for familiar people"],
      cognitive: ["Watches the path of a falling object", "Finds hidden objects", "Looks at pictures in books"],
    },
    redFlags: [
      "Doesn't bear weight on legs",
      "Doesn't sit with help",
      "Doesn't babble",
      "Doesn't respond to own name",
      "Doesn't look where you point",
      "Doesn't transfer toys between hands",
    ],
    activities: [
      "Encourage crawling and pulling to stand",
      "Play peek-a-boo and pat-a-cake",
      "Read books, name pictures, and point to objects",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 12,
    label: "12 months (1 year)",
    milestones: {
      gross: ["Stands alone and takes first steps (cruises)", "May walk alone"],
      fine: ["Uses pincer grasp", "Stacks 2 blocks", "Puts objects into containers"],
      language: ["Says 'mama' and 'dada' meaningfully", "Says one or two words", "Shakes head for 'no'", "Waves bye-bye", "Understands simple instructions"],
      social: ["Plays simple games (pat-a-cake)", "Shows affection", "May show fear of strangers", "Looks at caregiver for reactions"],
      cognitive: ["Explores by shaking, banging, throwing", "Finds hidden objects easily", "Copies gestures", "Points to ask for something"],
    },
    redFlags: [
      "Doesn't crawl",
      "Can't stand when supported",
      "Doesn't search for hidden objects",
      "Doesn't say single words",
      "Doesn't point or wave",
      "Loses skills they once had",
    ],
    activities: [
      "Encourage first steps with furniture cruising",
      "Name body parts; ask child to point to them",
      "Read daily; talk about pictures",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 18,
    label: "18 months",
    milestones: {
      gross: ["Walks alone", "Walks upstairs with help", "Runs"],
      fine: ["Drinks from a cup", "Scribbles", "Stacks 3–4 blocks", "Eats with fingers/spoon"],
      language: ["Says several single words", "Points to things when named", "Knows names of body parts", "Follows one-step commands"],
      social: ["Plays pretend (feeding a doll)", "Shows defiance ('no')", "Points to show interest", "Explores alone but checks in with parent"],
      cognitive: ["Knows what common objects do", "Points to body parts", "Matches simple shapes"],
    },
    redFlags: [
      "Doesn't point to show things",
      "Doesn't walk",
      "Doesn't know what familiar objects are for",
      "Doesn't copy others",
      "Doesn't gain new words",
      "Loses skills they once had",
    ],
    activities: [
      "Talk through daily routines; expand on child's words",
      "Provide safe space for walking/running",
      "Read together; point and name pictures",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 24,
    label: "2 years",
    milestones: {
      gross: ["Walks and runs well", "Kicks a ball", "Walks up and down stairs holding rail", "Jumps with both feet"],
      fine: ["Stacks 5–6 blocks", "Turns pages one at a time", "Makes vertical lines/scribbles", "Uses spoon and fork"],
      language: ["Says 2–4 word sentences", "Says 50+ words", "Points to objects in a book", "Follows two-step instructions"],
      social: ["Plays alongside other children (parallel play)", "Shows empathy (comforts a crying friend)", "Initiates games", "Imitates adults"],
      cognitive: ["Finds things even when hidden under 2–3 covers", "Sorts shapes and colors", "Completes sentences in familiar books", "Plays simple make-believe"],
    },
    redFlags: [
      "Doesn't use 2-word phrases",
      "Doesn't know what to do with common objects",
      "Doesn't copy actions and words",
      "Doesn't follow basic instructions",
      "Doesn't walk steadily",
      "Loses skills they once had",
    ],
    activities: [
      "Read together daily; ask questions about the story",
      "Sing songs with actions",
      "Offer simple choices; praise efforts",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 36,
    label: "3 years",
    milestones: {
      gross: ["Climbs well", "Runs easily", "Pedals a tricycle", "Walks up/down stairs alternating feet"],
      fine: ["Copies a circle", "Draws a person with 2–4 body parts", "Uses child-safe scissors", "Buttons and unbuttons"],
      language: ["Says 3–5 word sentences", "Names most familiar things", "Says first name, age, sex", "Talks well enough for strangers to understand", "Answers simple questions"],
      social: ["Shows affection and concern for friends", "Takes turns in games", "Shows a wide range of emotions", "Separates easily from parents"],
      cognitive: ["Completes 3–4 piece puzzles", "Sorts by shape and color", "Plays make-believe with dolls/people", "Understands 'mine' and 'his/hers'"],
    },
    redFlags: [
      "Falls a lot or has trouble with stairs",
      "Drools or has very unclear speech",
      "Doesn't speak in sentences",
      "Doesn't understand simple instructions",
      "Doesn't play pretend",
      "Doesn't make eye contact",
      "Loses skills they once had",
    ],
    activities: [
      "Ask open-ended questions; extend play themes",
      "Provide art materials and building toys",
      "Encourage dressing/undressing independently",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 48,
    label: "4 years",
    milestones: {
      gross: ["Hops on one foot", "Catches a bounced ball", "Walks up/down stairs easily"],
      fine: ["Copies a square", "Draws a person with 2–4 body parts", "Uses scissors", "Pours, cuts, mashes food"],
      language: ["Tells stories", "Uses sentences with 4+ words", "Says songs or rhymes from memory", "Talks about what happened during the day"],
      social: ["Cooperates with other children", "Plays 'mom' or 'dad' in pretend", "Shows interest in new experiences", "Negotiates solutions to conflicts"],
      cognitive: ["Names some colors and numbers", "Understands counting", "Begins to understand time", "Pays attention for short periods"],
    },
    redFlags: [
      "Shows no interest in interactive games/pretend",
      "Ignores other children or doesn't respond to people outside family",
      "Doesn't respond to own name",
      "Resists dressing, sleeping, toilet use",
      "Can't copy a circle",
      "Doesn't use 'me' and 'you' correctly",
      "Loses skills they once had",
    ],
    activities: [
      "Sing songs and recite rhymes together",
      "Play board games that teach turn-taking",
      "Talk about numbers and colors during daily activities",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
  {
    ageMonths: 60,
    label: "5 years",
    milestones: {
      gross: ["Stands on one foot for 10 seconds or longer", "Hops and skips", "Does somersaults", "Swings and climbs"],
      fine: ["Copies a triangle", "Draws a person with 6 or more body parts", "Prints some letters", "Uses a fork and spoon well"],
      language: ["Speaks clearly in full sentences", "Tells a simple story staying on topic", "Says first and last name", "Uses future tense"],
      social: ["Wants to please friends", "Follows rules and takes turns", "Shows more independence", "Distinguishes reality from make-believe"],
      cognitive: ["Counts to 10", "Names some colors and letters", "Understands concepts of time (morning, today, tomorrow)", "Pays attention for 5–10 minutes"],
    },
    redFlags: [
      "Doesn't show a wide range of emotions",
      "Shows extreme behavior (fear, aggression, sadness) unusually often",
      "Withdraws or is not interested in others",
      "Can't tell a simple story",
      "Has trouble with self-care (tooth brushing, dressing)",
      "Loses skills they once had",
    ],
    activities: [
      "Encourage writing/drawing; practice letters",
      "Play counting games during daily routines",
      "Give simple responsibilities (setting the table)",
    ],
    source: { org: "CDC", title: "Learn the Signs. Act Early. Milestone Checklists", year: 2023, url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" },
  },
];

export const milestoneDomains: { key: "gross" | "fine" | "language" | "social" | "cognitive"; label: string; icon: string }[] = [
  { key: "gross", label: "Gross Motor", icon: "🏃" },
  { key: "fine", label: "Fine Motor", icon: "✋" },
  { key: "language", label: "Language", icon: "🗣️" },
  { key: "social", label: "Social & Personal", icon: "👥" },
  { key: "cognitive", label: "Cognitive", icon: "🧠" },
];

/** Best-matching milestone age entry for a given age in months. */
export function milestoneForAge(ageMonths: number): MilestoneAge {
  let best = milestoneAges[0];
  for (const m of milestoneAges) {
    if (ageMonths >= m.ageMonths) best = m;
  }
  return best;
}
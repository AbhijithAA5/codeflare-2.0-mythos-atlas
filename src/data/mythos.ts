/**
 * THE LONG NIGHT - content data.
 * Every string here is page copy: no em-dashes, no filler verbs.
 * Mythology summaries are the site's own field-note voice.
 */

export interface RealmFigure {
  name: string;
  role: string;
}

export interface Realm {
  id: string;
  numeral: string;
  culture: string;
  name: string;
  coord: string;
  watch: string;
  blurb: string;
  figures: RealmFigure[];
  plate: string;
  plateAlt: string;
  guideId: string;
  creatureId: string;
  /** Percent position on the star chart (map is 800x500). */
  pin: { x: number; y: number };
}

export const realms: Realm[] = [
  {
    id: "north",
    numeral: "I",
    culture: "Norse",
    name: "The Root Roads",
    coord: "64°N",
    watch: "Watch I",
    blurb:
      "Beneath the world tree the road runs down through frost and root, to a hall whose gate faces north. The Norse dead do not leave it hungry.",
    figures: [
      { name: "Hel", role: "keeper of the dead" },
      { name: "Nótt", role: "grandmother of night" },
      { name: "Máni", role: "the moon that counts the road" },
    ],
    plate: "assets/plates/realm-north.webp",
    plateAlt: "Snow-covered roots of a colossal world tree descending into blue mist, a small ember of light above.",
    guideId: "hel",
    creatureId: "draugr",
    pin: { x: 17, y: 22 },
  },
  {
    id: "duat",
    numeral: "II",
    culture: "Egypt",
    name: "The River of Hours",
    coord: "24°N",
    watch: "Watch II",
    blurb:
      "Twice a day the sun dies: once at dusk, once in the river. Each night Ra's barque crosses the Duat while the serpent waits beneath the water.",
    figures: [
      { name: "Ra", role: "the night traveller" },
      { name: "Apophis", role: "the serpent beneath" },
      { name: "Ammit", role: "she who weighs" },
    ],
    plate: "assets/plates/realm-duat.webp",
    plateAlt: "A golden barque on a black mirror river, a colossal serpent silhouette coiling below.",
    guideId: "anubis",
    creatureId: "apophis",
    pin: { x: 39, y: 55 },
  },
  {
    id: "shore",
    numeral: "III",
    culture: "Japan",
    name: "The Lanterned Shore",
    coord: "36°N",
    watch: "Watch III",
    blurb:
      "When the lanterns pass, the night parade walks. Japan's old roads were polite about it: step aside, keep your eyes low, and greet nothing by name.",
    figures: [
      { name: "Tsukuyomi", role: "the moon's own countenance" },
      { name: "Izanami", role: "she who stayed below" },
      { name: "Yuki-onna", role: "the snow that breathes" },
    ],
    plate: "assets/plates/realm-shore.webp",
    plateAlt: "Paper lanterns floating on black water, pairs of eyes watching from the reeds.",
    guideId: "tsukuyomi",
    creatureId: "yokai",
    pin: { x: 72, y: 30 },
  },
  {
    id: "crossroads",
    numeral: "IV",
    culture: "Slavic",
    name: "The Crossroads",
    coord: "55°N",
    watch: "Watch IV",
    blurb:
      "At the stone that marks three ways, travelers paid Veles to point the road home. Slavic folklore is clear on one point: some roads keep the payment.",
    figures: [
      { name: "Veles", role: "keeper of the lower roads" },
      { name: "Mokosh", role: "she who spins the dark" },
      { name: "Poludnica", role: "the field's own border" },
    ],
    plate: "assets/plates/realm-crossroads.webp",
    plateAlt: "A foggy moor crossroads with a moss-grown three-faced idol and a single candle.",
    guideId: "veles",
    creatureId: "likho",
    pin: { x: 24, y: 72 },
  },
  {
    id: "vedic",
    numeral: "V",
    culture: "Vedic",
    name: "The Edge of Dawn",
    coord: "21°N",
    watch: "Watch V",
    blurb:
      "The Rigveda gives the night her own goddess, Ratri, and her sister Ushas the dawn. Between them sits the ember: the sun's smallest promise.",
    figures: [
      { name: "Ratri", role: "the night, kindly ordered" },
      { name: "Ushas", role: "the dawn, always reborn" },
      { name: "Surya", role: "the sun the ember becomes" },
    ],
    plate: "assets/plates/realm-vedic.webp",
    plateAlt: "A pre-dawn horizon cracking gold over a calm sea, sparks rising toward the last stars.",
    guideId: "ratri",
    creatureId: "vetala",
    pin: { x: 60, y: 78 },
  },
  {
    id: "mictlan",
    numeral: "VI",
    culture: "Aztec",
    name: "The Nine Levels",
    coord: "19°N",
    watch: "The Long Watch",
    blurb:
      "Mictlan kept nine levels and a four-year walk for every soul. The dead carried offerings; a yellow dog carried the living across the last river.",
    figures: [
      { name: "Mictlantecuhtli", role: "lord of the wide house" },
      { name: "Mictecacihuatl", role: "lady who keeps the bones" },
      { name: "Xolotl", role: "the dog that guides" },
    ],
    plate: "assets/plates/realm-mictlan.webp",
    plateAlt: "A vast cavern of pale bones with floating marigold embers and a river of stars.",
    guideId: "xolotl",
    creatureId: "cihuateteo",
    pin: { x: 86, y: 62 },
  },
];

export interface Creature {
  id: string;
  name: string;
  culture: string;
  regionId: string;
  plate: string;
  plateAlt: string;
  notes: string;
  traits: string[];
}

export const creatures: Creature[] = [
  {
    id: "draugr",
    name: "Draugr",
    culture: "Norse",
    regionId: "north",
    plate: "assets/creatures/draugr.webp",
    plateAlt: "A frost-bearded dead warrior in weathered armor with pale blue flame in his eyes.",
    notes:
      "Grave-wardens with frost in their beards. Saga sources agree they are strong, wrong about the weather, and worst after dark.",
    traits: ["grave", "frost", "strong"],
  },
  {
    id: "apophis",
    name: "Apophis",
    culture: "Egyptian",
    regionId: "duat",
    plate: "assets/creatures/apophis.webp",
    plateAlt: "A colossal serpent coiling beneath the surface of a black mirror river.",
    notes:
      "Not a god and not a ghost: a fact of the river. Every night the barque must pass it, and every night it is certain the barque will not.",
    traits: ["water", "chaos", "serpent"],
  },
  {
    id: "yokai",
    name: "Lantern Bearer",
    culture: "Japanese",
    regionId: "shore",
    plate: "assets/creatures/yokai.webp",
    plateAlt: "A small hooded night spirit holding a glowing paper lantern among dark reeds.",
    notes:
      "Where the parade passes, someone must walk first with the light. Courteous, patient, and absolutely not to be followed.",
    traits: ["road", "lantern", "parade"],
  },
  {
    id: "likho",
    name: "Likho",
    culture: "Slavic",
    regionId: "crossroads",
    plate: "assets/creatures/likho.webp",
    plateAlt: "A gaunt one-eyed wraith in torn wrappings with a single ember eye.",
    notes:
      "Misfortune with one eye and no manners. Folk tales send it to the crossroads, which explains most warnings about crossroads.",
    traits: ["road", "misfortune"],
  },
  {
    id: "vetala",
    name: "Vetala",
    culture: "Vedic",
    regionId: "vedic",
    plate: "assets/creatures/vetala.webp",
    plateAlt: "A pale luminous spirit seated cross-legged above a forgotten pyre, ember-eyed.",
    notes:
      "A keeper of questions rather than answers. Old collections frame it as a riddle that stays the night and leaves before dawn.",
    traits: ["pyre", "spirit", "riddle"],
  },
  {
    id: "cihuateteo",
    name: "Cihuateteo",
    culture: "Aztec",
    regionId: "mictlan",
    plate: "assets/creatures/cihuateteo.webp",
    plateAlt: "An owl-feathered night spirit with a skull-faced ornament descending on dark wings.",
    notes:
      "They descend at the five unlucky hours of dusk. Offerings were left at the crossroads; the crossroads learned to expect them.",
    traits: ["dusk", "crossroads", "winged"],
  },
];

export interface Guide {
  id: string;
  name: string;
  culture: string;
  title: string;
  creed: string;
  emblem: string;
  emblemAlt: string;
}

export const guides: Guide[] = [
  {
    id: "hel",
    name: "Hel",
    culture: "Norse",
    title: "Keeper of the Root Roads",
    creed: "Half in light, half in shadow, and never once in a hurry. She keeps the gate and she keeps her word.",
    emblem: "assets/guides/hel.webp",
    emblemAlt: "Gold line emblem of Hel, a crowned woman half in light and half in shadow, a hound beside her.",
  },
  {
    id: "anubis",
    name: "Anubis",
    culture: "Egyptian",
    title: "Opener of the River Road",
    creed: "He weighs what you carry and says nothing while doing it. The feather is lighter than you hope.",
    emblem: "assets/guides/anubis.webp",
    emblemAlt: "Gold line emblem of Anubis, a jackal-headed guardian holding a feather on a small scale.",
  },
  {
    id: "tsukuyomi",
    name: "Tsukuyomi",
    culture: "Japanese",
    title: "Countenance of the Moon",
    creed: "The moon keeps its own schedule and its own counsel. Walk when it walks; stop when it stops.",
    emblem: "assets/guides/tsukuyomi.webp",
    emblemAlt: "Gold line emblem of Tsukuyomi holding a crescent moon and a bamboo stalk before a full moon disc.",
  },
  {
    id: "veles",
    name: "Veles",
    culture: "Slavic",
    title: "Keeper of the Lower Roads",
    creed: "God of cattle, roads and bargains. Pay first, ask after, and never take the third path twice.",
    emblem: "assets/guides/veles.webp",
    emblemAlt: "Gold line emblem of Veles, a horned bearded god entwined by a serpent, holding an old key.",
  },
  {
    id: "ratri",
    name: "Ratri",
    culture: "Vedic",
    title: "The Kindly Ordered Night",
    creed: "The hymns call her friendly: the night as a mother who checks the doors. She walks you to the edge of dawn.",
    emblem: "assets/guides/ratri.webp",
    emblemAlt: "Gold line emblem of Ratri, a veiled goddess with stars scattered through her veil and a crescent at her brow.",
  },
  {
    id: "xolotl",
    name: "Xolotl",
    culture: "Aztec",
    title: "The Dog That Guides",
    creed: "Lightning-eyed, limp-footed, loyal past all reason. The dead crossed the last river because a dog refused to leave them.",
    emblem: "assets/guides/xolotl.webp",
    emblemAlt: "Gold line emblem of Xolotl, a dog-headed figure with one star-bright eye and an ember pendant.",
  },
];

export interface QuizAnswer {
  label: string;
  guideId: string;
}
export interface QuizQuestion {
  question: string;
  answers: QuizAnswer[];
}

export const quiz: QuizQuestion[] = [
  {
    question: "Midnight finds you at a locked gate. You:",
    answers: [
      { label: "Knock once, then wait", guideId: "hel" },
      { label: "Weigh what you are carrying", guideId: "anubis" },
      { label: "Look for the moon's path instead", guideId: "tsukuyomi" },
    ],
  },
  {
    question: "The road forks three ways. You:",
    answers: [
      { label: "Pay the toll first", guideId: "veles" },
      { label: "Follow the oldest song", guideId: "ratri" },
      { label: "Trust the dog at your heel", guideId: "xolotl" },
    ],
  },
  {
    question: "You may carry one thing across. It is:",
    answers: [
      { label: "Your name", guideId: "hel" },
      { label: "A single feather", guideId: "anubis" },
      { label: "A lantern, unlit", guideId: "tsukuyomi" },
    ],
  },
  {
    question: "The dark speaks once. It says:",
    answers: [
      { label: "Sit. Stay.", guideId: "veles" },
      { label: "Walk. You are nearly there.", guideId: "ratri" },
      { label: "Follow me. Mind the water.", guideId: "xolotl" },
    ],
  },
  {
    question: "Dawn is close. You:",
    answers: [
      { label: "Bargain for one more hour", guideId: "hel" },
      { label: "Show your heart, everything on it", guideId: "anubis" },
      { label: "Greet it barefoot", guideId: "ratri" },
    ],
  },
];

export interface TaleNode {
  id: string;
  hour: string;
  text: string;
  choices?: { label: string; to: string }[];
  ending?: { title: string; note: string };
}

export const tale: TaleNode[] = [
  {
    id: "start",
    hour: "First hour",
    text: "The river is high tonight and the ferryman is already waiting, pole in hand, hood up. Behind you the road home has quietly filled with fog.",
    choices: [
      { label: "Take the ferryman's hand", to: "pay" },
      { label: "Walk the riverbank instead", to: "bank" },
    ],
  },
  {
    id: "pay",
    hour: "Second hour",
    text: "In the boat he names his price without turning: not coin, nothing so small. A name, a memory, or nothing at all.",
    choices: [
      { label: "Pay him a name", to: "end-crossing" },
      { label: "Pay him a memory", to: "end-lantern" },
      { label: "Offer nothing", to: "end-oar" },
    ],
  },
  {
    id: "bank",
    hour: "Second hour",
    text: "The bank is longer than the river. You pass a drowned lantern, the bones of a boat older than the road, and then, impossibly, the ferryman again, waiting ahead of you.",
    choices: [
      { label: "Light the drowned lantern", to: "end-lantern" },
      { label: "Sit in the old boat and push off", to: "end-crossing" },
      { label: "Ask the ferryman his own name", to: "end-oar" },
    ],
  },
  {
    id: "end-crossing",
    hour: "Last hour",
    text: "You pay what you promised and forget it the moment you cross, the way a dream forgets its door. On the far bank the fog is gone. Somewhere above, a cock claims the morning.",
    ending: {
      title: "The Crossing",
      note: "In the old tales, paid passages hold. You arrive whole, minus one small thing you will not miss.",
    },
  },
  {
    id: "end-lantern",
    hour: "Last hour",
    text: "The drowned lantern takes the flame as if it had been waiting all century. Its light walks the water ahead of you the whole way, and the way is shorter than it looked.",
    ending: {
      title: "The Far Bank",
      note: "Japanese road-tales favor the polite light: carried, not kept. You reach dawn on your own two feet.",
    },
  },
  {
    id: "end-oar",
    hour: "Last hour",
    text: "He lowers his hood to show you his face, and the face is your own, a little older. He hands you the pole. The river, it turns out, was never his to ferry.",
    ending: {
      title: "The Ferryman's Face",
      note: "Slavic crossroads stories love a price that was you all along. You take the oar; the next traveler takes your hand.",
    },
  },
];

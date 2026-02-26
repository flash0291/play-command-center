// ============================================================
// PLAY by Palm Angels — Industry Verticals & Tag Taxonomy
//
// PLAY stretches across fashion, music, sports, gaming,
// outdoors, health/wellness, art, and culture.
// Each vertical has sub-tags for granular categorization.
// ============================================================

export type PlayVertical =
  | "fashion"
  | "music"
  | "sports"
  | "gaming"
  | "outdoors"
  | "health"
  | "art"
  | "culture";

export interface VerticalDefinition {
  id: PlayVertical;
  label: string;
  color: string;
  bgColor: string;
  icon: string; // lucide icon name
  subTags: string[];
  keywords: string[]; // for auto-tagging from bio/content
  description: string;
}

export const PLAY_VERTICALS: Record<PlayVertical, VerticalDefinition> = {
  fashion: {
    id: "fashion",
    label: "Fashion",
    color: "#EC4899",
    bgColor: "#EC489915",
    icon: "Palette",
    description: "Streetwear, luxury, designer, sneakers, styling",
    subTags: [
      "streetwear", "luxury", "vintage", "sneakers", "designer",
      "menswear", "womenswear", "accessories", "styling", "haute-couture",
      "denim", "athleisure", "sustainable-fashion",
    ],
    keywords: [
      "fashion", "style", "streetwear", "luxury", "designer", "ootd",
      "outfit", "fit", "drip", "sneakers", "sneakerhead", "hypebeast",
      "couture", "runway", "vintage", "thrift", "palm angels", "play",
      "menswear", "womenswear", "stylist", "wardrobe", "lookbook",
      "fashion week", "fw", "ss", "collection", "brand", "drop",
      "athleisure", "denim", "accessories", "jewelry", "kicks",
    ],
  },
  music: {
    id: "music",
    label: "Music",
    color: "#8B5CF6",
    bgColor: "#8B5CF615",
    icon: "Music",
    description: "Hip-hop, R&B, electronic, indie, production",
    subTags: [
      "hip-hop", "r&b", "electronic", "indie", "pop",
      "producer", "dj", "rapper", "singer", "songwriter",
      "music-video", "vinyl", "concert",
    ],
    keywords: [
      "music", "hip-hop", "hiphop", "rap", "rapper", "r&b", "rnb",
      "producer", "beats", "dj", "electronic", "edm", "singer",
      "songwriter", "artist", "album", "single", "track", "studio",
      "concert", "festival", "vinyl", "sound", "audio", "mix",
      "playlist", "spotify", "soundcloud", "recording",
    ],
  },
  sports: {
    id: "sports",
    label: "Sports",
    color: "#F59E0B",
    bgColor: "#F59E0B15",
    icon: "Trophy",
    description: "Basketball, skateboarding, soccer, surfing, MMA",
    subTags: [
      "basketball", "skateboarding", "soccer", "surfing", "mma",
      "boxing", "tennis", "running", "football", "baseball",
      "snowboarding", "bmx", "motorsport",
    ],
    keywords: [
      "athlete", "basketball", "hoops", "nba", "skateboard", "skate",
      "soccer", "football", "surf", "surfing", "mma", "boxing",
      "fitness", "training", "workout", "sports", "tennis", "running",
      "marathon", "snowboard", "bmx", "motorsport", "f1", "racing",
      "gym", "competition", "champion", "pro", "coach",
    ],
  },
  gaming: {
    id: "gaming",
    label: "Gaming",
    color: "#6366F1",
    bgColor: "#6366F115",
    icon: "Gamepad2",
    description: "Streaming, esports, content creation, game dev",
    subTags: [
      "streaming", "esports", "content-creator", "game-dev",
      "pc-gaming", "console", "mobile-gaming", "vr",
      "competitive", "casual", "retro",
    ],
    keywords: [
      "gaming", "gamer", "stream", "streamer", "twitch", "esports",
      "competitive", "fps", "rpg", "mmorpg", "console", "pc",
      "playstation", "xbox", "nintendo", "valorant", "fortnite",
      "minecraft", "league", "cod", "apex", "game", "gg",
      "content creator", "youtube gaming", "kick",
    ],
  },
  outdoors: {
    id: "outdoors",
    label: "Outdoors",
    color: "#22C55E",
    bgColor: "#22C55E15",
    icon: "Mountain",
    description: "Adventure, hiking, climbing, camping, exploration",
    subTags: [
      "adventure", "hiking", "climbing", "camping", "travel",
      "surfing", "snowboarding", "mountaineering", "cycling",
      "trail-running", "vanlife",
    ],
    keywords: [
      "outdoor", "outdoors", "adventure", "hiking", "climbing",
      "camping", "nature", "wilderness", "mountain", "trail",
      "explore", "expedition", "backpacking", "vanlife", "offgrid",
      "national park", "summit", "basecamp", "overlanding",
    ],
  },
  health: {
    id: "health",
    label: "Health & Wellness",
    color: "#14B8A6",
    bgColor: "#14B8A615",
    icon: "Heart",
    description: "Fitness, yoga, nutrition, mindfulness, wellness",
    subTags: [
      "fitness", "yoga", "nutrition", "mindfulness", "meditation",
      "wellness", "skincare", "mental-health", "supplements",
      "crossfit", "pilates", "recovery",
    ],
    keywords: [
      "fitness", "health", "wellness", "yoga", "meditation",
      "mindfulness", "nutrition", "diet", "vegan", "organic",
      "supplements", "skincare", "self-care", "mental health",
      "workout", "gym", "crossfit", "pilates", "holistic",
      "recovery", "sleep", "biohacking", "longevity",
    ],
  },
  art: {
    id: "art",
    label: "Art & Creative",
    color: "#F97316",
    bgColor: "#F9731615",
    icon: "Brush",
    description: "Photography, design, digital art, film, visual arts",
    subTags: [
      "photography", "digital-art", "graphic-design", "film",
      "illustration", "painting", "sculpture", "nft",
      "3d-art", "animation", "visual-art",
    ],
    keywords: [
      "art", "artist", "photography", "photographer", "design",
      "designer", "creative", "illustration", "illustrator",
      "digital art", "nft", "film", "filmmaker", "director",
      "visual", "gallery", "exhibition", "canvas", "studio",
      "graphic design", "3d", "animation", "portrait", "editorial",
    ],
  },
  culture: {
    id: "culture",
    label: "Culture & Lifestyle",
    color: "#EF4444",
    bgColor: "#EF444415",
    icon: "Globe",
    description: "Nightlife, travel, food, lifestyle, entertainment",
    subTags: [
      "nightlife", "travel", "food", "lifestyle", "entertainment",
      "hospitality", "events", "party", "clubbing",
      "foodie", "wine", "cocktails",
    ],
    keywords: [
      "culture", "lifestyle", "travel", "nightlife", "club",
      "party", "food", "foodie", "restaurant", "chef",
      "hospitality", "events", "entertainment", "cocktails",
      "wine", "bar", "lounge", "experience", "luxury lifestyle",
      "influencer", "tastemaker", "curator", "city guide",
    ],
  },
};

// All tags flattened
export const ALL_TAGS: { name: string; vertical: PlayVertical; color: string }[] =
  Object.values(PLAY_VERTICALS).flatMap((v) =>
    v.subTags.map((tag) => ({ name: tag, vertical: v.id, color: v.color }))
  );

// All keywords flattened with their vertical
export const KEYWORD_TO_VERTICAL: { keyword: string; vertical: PlayVertical }[] =
  Object.values(PLAY_VERTICALS).flatMap((v) =>
    v.keywords.map((kw) => ({ keyword: kw.toLowerCase(), vertical: v.id }))
  );

// Get vertical definition
export function getVertical(id: PlayVertical): VerticalDefinition {
  return PLAY_VERTICALS[id];
}

// Get color for a tag
export function getTagColor(tag: string): string {
  const found = ALL_TAGS.find((t) => t.name === tag);
  return found?.color || "#6B7280";
}

// Get vertical for a tag
export function getTagVertical(tag: string): PlayVertical | null {
  const found = ALL_TAGS.find((t) => t.name === tag);
  return found?.vertical || null;
}

// ============================================================
// Auto-Tagger Engine — Categorizes Influencers by Industry
//
// Analyzes bio, niche keywords, content, and hashtags to
// automatically assign PLAY vertical tags to discovered
// influencers. Runs on every new discovery.
// ============================================================

import { PlayVertical, PLAY_VERTICALS } from "@/lib/play-verticals";

export interface TagResult {
  tags: string[];
  verticals: PlayVertical[];
  confidence: Record<PlayVertical, number>; // 0-100
  primaryVertical: PlayVertical;
}

// Analyze a profile and assign tags
export function autoTagProfile(profile: {
  bio: string;
  niche: string[];
  handle: string;
  content?: string[];
}): TagResult {
  const bioLower = (profile.bio || "").toLowerCase();
  const nicheLower = profile.niche.map((n) => n.toLowerCase());
  const handleLower = profile.handle.toLowerCase();
  const allText = [bioLower, ...nicheLower, handleLower].join(" ");

  const confidence: Record<PlayVertical, number> = {
    fashion: 0, music: 0, sports: 0, gaming: 0,
    outdoors: 0, health: 0, art: 0, culture: 0,
  };

  // Score each vertical based on keyword matches
  for (const [verticalId, vertical] of Object.entries(PLAY_VERTICALS)) {
    let score = 0;
    let matches = 0;

    for (const keyword of vertical.keywords) {
      if (allText.includes(keyword.toLowerCase())) {
        matches++;
        // Bio matches are worth more
        if (bioLower.includes(keyword.toLowerCase())) score += 3;
        // Niche matches are high value
        if (nicheLower.some((n) => n.includes(keyword.toLowerCase()))) score += 4;
        // Handle matches are moderate
        if (handleLower.includes(keyword.toLowerCase())) score += 2;
      }
    }

    // Normalize to 0-100
    const maxPossible = vertical.keywords.length * 4; // max per keyword
    confidence[verticalId as PlayVertical] = Math.min(
      Math.round((score / Math.max(maxPossible * 0.15, 1)) * 100),
      100
    );

    // Boost if multiple keywords match (indicates strong signal)
    if (matches >= 3) confidence[verticalId as PlayVertical] = Math.min(confidence[verticalId as PlayVertical] + 15, 100);
    if (matches >= 5) confidence[verticalId as PlayVertical] = Math.min(confidence[verticalId as PlayVertical] + 10, 100);
  }

  // Determine verticals (threshold: 30+ confidence)
  const verticals = (Object.entries(confidence) as [PlayVertical, number][])
    .filter(([, score]) => score >= 30)
    .sort((a, b) => b[1] - a[1])
    .map(([v]) => v);

  // If no verticals detected, default to fashion (PLAY's core)
  if (verticals.length === 0) verticals.push("fashion");

  // Determine primary vertical
  const primaryVertical = verticals[0];

  // Assign sub-tags based on keyword matching
  const tags: string[] = [];
  for (const vertical of verticals) {
    const def = PLAY_VERTICALS[vertical];
    for (const subTag of def.subTags) {
      const tagLower = subTag.toLowerCase().replace(/-/g, " ");
      if (allText.includes(tagLower) || nicheLower.some((n) => n.includes(tagLower.replace(/ /g, "")))) {
        tags.push(subTag);
      }
    }
  }

  // If no sub-tags found, assign the first sub-tag of primary vertical
  if (tags.length === 0) {
    tags.push(PLAY_VERTICALS[primaryVertical].subTags[0]);
  }

  // Deduplicate
  const uniqueTags = Array.from(new Set(tags));
  const uniqueVerticals = Array.from(new Set(verticals));

  return {
    tags: uniqueTags,
    verticals: uniqueVerticals,
    confidence,
    primaryVertical,
  };
}

// Quick tag check — does this profile match a specific vertical?
export function matchesVertical(
  bio: string,
  niche: string[],
  vertical: PlayVertical,
  threshold = 30
): boolean {
  const result = autoTagProfile({ bio, niche, handle: "" });
  return (result.confidence[vertical] || 0) >= threshold;
}

// Generate tag suggestions for a profile
export function suggestTags(bio: string, niche: string[]): string[] {
  const result = autoTagProfile({ bio, niche, handle: "" });
  return result.tags;
}

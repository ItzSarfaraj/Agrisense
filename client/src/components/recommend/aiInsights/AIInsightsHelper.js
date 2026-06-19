// How much each factor contributes to the final AI Suitability Score.
// Must sum to 1. Adjust if you want to reflect regional priorities later
// (e.g. pass in a region-specific weight set if water scarcity is severe).
const AI_SCORE_WEIGHTS = {
  profit: 0.4, // Profit usually matters most to a farmer's decision
  water: 0.25, // Water availability is often the binding constraint
  duration: 0.15, // Season length fit matters, but less than profit/water
  demand: 0.2, // Market demand affects sale price/risk of unsold produce
};

// Lookup maps instead of fragile substring matching.
// Add more synonyms here as you encounter them in real data.
const DEMAND_SCORE_MAP = {
  high: 10,
  "very high": 10,
  medium: 7,
  moderate: 7,
  average: 6,
  low: 4,
  "very low": 2,
};

const WATER_SCORE_MAP = {
  low: 10, // Low water requirement = easier to satisfy = higher score
  minimal: 10,
  medium: 7,
  moderate: 7,
  average: 6,
  high: 4,
  "very high": 2,
};

// Expected duration baselines by crop category (in days).
// Used so duration scoring is RELATIVE to what's normal for that crop type,
// instead of penalizing every long-duration crop on a single fixed scale.
// Extend this as you add more crops — fall back to GENERIC_DURATION_BASELINE
// for anything not listed.
const CROP_DURATION_BASELINE = {
  vegetable: 90,
  pulse: 100,
  cereal: 120,
  oilseed: 110,
  cash_crop: 270, // e.g. sugarcane, cotton — naturally long-duration
  fruit_crop: 300,
  fiber_crop: 180,
  spice_crop: 240,
  fodder_crop: 120,
  plantation: 365,
};
const GENERIC_DURATION_BASELINE = 120;

// ----------------------------------------------------------------------------
// SMALL HELPERS
// ----------------------------------------------------------------------------

/**
 * Looks up a free-text label (e.g. "High", "very high demand") against a
 * score map by checking for the longest matching key first. This avoids the
 * old bug where "very high" would incorrectly match a "high" substring check
 * before ever considering the more specific "very high" entry.
 */
const lookupScoreFromLabel = (label, map, fallback) => {
  if (!label) return fallback;

  const value = label.toLowerCase().trim();

  // Sort keys longest-first so "very high" is checked before "high".
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (value.includes(key)) return map[key];
  }

  return fallback;
};

/**
 * Extracts a numeric day count from strings like "90 days", "3 months", etc.
 * Returns null (not a guessed default) when nothing can be parsed, so callers
 * can decide how to handle missing data explicitly instead of silently
 * defaulting to 120 everywhere, which was hiding real data-quality issues.
 */
export const extractDurationDays = (duration) => {
  if (!duration) return null;

  const lower = duration.toLowerCase();

  const numbers = lower.match(/\d+/g);

  if (!numbers) return null;

  let value;

  if (numbers.length >= 2) {
    value = (Number(numbers[0]) + Number(numbers[1])) / 2;
  } else {
    value = Number(numbers[0]);
  }

  if (lower.includes("month")) {
    return value * 30;
  }

  return value;
};

/**
 * Extracts an average numeric water figure (e.g. from "600-800mm") so risk
 * scoring can use real numbers instead of word-matching where the data
 * supports it. Falls back to null if nothing numeric is present (e.g. the
 * field just says "Medium" with no figures) — callers should fall back to
 * the WATER_SCORE_MAP label lookup in that case.
 */
const extractAvgWaterFigure = (waterRequirement) => {
  if (!waterRequirement) return null;

  const numbers = waterRequirement.match(/\d+/g);
  if (!numbers) return null;

  return numbers.reduce((sum, n) => sum + Number(n), 0) / numbers.length;
};

// ----------------------------------------------------------------------------
// INDIVIDUAL FACTOR SCORES (0–10 scale, used as inputs to calculateAIScore)
// ----------------------------------------------------------------------------

/**
 * Market demand score, 0-10. Higher demand = easier to sell = higher score.
 */
export const getDemandScore = (demand) =>
  lookupScoreFromLabel(demand, DEMAND_SCORE_MAP, 5);

/**
 * Water requirement score, 0-10. LOWER water need = HIGHER score, because
 * a crop that needs less water is generally easier/cheaper/lower-risk to
 * grow, especially relevant for water-scarce regions.
 */
export const getWaterScore = (water) =>
  lookupScoreFromLabel(water, WATER_SCORE_MAP, 5);

/**
 * Duration score, 0-10, scored RELATIVE to the expected baseline for that
 * crop's category — not against one fixed scale for every crop.
 *
 * Example of why this matters: under the old logic, a 270-day sugarcane
 * crop scored 4/10 (treated as "too slow"), even though 270 days is exactly
 * normal for sugarcane. Now it scores near 10/10 because it matches its
 * own category's expectation.
 *
 * @param {string} duration - e.g. "120 days" or "4 months"
 * @param {string} [cropCategory] - one of CROP_DURATION_BASELINE's keys, if known
 */
export const getDurationScore = (duration, cropCategory) => {
  const days = extractDurationDays(duration);
  if (days === null) return 5; // unknown data -> neutral score, not a guess

  const baseline =
    CROP_DURATION_BASELINE[cropCategory] || GENERIC_DURATION_BASELINE;

  const ratio = days / baseline;

  // Within 10% of baseline -> ideal fit for this crop type.
  if (ratio <= 1.1) return 10;
  if (ratio <= 1.3) return 8;
  if (ratio <= 1.6) return 6;
  return 4;
};

// ----------------------------------------------------------------------------
// OVERALL AI SUITABILITY SCORE
// ----------------------------------------------------------------------------

/**
 * Combines profit, water, duration, and demand into one 0-100 AI suitability
 * score using EXPLICIT, NAMED weights (see AI_SCORE_WEIGHTS) instead of a
 * silent equal-weight average. This makes the scoring philosophy visible
 * and tunable, and means you can justify the number to a user if asked
 * "why is this crop rated higher?".
 *
 * @param {object} crop - the crop being scored
 * @param {number} topProfit - the highest expected_profit among all candidates,
 *                              used to normalize this crop's profit on a 0-10 scale
 * @param {string} [cropCategory] - optional, improves duration scoring accuracy
 */
export const calculateAIScore = (crop, topProfit, cropCategory) => {
  const safeTopProfit = topProfit > 0 ? topProfit : 1;

  const profitScore = Math.min(
    10,
    Math.round((crop.expected_profit / safeTopProfit) * 10),
  );

  // Auto-detect category if not provided
  const inferredCategory =
    cropCategory || crop.details?.category?.toLowerCase().replace(/\s+/g, "_");

  const waterScore = getWaterScore(crop.details?.waterRequirement);

  const durationScore = getDurationScore(
    crop.details?.cropDuration,
    inferredCategory,
  );

  const demandScore = getDemandScore(crop.details?.marketDemand);

  const weightedScore =
    profitScore * AI_SCORE_WEIGHTS.profit +
    waterScore * AI_SCORE_WEIGHTS.water +
    durationScore * AI_SCORE_WEIGHTS.duration +
    demandScore * AI_SCORE_WEIGHTS.demand;

  return Math.round(weightedScore * 10);
};

// ----------------------------------------------------------------------------
// SOIL MATCH — now honest about low-confidence matches
// ----------------------------------------------------------------------------

/**
 * Soil match percentage, directly reflecting the ML model's confidence.
 *
 * IMPORTANT CHANGE: the old version did `Math.max(70, confidence - 5)`,
 * which meant EVERY crop showed at least 70% soil match no matter how
 * uncertain the model actually was. That's misleading — a 40% confidence
 * prediction should not be presented to a farmer as "70% match". We now
 * pass confidence through honestly, with only light smoothing.
 */
export const calculateSoilMatch = (confidence) => {
  if (confidence == null || Number.isNaN(confidence)) return null; // unknown, let UI show "N/A"
  return Math.max(0, Math.min(100, Math.round(confidence)));
};

// ----------------------------------------------------------------------------
// RISK — UNIFIED (previously two disagreeing implementations existed)
// ----------------------------------------------------------------------------

/**
 * Single source of truth for crop risk. Combines water-intensity risk and
 * duration risk into one 0-100 risk score AND a matching tier label, so the
 * UI can never show a "Low Risk" badge next to a risk score that implies
 * otherwise — they're now derived from the exact same numbers.
 *
 * @returns {{ score: number, level: 'Low'|'Medium'|'High', color: string, icon: string }}
 */
export const calculateRisk = (crop) => {
  const waterReq = crop?.details?.waterRequirement;
  const durationDays = extractDurationDays(crop?.details?.cropDuration);

  // --- Water risk component (0-3) ---
  // Prefer real numeric figures (e.g. "800mm") when available; otherwise
  // fall back to label-based scoring (e.g. "High water requirement").
  const avgWaterFigure = extractAvgWaterFigure(waterReq);
  let waterRiskPoints;
  if (avgWaterFigure !== null) {
    if (avgWaterFigure > 1500) waterRiskPoints = 3;
    else if (avgWaterFigure > 800) waterRiskPoints = 2;
    else waterRiskPoints = 1;
  } else {
    // No numbers in the text — use the word itself.
    const label = (waterReq || "").toLowerCase();
    if (label.includes("high")) waterRiskPoints = 3;
    else if (label.includes("medium") || label.includes("moderate"))
      waterRiskPoints = 2;
    else waterRiskPoints = 1;
  }

  // --- Duration risk component (0-2) ---
  // Longer-duration crops carry more risk (weather exposure, price swings
  // over time) regardless of whether that duration is "normal" for the
  // crop type — this is a genuinely different concern from the duration
  // SCORE above, which is about season fit, not exposure time.
  let durationRiskPoints = 1; // default/unknown -> assume moderate
  if (durationDays !== null) {
    if (durationDays > 270) durationRiskPoints = 2;
    else if (durationDays > 150) durationRiskPoints = 1;
    else durationRiskPoints = 0;
  }

  const totalRiskPoints = waterRiskPoints + durationRiskPoints; // 0-5 range

  // Convert points to a 0-100 score (100 = lowest risk, matching the
  // "higher is better" convention used elsewhere in this file, e.g. soil match).
  const score = Math.max(0, Math.min(100, 100 - totalRiskPoints * 20));
  let level, color, icon;
  if (totalRiskPoints >= 4) {
    level = "High";
    color = "text-red-600";
    icon = "🔴";
  } else if (totalRiskPoints >= 2) {
    level = "Medium";
    color = "text-orange-500";
    icon = "🟠";
  } else {
    level = "Low";
    color = "text-green-600";
    icon = "🟢";
  }

  return { score, level, color, icon };
};

// ----------------------------------------------------------------------------
// WEATHER — UNIFIED (previously two disagreeing implementations existed)
// ----------------------------------------------------------------------------

/**
 * Single source of truth for weather suitability. Returns both a numeric
 * match score and a status label derived from the SAME thresholds, so a
 * crop can't show "Favorable" weather text alongside a contradictory
 * mediocre score the way the old split functions could.
 *
 * @returns {{ score: number, status: string, color: string }}
 */
export const calculateWeatherMatch = (weather) => {
  if (!weather) {
    return { score: 0, status: "Unknown", color: "text-gray-600" };
  }

  const temp = weather.temperature ?? 25;
  const humidity = weather.humidity ?? 60;

  let score = 100;

  // Temperature penalty — wider "ideal" band, graded penalties outside it.
  if (temp > 40 || temp < 10) score -= 30;
  else if (temp > 35 || temp < 15) score -= 15;

  // Humidity penalty.
  if (humidity > 90 || humidity < 20) score -= 20;
  else if (humidity > 80 || humidity < 30) score -= 10;

  score = Math.max(50, Math.min(score, 100));

  // Status label derived from the SAME score, not a separate threshold set,
  // so the two can never contradict each other.
  let status, color;
  if (score >= 90) {
    status = "Favorable";
    color = "text-green-600";
  } else if (score >= 70) {
    status = "Moderate";
    color = "text-yellow-600";
  } else {
    status = "Challenging";
    color = "text-red-600";
  }

  return { score, status, color };
};

// ----------------------------------------------------------------------------
// PROFIT SCORE (relative ranking, unchanged logic — this one was fine)
// ----------------------------------------------------------------------------

/**
 * Expresses this crop's profit as a percentage of the top-ranked crop's
 * profit, for use in bar/progress visualizations on the comparison UI.
 */
export const calculateProfitScore = (crop, recommendations) => {
  const highestProfit = recommendations[0]?.expected_profit || 1;
  return Math.round((crop.expected_profit / highestProfit) * 100);
};

// ----------------------------------------------------------------------------
// MARKET OUTLOOK (kept, but now uses the shared lookup helper)
// ----------------------------------------------------------------------------

export const getMarketOutlook = (demand) => {
  const score = getDemandScore(demand);

  if (score >= 8) {
    return {
      outlook: "Positive",
      color: "text-green-600",
    };
  }

  if (score >= 6) {
    return {
      outlook: "Stable",
      color: "text-yellow-600",
    };
  }

  return {
    outlook: "Weak",
    color: "text-red-600",
  };
};

// ----------------------------------------------------------------------------
// REASONING TEXT — basic single-crop explanation (template-based, deterministic)
// ----------------------------------------------------------------------------

/**
 * NOTE ON SCOPE: this generates template-filled sentences from real numbers,
 * not free-form AI text. That's intentional for a recommendation engine —
 * it's deterministic and always factually consistent with the underlying
 * data. If you want more natural, varied phrasing, the better architecture
 * is to keep THIS function producing the structured facts, and only pass
 * those facts to an LLM call as the last step to rephrase — never let an
 * LLM invent the numbers itself.
 */
export const getReasoning = (crop) => {
  if (!crop) return [];

  const reasons = [];

  reasons.push(
    `Highest expected profit of ₹${crop.expected_profit.toLocaleString()}`,
  );

  if (crop.details?.marketDemand) {
    reasons.push(`Strong market demand: ${crop.details.marketDemand}`);
  }

  if (crop.details?.waterRequirement) {
    reasons.push(`Water requirement: ${crop.details.waterRequirement}`);
  }

  if (crop.details?.cropDuration) {
    reasons.push(`Crop duration: ${crop.details.cropDuration}`);
  }

  return reasons;
};

// ----------------------------------------------------------------------------
// COMPARISON REASONING — FIXED to actually compare values
// ----------------------------------------------------------------------------

/**
 * Generates human-readable reasons why `bestCrop` outranks `secondCrop`.
 *
 * FIX FROM ORIGINAL: the old version only checked whether BOTH crops had a
 * field populated (e.g. `if (a.waterRequirement && b.waterRequirement)`)
 * and then asserted a fixed claim regardless of the actual values. That
 * meant it could tell a user "Crop B needs less water" even when Crop B
 * needed MORE water — a confidently wrong statement. Every claim below now
 * checks the actual scored values before asserting anything.
 */
export const generateComparisonReason = (bestCrop, secondCrop) => {
  if (!bestCrop || !secondCrop) return [];

  const reasons = [];

  // --- Profit comparison (this one was already numeric — kept as is) ---
  const profitDifference =
    bestCrop.expected_profit - secondCrop.expected_profit;

  if (profitDifference > 0) {
    reasons.push(
      `${bestCrop.crop} is expected to generate ₹${profitDifference.toLocaleString()} more profit than ${secondCrop.crop}.`,
    );
  }

  // --- Demand comparison — now actually compares scores, not just presence ---
  const bestDemandScore = getDemandScore(bestCrop.details?.marketDemand);
  const secondDemandScore = getDemandScore(secondCrop.details?.marketDemand);

  if (bestDemandScore > secondDemandScore) {
    reasons.push(`${bestCrop.crop} shows stronger market demand.`);
  } else if (secondDemandScore > bestDemandScore) {
    // Be honest even when it doesn't favor the "best" crop — this is more
    // trustworthy than only ever praising the top pick.
    reasons.push(
      `${secondCrop.crop} actually shows stronger market demand, but ${bestCrop.crop} compensates with other advantages.`,
    );
  }

  // --- Water comparison — now actually compares which needs less water ---
  const bestWater = extractAvgWaterFigure(bestCrop.details?.waterRequirement);

  const secondWater = extractAvgWaterFigure(
    secondCrop.details?.waterRequirement,
  );

  if (bestWater !== null && secondWater !== null) {
    if (bestWater < secondWater) {
      reasons.push(
        `${bestCrop.crop} requires less irrigation water than ${secondCrop.crop}.`,
      );
    } else if (secondWater < bestWater) {
      reasons.push(
        `${secondCrop.crop} requires less irrigation water, but ${bestCrop.crop} offers stronger overall returns.`,
      );
    }
  }

  // --- Overall AI score comparison ---
  if (
    bestCrop.aiScore != null &&
    secondCrop.aiScore != null &&
    bestCrop.aiScore > secondCrop.aiScore
  ) {
    reasons.push(
      `${bestCrop.crop} achieved a higher overall AI suitability score (${bestCrop.aiScore} vs ${secondCrop.aiScore}).`,
    );
  }

  return reasons;
};

export const getCropAnalysis = (crop) => {
  if (!crop?.details) {
    return {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      risks: [],
    };
  }

  const details = crop.details;

  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  const risks = [];

  // Strengths
  if (crop.expected_profit > 100000) {
    strengths.push("High profit potential");
  }

  if (details.marketDemand?.toLowerCase().includes("high")) {
    strengths.push("Strong market demand");
  }

  if (details.advantages?.length) {
    strengths.push(...details.advantages.slice(0, 2));
  }

  // Weaknesses
  if (details.waterRequirement && details.waterRequirement.match(/\d+/)) {
    const avgWater =
      details.waterRequirement
        .match(/\d+/g)
        ?.reduce((a, b) => a + Number(b), 0) /
      details.waterRequirement.match(/\d+/g)?.length;

    if (avgWater > 1500) {
      weaknesses.push("High water requirement");
    }
  }

  const durationDays = extractDurationDays(details.cropDuration);

  if (durationDays && durationDays > 180) {
    weaknesses.push("Long cultivation period");
  }

  // Opportunities
  if (details.marketDemand) {
    opportunities.push("Favorable market opportunities");
  }

  if (details.yield?.profitability) {
    opportunities.push(details.yield.profitability);
  }

  if (details.intercroppingOptions?.length) {
    opportunities.push(
      `Intercropping possible with ${details.intercroppingOptions[0]}`,
    );
  }

  // Risks
  if (details.challenges?.length) {
    risks.push(...details.challenges.slice(0, 3));
  }

  return {
    strengths,
    weaknesses,
    opportunities,
    risks,
  };
};

export const getActionPlan = (crop) => {
  if (!crop?.details) return [];

  const actions = [];

  actions.push(
    `Prepare ${crop.details.soil?.type || "suitable soil"} before sowing.`,
  );

  if (crop.details.waterRequirement) {
    actions.push(
      `Ensure irrigation support (${crop.details.waterRequirement}).`,
    );
  }

  const disease = crop.details.majorDiseases?.[0];

  if (disease?.name) {
    actions.push(`Monitor for ${disease.name}.`);
  }

  if (crop.details.intercroppingOptions?.length) {
    actions.push(
      `Consider intercropping with ${crop.details.intercroppingOptions[0]}.`,
    );
  }

  actions.push("Follow recommended fertilizer schedule.");

  return actions;
};

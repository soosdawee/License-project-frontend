export const VisualizationIds = {
  BAR_CHART: 30,
  PIE_CHART: 31,
  LINE_CHART: 32,
  SCATTER_PLOT: 33,
  AREA_CHART: 34,
  RACE_CHART: 35,
  ELECTION_RESULT: 36,
  ELECTION_DONUT: 37,
  EUROPE_FILTER: 39,
  ASIA_FILTER: 40,
  NORTH_AMERICA_FILTER: 41,
  SOUTH_AMERICA_FILTER: 42,
  AFRICA_FILTER: 43,
  EUROPE_BUBBLE: 44,
  ASIA_BUBBLE: 45,
  NORTH_AMERICA_BUBBLE: 46,
  SOUTH_AMERICA_BUBBLE: 47,
  AFRICA_BUBBLE: 48,
};

export const VisualizationNames = Object.fromEntries(
  Object.entries(VisualizationIds).map(([k, v]) => [v, k])
);

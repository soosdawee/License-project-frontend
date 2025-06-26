export const VisualizationIds = {
  BAR_CHART: 30,
  PIE_CHART: 31,
  LINE_CHART: 32,
  SCATTER_PLOT: 33,
  AREA_CHART: 34,
};

export const VisualizationNames = Object.fromEntries(
  Object.entries(VisualizationIds).map(([k, v]) => [v, k])
);

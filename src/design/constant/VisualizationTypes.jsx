export const VisualizationIds = {
  BAR_CHART: 23,
  PIE_CHART: 24,
  LINE_CHART: 25,
};

export const VisualizationNames = Object.fromEntries(
  Object.entries(VisualizationIds).map(([k, v]) => [v, k])
);

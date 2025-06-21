export const VisualizationIds = {
  BAR_CHART: 30,
  PIE_CHART: 31,
  LINE_CHART: 32,
};

export const VisualizationNames = Object.fromEntries(
  Object.entries(VisualizationIds).map(([k, v]) => [v, k])
);

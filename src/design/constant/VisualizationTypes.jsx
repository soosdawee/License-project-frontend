export const VisualizationIds = {
  BAR_CHART: 23,
  PIE_CHART: 24,
};

export const VisualizationNames = Object.fromEntries(
  Object.entries(VisualizationIds).map(([k, v]) => [v, k])
);

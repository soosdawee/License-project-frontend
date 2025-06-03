const mapVisualizationToInitialState = (visualization) => ({
  title: visualization.title || "",
  data: visualization.tableDatas?.[0]?.data || [[], [], []],
  visualizationModelId:
    Number(
      visualization.visualizationModelReducedViewDto?.visualizationModelId
    ) || null,
  xAxisLabel: visualization.xAxisLabel || "",
  yAxisLabel: visualization.yAxisLabel || "",
  showLegend: visualization.showLegend ?? false,
  showAnnotations: visualization.showAnnotations ?? false,
  chartType: visualization.chartType || "bar",
  filters: visualization.filters || [],
  isAnnotationCustom: visualization.isAnnotationCustom ?? false,
  customAnnotation: visualization.customAnnotation || "",
  isFooter: visualization.isFooter ?? false,
  footerText: visualization.footerText || "",
  areLabelsVisible: visualization.areLabelsVisible ?? true,
  showGrids: visualization.showGrids ?? false,
  backgroundColor: visualization.backgroundColor || "#ffffff",
  barColor: visualization.barColor || "#000000",
  customBarColors: visualization.customBarColors || "",
  opacity: visualization.opacity ?? 100,
  barSpacing: visualization.barSpacing ?? 25,
  font: visualization.font || "Arial",
  titleSize: visualization.titleSize ?? 40,
  articleSize: visualization.articleSize ?? 16,
  article: visualization.article || "",
  textColor: visualization.textColor || "#000000",
});

export default mapVisualizationToInitialState;

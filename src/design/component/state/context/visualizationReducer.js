const visualizationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload, modified: true };
    case 'SET_CHART_TYPE':
      return { ...state, chartType: action.payload, modified: true };
    case 'SET_DATA':
      return { ...state, data: action.payload, modified: true };
    case 'RESET_STATE':
      return action.payload;
    case 'SET_SHOW_ANNOTATIONS':
      return { ...state, showAnnotations: action.payload, modified: true};
    case 'SET_VISUALIZATION_MODEL_ID':
      return { ...state, visualizationModelId: action.payload, modified: true};
    case 'SET_IS_ANNOTATION_CUSTOM':
      return { ...state, isAnnotationCustom: action.payload, modified: true};
    case 'SET_CUSTOM_ANNOTATION':
      return { ...state, customAnnotation: action.payload, modified: true};
    case 'SET_IS_FOOTER':
      return { ...state, isFooter: action.payload, modified: true};
    case 'SET_FOOTER_TEXT':
      return { ...state, footerText: action.payload, modified: true};
    case 'SET_ARE_LABELS_VISIBLE':
      return { ...state, areLabelsVisible: action.payload, modified: true};
    case 'SET_SHOW_GRIDS':
      return { ...state, showGrids: action.payload, modified: true};
    case 'SET_X_AXIS_LABEL':
      return { ...state, xAxisLabel: action.payload, modified: true};
    case 'SET_Y_AXIS_LABEL':
      return { ...state, yAxisLabel: action.payload, modified: true};
    case 'SET_BACKGROUND_COLOR':
      return { ...state, backgroundColor: action.payload, modified: true};
    case 'SET_BAR_COLOR':
      return { ...state, barColor: action.payload, modified: true};
    case 'SET_CUSOTM_BAR_COLORS':
      return { ...state, customColors: action.payload, modified: true};
    case 'SET_OPACITY':
      return { ...state, opacity: action.payload, modified: true};
    case 'SET_BAR_SPACING':
      return { ...state, barSpacing: action.payload, modified: true};
    case 'SET_FONT':
      return { ...state, font: action.payload, modified: true};
    case 'SET_TITLE_SIZE':
      return { ...state, titleSize: action.payload, modified: true};
    case 'SET_ARTICLE_SIZE':
      return { ...state, articleSize: action.payload, modified: true};
    case 'SET_ARTICLE':
      return { ...state, article: action.payload, modified: true};
    case 'SET_TEXT_COLOR':
      return { ...state, textColor: action.payload, modified: true};
    case 'SET_VIZ_TYPE':
      return { ...state, vizType: action.payload, modified: true};
    case 'SET_COLOR_PALETTE':
      return { ...state, colorPalette: action.payload, modified: true};
    case 'SET_SHOW_LEGEND':
      return { ...state, showLegend: action.payload, modified: true};
    case 'SET_SHOW_PERCENTAGES':
      return { ...state, showPercentages: action.payload, modified: true};
    case 'SET_TRANSITION_TIME':
      return { ...state, transitionTime: action.payload, modified: true};
    case 'SET_SHEETS_LINK':
      return { ...state, sheetsLink: action.payload, modified: true};
    case 'SET_SAVED': 
      return { ...state, saved: action.payload, modified: false};
    case 'SET_VISUALIZATION_ID': 
      return { ...state, visualizationId: action.payload};
    case 'SET_MODIFIED': 
      return { ...state, modified: action.payload};
    case 'SET_SHARED': 
      return { ...state, shared: action.payload};
    case 'SET_PUBLISHED': 
      return { ...state, published: action.payload};
    case "INITIALIZE_VISUALIZATION":
      return {
        ...state,
        ...action.payload,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export default visualizationReducer;

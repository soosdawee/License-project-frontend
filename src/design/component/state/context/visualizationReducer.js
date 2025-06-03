const visualizationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_CHART_TYPE':
      return { ...state, chartType: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'RESET_STATE':
      return action.payload;
    case 'SET_SHOW_ANNOTATIONS':
      return { ...state, showAnnotations: action.payload};
    case 'SET_VISUALIZATION_MODEL_ID':
      return { ...state, visualizationModelId: action.payload};
    case 'SET_IS_ANNOTATION_CUSTOM':
      return { ...state, isAnnotationCustom: action.payload};
    case 'SET_CUSTOM_ANNOTATION':
      return { ...state, customAnnotation: action.payload};
    case 'SET_IS_FOOTER':
      return { ...state, isFooter: action.payload};
    case 'SET_FOOTER_TEXT':
      return { ...state, footerText: action.payload};
    case 'SET_ARE_LABELS_VISIBLE':
      return { ...state, areLabelsVisible: action.payload};
    case 'SET_SHOW_GRIDS':
      return { ...state, showGrids: action.payload};
    case 'SET_X_AXIS_LABEL':
      return { ...state, xAxisLabel: action.payload};
    case 'SET_Y_AXIS_LABEL':
      return { ...state, yAxisLabel: action.payload};
    case 'SET_BACKGROUND_COLOR':
      return { ...state, backgroundColor: action.payload};
    case 'SET_BAR_COLOR':
      return { ...state, barColor: action.payload};
    case 'SET_CUSOTM_BAR_COLORS':
      return { ...state, customBarColors: action.payload};
    case 'SET_OPACITY':
      return { ...state, opacity: action.payload};
    case 'SET_BAR_SPACING':
      return { ...state, barSpacing: action.payload};
    case 'SET_FONT':
      return { ...state, font: action.payload};
    case 'SET_TITLE_SIZE':
      return { ...state, titleSize: action.payload};
    case 'SET_ARTICLE_SIZE':
      return { ...state, articleSize: action.payload};
    case 'SET_ARTICLE':
      return { ...state, article: action.payload};
    case 'SET_TEXT_COLOR':
      return { ...state, textColor: action.payload};
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

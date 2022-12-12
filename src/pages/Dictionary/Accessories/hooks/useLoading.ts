import { useReducer } from 'react';

type LoadingType = {
  type:
    | 'showManufacturerLoading'
    | 'showProductLoading'
    | 'showModelLoading'
    | 'hideManufacturerLoading'
    | 'hideProductLoading'
    | 'hideModelLoading';
};

const initialLoadingState = {
  manufacturerLoading: false,
  productLoading: false,
  modelLoading: false,
};

const reducer = (state: typeof initialLoadingState, action: LoadingType) => {
  switch (action.type) {
    case 'showManufacturerLoading':
      return { ...state, manufacturerLoading: true };
    case 'showProductLoading':
      return { ...state, productLoading: true };
    case 'showModelLoading':
      return { ...state, modelLoading: true };
    case 'hideManufacturerLoading':
      return { ...state, manufacturerLoading: false };
    case 'hideProductLoading':
      return { ...state, productLoading: false };
    case 'hideModelLoading':
      return { ...state, modelLoading: false };
    default:
      return { ...state };
  }
};

export default function useLoading() {
  const [loadingState, dispatch] = useReducer(reducer, initialLoadingState);

  return {
    loadingState,
    dispatch,
  };
}

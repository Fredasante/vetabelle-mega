import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    _id: "",
    name: "",
    slug: { current: "" },
    price: 0,
    discountPrice: undefined,
    category: "",
    status: "available",
    isFeatured: false,
    mainImageUrl: "",
    gallery: [],
    description: [],
    sizes: [],
    colors: [],
    createdAt: "",
    gender: undefined,
  },
};

export const quickView = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    updateQuickView: (state, action: PayloadAction<Product>) => {
      state.value = { ...action.payload };
    },
    resetQuickView: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { updateQuickView, resetQuickView } = quickView.actions;
export default quickView.reducer;

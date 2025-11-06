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

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateProductDetails: (state, action: PayloadAction<Product>) => {
      state.value = { ...action.payload };
    },
  },
});

export const { updateProductDetails } = productDetails.actions;
export default productDetails.reducer;

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type CartItem = {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image: string;
  slug?: { current: string }; // add this if slug exists in your payload
};

// 🧺 State Type
type CartState = {
  items: CartItem[];
};

// 🧩 Initial State
const initialState: CartState = {
  items: [],
};

// 🛠️ Slice
export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );

      const slug = action.payload.slug?.current;

      // 👇 Apply special pricing logic before pushing/updating
      let adjustedPrice = action.payload.price;
      if (
        [
          "carrot-oil-skin-nourishment-youthful-skin",
          "rapid-hair-growth-oil",
        ].includes(slug || "")
      ) {
        // If quantity is 3, total should be ₵200 instead of 3×100
        if (action.payload.quantity === 3) {
          adjustedPrice = 200 / 3; // divide so per-item price = total ÷ quantity
        }
      }

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;

        // Recalculate if total quantity hits 3
        if (
          [
            "carrot-oil-skin-nourishment-youthful-skin",
            "rapid-hair-growth-oil",
          ].includes(existingItem.slug?.current || "") &&
          existingItem.quantity === 3
        ) {
          existingItem.price = 200 / 3;
        }
      } else {
        // ✅ Add new item with possibly adjusted price
        state.items.push({
          ...action.payload,
          price: adjustedPrice,
        });
      }
    },

    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item) {
        item.quantity += 1;

        // Recalculate if total quantity hits 3
        if (
          [
            "carrot-oil-skin-nourishment-youthful-skin",
            "rapid-hair-growth-oil",
          ].includes(item.slug?.current || "") &&
          item.quantity === 3
        ) {
          item.price = 200 / 3;
        }
      }
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(
          (cartItem) => cartItem._id !== action.payload
        );
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
  },
});

// 🧮 Selectors
export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => {
    const priceToUse = item.discountPrice ?? item.price;
    return total + priceToUse * item.quantity;
  }, 0)
);

export const {
  addItemToCart,
  removeItemFromCart,
  incrementQuantity,
  decrementQuantity,
  removeAllItemsFromCart,
} = cart.actions;

export default cart.reducer;

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type CartItem = {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image: string;
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

      if (existingItem) {
        // ✅ Increase quantity if item already exists
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        // ✅ Add new item
        state.items.push({ ...action.payload });
      }
    },

    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item) item.quantity += 1;
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // remove item if quantity would go below 1
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

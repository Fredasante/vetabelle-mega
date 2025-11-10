import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { calculateItemPrice } from "@/lib/pricing";

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

export const selectTotalQuantity = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectTotalPrice = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => {
    return total + calculateItemPrice(item, item.quantity);
  }, 0)
);

// 🎁 Calculate savings from bulk pricing
export const selectTotalSavings = createSelector([selectCartItems], (items) =>
  items.reduce((totalSavings, item) => {
    const regularPrice = (item.discountPrice ?? item.price) * item.quantity;
    const bulkPrice = calculateItemPrice(item, item.quantity);
    const savings = regularPrice - bulkPrice;
    return totalSavings + savings;
  }, 0)
);

// 🧾 Get item price with bulk pricing applied
export const selectItemTotal = (itemId: string) =>
  createSelector([selectCartItems], (items) => {
    const item = items.find((i) => i._id === itemId);
    if (!item) return 0;
    return calculateItemPrice(item, item.quantity);
  });

export const {
  addItemToCart,
  removeItemFromCart,
  incrementQuantity,
  decrementQuantity,
  removeAllItemsFromCart,
} = cart.actions;

export default cart.reducer;

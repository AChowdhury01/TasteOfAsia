import { createSlice } from "@reduxjs/toolkit";

//this for the the cart navbar. like when you click it the cart opens up. 

const cartSlice = createSlice({
    name: "cart",
    initialState: {
      products: [],
      quantity: 0,
      total: 0,
    },

    reducers: {
        //here we add the product to the payload, we take the quantity and price. 
        addProduct: (state, action) => {
            state.products.push(action.payload);
            state.quantity += 1;
            state.total += action.payload.price * action.payload.quantity;
        },
        //reset = when go to intial state. like after order we go back to order page
        //where cart clears again. 
        reset: (state) => {
            state.products = [];
            state.quantity = 0;
            state.total = 0;
          },
        },
});

export const { addProduct, reset } = cartSlice.actions;
export default cartSlice.reducer;
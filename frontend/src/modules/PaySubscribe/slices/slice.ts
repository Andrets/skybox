import { SubscriptionSubtype } from "@/shared/models/UserInfoApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PaySubscribeSliceModel {
  type_subscribe: SubscriptionSubtype;
}

const initialState: PaySubscribeSliceModel = {
  type_subscribe: SubscriptionSubtype.TEMPORARILY_WEEK,
};

export const paySubscribeSlice = createSlice({
  initialState,
  name: "paySubscribe",
  reducers: {
    setTypeSubscribe: (state, action: PayloadAction<SubscriptionSubtype>) => {
      state.type_subscribe = action.payload; // Устанавливаем новое значение type_subscribe
    },
  },
});

export const { setTypeSubscribe } = paySubscribeSlice.actions;

export default paySubscribeSlice.reducer;

import { types } from "../constants/normalType";
const intialState = {
  getGiftCardShow: false,
};
export const normalReducer = (state = intialState, action) => {
  switch (action.type) {
    case types.GIFT_CARD_SHOW:
      return {
        ...state,
        getGiftCardShow: action.payload,
      };
    default:
      return state;
  }
};
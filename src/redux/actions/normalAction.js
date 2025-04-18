import {types} from "../constants/normalType"


export const setGiftCardShow = data => ({
    type: types.GIFT_CARD_SHOW,
    payload: data,
  });
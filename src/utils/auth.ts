import { checkEmpty, localStore } from "./tool";

interface CheckLoginStruct {
  inLine?: (tokenInfo: object) => void;
  offLine?: (tokenInfo: object) => void;
}

export const checkLogin = (param: CheckLoginStruct) => {
  let options = Object.assign(
    {
      inLine: () => {},
      offLine: () => {}
    },
    param
  );
  let tokenInfo = localStore.read({ name: "tokenInfo", none: {} });
  let resData = { tokenInfo, hasToken: false };
  if (checkEmpty(tokenInfo)) {
    resData.hasToken = true;
    options.inLine(tokenInfo);
  } else {
    localStore.clearLogin();
    options.offLine(tokenInfo);
  }
  return resData;
};

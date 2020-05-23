import { checkEmpty, localStore } from "./tool";

interface CheckLoginStruct {
  inLine?: (tokenInfo: object) => void;
  offLine?: (tokenInfo: object) => void;
}

export const checkLogin = (param: CheckLoginStruct) => {
  const options = {
      inLine: () => {},
      offLine: () => {},
    ...param
  };
  const tokenInfo = localStore.read({ name: "tokenInfo", none: {} });
  const resData = { tokenInfo, hasToken: false };
  if (checkEmpty(tokenInfo)) {
    resData.hasToken = true;
    options.inLine(tokenInfo);
  } else {
    localStore.clearLogin();
    options.offLine(tokenInfo);
  }
  return resData;
};

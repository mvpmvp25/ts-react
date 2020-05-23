import Immutable from "immutable";

// 判断值是否为空 有值返回ture，否则返回false
export const checkEmpty = (data: any) => {
  if (data instanceof Array) {
    if (data.length == 0) {
      return false;
    } else {
      return true;
    }
  } else if (data instanceof Object) {
    if (JSON.stringify(data) == "{}") {
      return false;
    } else {
      return true;
    }
  } else {
    if (data != "" && data != null && data != undefined) {
      // NaN返回true
      return true;
    } else if (data == 0 && typeof data == "number") {
      return true;
    } else {
      return false;
    }
  }
};

// json格式轉換
export const parseData = (param: object) => {
  const options = {
      data: "",
    ...param
  };
  let resData = "";
  try {
    resData = JSON.parse(options.data);
  } catch (e) {
    resData = options.data;
  }
  return resData;
};

// localStorage sessionStorage
export const localStore = {
  add: (param: object) => {
    const options = {
        name: "key",
        value: "value",
      ...param
    };
    if (checkEmpty(options.value)) {
      if (typeof options.value == "object") {
        localStorage.setItem(options.name, JSON.stringify(options.value));
      } else {
        localStorage.setItem(options.name, options.value);
      }
    } else {
      localStorage.setItem(options.name, "{}");
    }
  },
  read: (param: object) => {
    const options = {
        name: "key",
        none: {},
      ...param
    };
    let resData = null;
    resData = localStorage.getItem(options.name);
    resData = parseData({ data: resData });
    resData = checkEmpty(resData) ? resData : options.none;
    return resData;
  },
  del: (param: object) => {
    const options = {
        key: [],
      ...param
    };
    options.key.forEach((item) => {
      localStorage.removeItem(item);
    });
  },
  addCache: (param: object) => {
    const options = {
        name: "key",
        value: "value",
      ...param
    };
    if (checkEmpty(options.value)) {
      if (typeof options.value == "object") {
        sessionStorage.setItem(options.name, JSON.stringify(options.value));
      } else {
        sessionStorage.setItem(options.name, options.value);
      }
    } else {
      sessionStorage.setItem(options.name, "{}");
    }
  },
  readCache: (param: object) => {
    const options = {
        name: "key",
        none: {},
      ...param
    };
    let resData = null;
    resData = sessionStorage.getItem(options.name);
    resData = parseData({ data: resData });
    resData = checkEmpty(resData) ? resData : options.none;
    return resData;
  },
  delCache: (param: object) => {
    const options = {
        key: [],
      ...param
    };
    options.key.forEach((item) => {
      sessionStorage.removeItem(item);
    });
  },
  clearUser() {
    this.delCache({ key: ["memberInfo", "airInfo"] });
  },
  clearLogin() {
    this.del({ key: ["tokenInfo"] });
    this.clearUser();
  },
};

// type ImmutableDataStruct = Immutable.Map<string | number, object | any[]>;
// export type InfoStruct = { [key: string]: any }; //{ [key: string]: unknown; } Immutable.Map<string, V>
// export type ArrStruct = any[];
// export type MapStruct = Immutable.Map<string, any>;
// export type ListStruct = Immutable.List<any>;
// export type ImmutableStruct = MapStruct | ListStruct;

export type RecordStruct<T> = Immutable.Record<T>;
// 所有业务组件公共的props结构
export type propsBaseStruct = {
  static?: object;
  publics?: object;
  privates?: object;
};

// Data Center
export const dataCenter = {
  create<T extends object>(state: T) {
    const stateRecord = Immutable.Record(state);
    return new stateRecord();
    // return Immutable.Map(state);
  },
  // toJS<T>(state: Immutable.Map<T>): T {
  //   return state.toJS();
  // },
  merge<T>(oldState: RecordStruct<T> & T, modify: Partial<T>) {
    return oldState.merge(modify);
  },
  save<T extends object>(oldState: T, modify: object, puppet = false) {
    const newState = {...oldState, ...modify};
    if (puppet) {
      // true-如果更新后的state和旧state数据一样，则原样返回旧state，减少无必要的更新
      if (
        Immutable.is(Immutable.fromJS(oldState), Immutable.fromJS(newState))
      ) {
        return oldState;
      } else {
        return newState;
      }
    } else {
      return newState;
    }
  },
};

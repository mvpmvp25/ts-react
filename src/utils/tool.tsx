import Immutable from 'immutable';

// 判断值是否为空 有值返回ture，否则返回false
export const checkEmpty = data => {
  if (data instanceof Array) {
    if (data.length == 0) {
      return false;
    } else {
      return true;
    }
  } else if (data instanceof Object) {
    if (JSON.stringify(data) == '{}') {
      return false;
    } else {
      return true;
    }
  } else {
    if (data != '' && data != null && data != undefined) {
      // NaN返回true
      return true;
    } else if (data == 0 && typeof data == 'number') {
      return true;
    } else {
      return false;
    }
  }
};

// json格式轉換
export const parseData = param => {
  let options = Object.assign(
    {
      data: ''
    },
    param
  );
  let resData = '';
  try {
    resData = JSON.parse(options.data);
  } catch (e) {
    resData = options.data;
  }
  return resData;
};

// localStorage sessionStorage
export const localStore = {
  add: param => {
    let options = Object.assign(
      {
        name: 'key',
        value: 'value'
      },
      param
    );
    if (checkEmpty(options.value)) {
      if (typeof options.value == 'object') {
        localStorage.setItem(options.name, JSON.stringify(options.value));
      } else {
        localStorage.setItem(options.name, options.value);
      }
    } else {
      localStorage.setItem(options.name, '{}');
    }
  },
  read: param => {
    let options = Object.assign(
      {
        name: 'key',
        none: {}
      },
      param
    );
    let resData = null;
    resData = localStorage.getItem(options.name);
    resData = parseData({ data: resData });
    resData = checkEmpty(resData) ? resData : options.none;
    return resData;
  },
  del: param => {
    let options = Object.assign(
      {
        key: []
      },
      param
    );
    options.key.forEach(item => {
      localStorage.removeItem(item);
    });
  },
  addCache: param => {
    let options = Object.assign(
      {
        name: 'key',
        value: 'value'
      },
      param
    );
    if (checkEmpty(options.value)) {
      if (typeof options.value == 'object') {
        sessionStorage.setItem(options.name, JSON.stringify(options.value));
      } else {
        sessionStorage.setItem(options.name, options.value);
      }
    } else {
      sessionStorage.setItem(options.name, '{}');
    }
  },
  readCache: param => {
    let options = Object.assign(
      {
        name: 'key',
        none: {}
      },
      param
    );
    let resData = null;
    resData = sessionStorage.getItem(options.name);
    resData = parseData({ data: resData });
    resData = checkEmpty(resData) ? resData : options.none;
    return resData;
  },
  delCache: param => {
    let options = Object.assign(
      {
        key: []
      },
      param
    );
    options.key.forEach(item => {
      sessionStorage.removeItem(item);
    });
  },
  clearUser() {
    this.delCache({ key: ['memberInfo', 'airInfo'] });
  },
  clearLogin() {
    this.del({ key: ['tokenInfo'] });
    this.clearUser();
  }
};

// Data Center
export const dataCenter = {
  fromJS(state) {
    return Immutable.fromJS(state);
  },
  toJS(state) {
    return state.toJS();
  },
  merge(oldState, modify) {
    return oldState.merge(modify);
  },
  save(oldState, modify, puppet = false) {
    let newState = Object.assign({}, oldState, modify);
    if (puppet) {
      // true-如果新state和旧state数据一样，则原样返回旧state，减少无必要的更新
      if (Immutable.is(Immutable.fromJS(oldState), Immutable.fromJS(newState))) {
        return oldState;
      } else {
        return newState;
      }
    } else {
      return newState;
    }
  }
};

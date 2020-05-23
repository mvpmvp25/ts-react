import fetch from "isomorphic-fetch";
import moment from "moment";
import * as Sentry from "@sentry/browser";
import { Api } from "config/api";
import appConfig from "config/setting";
import { checkLogin } from "./auth";
import { localStore, checkEmpty } from "./tool";
import { loading, modalView, report } from "./plugin";
import { codeText } from "config/codeText";

const serverType = process.env.SERVER_TYPE as string;
const serverUrl = (appConfig.zone as { [key: string]: any })[serverType].serverUrl;

interface LogSend {
  requestName?: string;
  requestApi?: string;
  requestSource?: string;
  requestParam?: object;
  data?: object;
  remarkMes?: string | object;
  remarkCode?: string;
  recorderName?: string;
}

interface LogCapture {
  code?: string;
  msg?: string;
}

export const clientLog = {
  projectInfo: { name: appConfig.name, version: appConfig.version },
  send(param: LogSend) {
    const options = {
      requestName: "",
      requestApi: "",
      requestSource: location.href,
      requestParam: {},
      data: {},
      remarkMes: "",
      remarkCode: "",
      recorderName: "developer",
      ...param
    };
    const _projectInfo = this.projectInfo;
    const _requestInfo = {
      name: options.requestName,
      api: options.requestApi,
      source: options.requestSource,
      param: options.requestParam
    };
    const _errorInfo = options.data;
    const _remarkInfo = { mes: options.remarkMes, code: options.remarkCode };
    const _timeInfo = { time: moment().format("YYYY/MM/DD HH:mm:ss") };
    const _recorder = { name: options.recorderName };
    const logData = {
      _projectInfo,
      _requestInfo,
      _errorInfo,
      _remarkInfo,
      _timeInfo,
      _recorder
    };
    request(
      {
        type: "post",
        data: {
          message: options.requestName,
          context: logData
        },
        loading: false,
        sendLog: false,
        toast: false,
        warn: false
      },
      Api.clientLog
    );
  },
  capture(param: LogCapture) {
    const options = {
      code: "",
      msg: "",
      ...param
    };
    const { code, msg } = options;
    const logData = { ...this.projectInfo, code, msg };
    if (process.env.SERVER_TYPE !== "prod") {
      Sentry.captureMessage(JSON.stringify(logData), Sentry.Severity.Error); // fatal, error, warning, info, debug
    }
  }
};

interface ReqSet {
  url?: string;
  type?: string;
  data?: object;
  isDownload?: boolean;
  downloadName?: string;
  isUpload?: boolean;
  warn?: boolean;
  timeout?: number;
  toast?: boolean;
  loading?: boolean;
  success?: (res: object) => void;
  // callLogin?: boolean;
  fail?: (err: object) => void;
  error?: (err: object) => void;
  unAuth?: () => void;
  headers?: object;
  sendLog?: boolean;
  downloadJava?: boolean;
}

interface ReqOptionStruct {
  method: string;
  url?: string;
  auth: boolean;
  name: string;
}

export const request = (param: ReqSet, options: ReqOptionStruct) => {
  const reqTime = new Date().getTime();
  let resTime = 0;
  let isModalView = false;
  const reqOption = {
    url: "",
    type: options.method,
    data: {},
    isDownload: false,
    downloadName: "",
    isUpload: false,
    warn: true,
    timeout: 60000,
    toast: true,
    loading: true,
    success: () => {},
    // callLogin: true,
    fail: () => {}, // 业务失败
    error: () => {}, // 接口失败
    unAuth: () => {}, // 未登錄callback
    headers: {},
    sendLog: false,
    ...param
  };

  if (checkEmpty(reqOption.url)) {
    // 优先使用param传入的url
    if (reqOption.url.indexOf("//") === -1) {
      reqOption.url = `${serverUrl}${reqOption.url}`;
    }
  } else {
    if (checkEmpty(options.url)) {
      if ((options.url as string).indexOf("//") === -1) {
        reqOption.url = `${serverUrl}${options.url}`;
      } else {
        reqOption.url = options.url as string;
      }
    }
  }

  // reqOption.data.timeStamp = moment().format("YYYYMMDDHHmmss");

  if (reqOption.type === "get" || reqOption.type === "GET") {
    // 需补充isUpload为true时不能使用get方式
    let paramStr = ""; // 拼接参数

    interface PayloadStruct {
      [index: string]: string | number | (string | number | object)[];
    }

    Object.keys(reqOption.data).forEach(key => {
      paramStr += key + "=" + (reqOption.data as PayloadStruct)[key] + "&";
    });
    if (paramStr !== "") {
      paramStr = paramStr.substr(0, paramStr.lastIndexOf("&"));
      reqOption.url = reqOption.url + "?" + paramStr;
    }
  }

  interface HeadersStruct {
    Accept?: string;
    "Content-Type"?: string;
    Authorization?: string;
  }

  const requestConfig = {
    // credentials: 'include',
    method: reqOption.type,
    headers: {}
    // mode: "cors",
    // cache: "force-cache"
  };

  if (!reqOption.isUpload) {
    requestConfig.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...reqOption.headers
    };
  }

  interface ResStruct {
    bbtToken?: string;
  }

  function setHeadToken(res: ResStruct) {
    (requestConfig.headers as HeadersStruct).Authorization = "Bearer " + res.bbtToken;
  }

  checkLogin({
    inLine: (res: ResStruct) => {
      setHeadToken(res);
    }
  });

  if (options.auth && !checkEmpty((requestConfig.headers as HeadersStruct).Authorization)) {
    if (reqOption.warn && !isModalView) {
      modalView.confirm({
        iconType: "bookFail",
        content: codeText.A002,
        okText: "登錄",
        btnType: "hideCancel",
        onOk: () => {
          isModalView = true;
          // 去登录
        }
      });
    }
    reqOption.unAuth();
    return { fact: "unauthorized" };
  }

  if (reqOption.type === "post" || reqOption.type === "POST") {
    let bodyData: object | string | null = null;
    if (reqOption.isUpload) {
      const formData = new FormData();
      interface FormDataStruct {
        [index: string]: string | Blob;
      }
      Object.keys(reqOption.data).forEach(key => {
        formData.append(key, (reqOption.data as FormDataStruct)[key]);
      });
    } else {
      bodyData = JSON.stringify(reqOption.data);
    }
    Object.defineProperty(requestConfig, "body", {
      value: bodyData
    });
  }

  function reqDone(hasRes: boolean, logData: object, processTime: string | number) {
    if (reqOption.loading) loading.remove();
    if (hasRes) {
      // 有响应数据
      if (reqOption.sendLog) {
        clientLog.send({
          requestName: "webApi",
          requestParam: reqOption,
          data: logData,
          remarkMes: {
            reqConfig: requestConfig,
            processTime: processTime + "s"
          }
        });
      }
    } else {
      if (reqOption.sendLog) {
        clientLog.send({
          requestName: "webApi",
          requestParam: reqOption,
          data: logData,
          remarkMes: { reqConfig: requestConfig, processTime }
        });
      }
    }
  }

  if (reqOption.loading) loading.create();
  // interface ResponseStruct {
  //   ok: boolean;
  //   status: number;
  //   statusText: string;
  //   json: () => object;
  //   blob: () => string;
  // }
  // interface ResDataStruct {
  //   fact: string;
  //   resData?: ResponseStruct;
  //   httpCode?: number;
  //   httpText?: string;
  // }
  return Promise.race([
    fetch(reqOption.url, requestConfig)
      .then(response => {
        if (response.ok) {
          // http code为200
          return {
            fact: "success",
            resData: response,
            httpCode: response.status,
            httpText: response.statusText
          };
        } else {
          return {
            fact: "error",
            resData: response,
            httpCode: response.status,
            httpText: response.statusText
          };
        }
      })
      .then(res => {
        if (res.fact === "success") {
          return reqOption.isDownload ? res.resData.blob() : res.resData.json();
        } else {
          return res;
        }
      }),
    new Promise(resolve => {
      // resolve, reject
      setTimeout(() => resolve({ fact: "timeout" }), reqOption.timeout);
    }).then(res => {
      return res;
    })
  ])
    .then(data => {
      if (data.fact === "timeout") {
        // 请求超時
        reqOption.error(data);
        if (reqOption.toast) {
          report.info(codeText.A001);
        }
        reqDone(false, { reqStatus: "timeout" }, "-");
      } else if (data.fact === "error") {
        // 请求异常
        reqOption.error(data);
        if (reqOption.toast) {
          report.info(options.name + " error: " + data.httpCode + "-" + data.httpText);
        }
        reqDone(
          false,
          {
            reqStatus: "error",
            httpCode: data.httpCode,
            httpText: data.httpText
          },
          "-"
        );
      } else {
        // 请求正常
        resTime = new Date().getTime();
        const processTime = (resTime - reqTime) / 1000;
        if (data.code === 200008) {
          // token无效 但是這種情況後端返回http code不是200
          localStore.clearLogin();
          // 去登录
          reqDone(true, data, processTime);
        } else if (data.code === 0) {
          reqOption.success(data);
          reqDone(true, data, processTime);
        } else {
          if (reqOption.isDownload) {
            // 下載文件的接口沒有code視為請求成功
            // 是否是java接口下載
            const fileBlob = reqOption.downloadJava
              ? new Blob([data], { type: "text/pdf" })
              : new Blob([data]); // new Blob([content], { type: 'text/csv' })
            const fileName = reqOption.downloadName + ".pdf";

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              // ie處理方法 提示用户是要保存文件还是直接打开文件
              window.navigator.msSaveOrOpenBlob(fileBlob, fileName);
            } else {
              const elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(fileBlob);
              document.body.appendChild(elink);
              elink.click();
              document.body.removeChild(elink);
            }
            reqDone(true, { data: "invoice" }, processTime);
          } else {
            reqOption.fail(data);
            if (reqOption.toast) {
              report.info(data.msg || codeText.A003);
            }
            reqDone(true, data, processTime);
          }
        }
      }
      return data;
    })
    .catch(err => {
      // bbtLog.info(err, "-------- request catch");
      const errData = { fact: "failed", err };
      if (reqOption.toast) {
        report.info(options.name + " errorCatch: failed");
      }
      reqOption.error(errData);
      reqDone(false, { reqStatus: "failed" }, "-");
      return errData;
    });
};

import React from "react";
import { Modal, message } from "antd";
import appConfig from "config/setting";
import { checkEmpty } from "./tool";

// loading
class loadPop {
  private pop: HTMLElement | null;
  private noop: () => void;
  private popNum: number;
  constructor() {
    this.pop = null;
    this.noop = () => {};
    this.popNum = 0;
  }

  create(cb?: () => void) {
    cb = cb || this.noop;
    this.popNum = this.popNum + 1;
    if (this.pop) {
      //document.body.removeChild(this.pop);
      return;
    }
    this.pop = document.createElement("div");
    this.pop.classList.add("loading-pop");
    this.pop.innerHTML =
      '<div class="loading-message"><div class="la-ball-pulse la-2x"><div></div><div></div><div></div></div></div>';
    document.body.appendChild(this.pop);
    cb();
  }

  remove(cb?: () => void) {
    cb = cb || this.noop;
    if (this.pop) {
      this.popNum = this.popNum - 1;
      if (this.popNum == 0) {
        document.body.removeChild(this.pop);
        this.pop = null;
        cb();
      }
    }
  }
}

export const loading = new loadPop();

class loginView {
  private loginPopupEle: HTMLElement | null;
  private ssoTask: number | null;
  private loginMaskEle: HTMLElement | null;
  private loginContentEle: HTMLElement | null;
  private loginCloseEle: HTMLElement | null;
  constructor() {
    // let self = this;
    // this.options = Object.assign({
    //     isAuto: false
    // }, param);
    this.loginPopupEle = null;
    this.ssoTask = null;
    this.loginMaskEle = null;
    this.loginContentEle = null;
    this.loginCloseEle = null;
  }

  init() {
    let pageHtml =
      '<section id="loginPopup" class="none">' +
      '<div class="login-mask"></div>' +
      '<div class="login-content">' +
      '<div class="login-cell">' +
      '<div id="loginClose" class="login-close">X</div>' +
      '<iframe width="100%" height="100%" scrolling="no" frameBorder="0" src="' +
      appConfig.hostUrl +
      '/xxx/xxx"></iframe>' +
      "</div>" +
      "</div>" +
      "</section>";
    (document.querySelector("body") as HTMLBodyElement).insertAdjacentHTML(
      "beforeend",
      pageHtml
    );
    this.loginPopupEle = document.querySelector("#loginPopup");
    this.loginMaskEle = document.querySelector(".login-mask");
    this.loginContentEle = document.querySelector(".login-content");
    this.loginCloseEle = document.querySelector("#loginClose");
    (this.loginCloseEle as HTMLElement).addEventListener("click", () => {
      this.close();
    });
  }

  show(ssoTask: number) {
    this.ssoTask = ssoTask;
    (this.loginPopupEle as HTMLElement).classList.remove("none");
    (this.loginMaskEle as HTMLElement).classList.remove("popup-fadeOut");
    (this.loginMaskEle as HTMLElement).classList.add("popup-fadeEnter");
    (this.loginContentEle as HTMLElement).classList.remove("popup-fadeInDown");
    (this.loginContentEle as HTMLElement).classList.add("popup-fadeInUp");
  }

  close() {
    this.ssoTask && clearInterval(this.ssoTask);
    (this.loginMaskEle as HTMLElement).classList.remove("popup-fadeEnter");
    (this.loginMaskEle as HTMLElement).classList.add("popup-fadeOut");
    (this.loginContentEle as HTMLElement).classList.remove("popup-fadeInUp");
    (this.loginContentEle as HTMLElement).classList.add("popup-fadeInDown");
    setTimeout(() => {
      if (this.loginPopupEle) {
        document.body.removeChild(this.loginPopupEle);
        this.loginPopupEle = null;
      }
      // self.loginPopupEle.classList.add("none");
      // self.loginMaskEle.classList.add("none");
    }, 100);
  }
}

export const ssoLogin = new loginView();

interface ModalInfoStruct {
  icon?: object;
  okText?: string;
  content?: string;
  onOk?: () => void;
}

type iconType = "bookFail" | "nothing";

interface ModalConfirmStruct {
  className?: string;
  iconType?: iconType;
  btnType?: string;
  okText?: string;
  title?: object | string;
  content?: object | string;
  tips?: object | string;
  onOk?: () => void;
  cancelText?: string;
  onCancel?: () => void;
}

export const modalView = {
  info: (param: ModalInfoStruct) => {
    let options = Object.assign(
      {
        icon: <img src="/static/icon/notice-big.svg" />,
        okText: "確認",
        content: "",
        onOk: () => {}
      },
      param
    );
    Modal.info({
      className: "g-bbt-alert",
      width: 400,
      //title: options.content,
      icon: <span className="bbt-icon">{options.icon}</span>,
      okText: options.okText,
      content: options.content,
      centered: true,
      onOk: close => {
        options.onOk && options.onOk();
        close();
      }
    });
  },
  isConfirm: false,
  confirm: (param: ModalConfirmStruct) => {
    if (modalView.isConfirm) {
      return;
    }
    let options = Object.assign(
      {
        className: "g-bbt-confirm",
        iconType: "", // fail
        btnType: "",
        okText: "OK",
        title: "",
        content: "",
        tips: "",
        onOk: () => {},
        cancelText: "cancel",
        onCancel: () => {}
      },
      param
    );
    let confirmClass = options.className;
    if (options.btnType == "hideOk" || options.btnType == "hideCancel") {
      confirmClass = options.className + " " + options.btnType;
    }
    let icon = null;
    switch (options.iconType) {
      case "bookFail":
        icon = <img src={require("assets/img/yay.jpg")} />;
        break;
    }
    modalView.isConfirm = true;
    Modal.confirm({
      icon: " ",
      className: confirmClass,
      okText: options.okText,
      cancelText: options.cancelText,
      centered: true,
      content: (
        <div className="bbt-content">
          <div className="bbt-icon">{icon}</div>
          <div className={checkEmpty(options.title) ? "bbt-title" : "none"}>
            {options.title}
          </div>
          <div className={checkEmpty(options.content) ? "bbt-text" : "none"}>
            {options.content}
          </div>
          <div className={checkEmpty(options.tips) ? "bbt-tips" : "none"}>
            {options.tips}
          </div>
        </div>
      ),
      onOk: close => {
        options.onOk && options.onOk();
        modalView.isConfirm = false;
        close();
      },
      onCancel: close => {
        options.onCancel && options.onCancel();
        modalView.isConfirm = false;
        close();
      }
    });
  }
};

export const report = {
  info: (text = "", time = 2, cb = () => {}) => {
    message.info(text, time, cb);
  }
};

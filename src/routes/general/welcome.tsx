import React, { useState, useEffect } from "react";
import { dataCenter } from "utils/tool";
import { CardList, CardSearch, CardInfo } from "components/order/index";
import { cardOrderList } from "server/order";
import { themeChange } from "config/__system";
import { CardListRecordStruct } from "components/order/struct";

// import tabMyPre from "assets/img/tab-my-pre.svg";
import welcomeStyle from "./welcome.scss";

interface StateStruct {
  searchData: object;
  page: number;
  age: number;
  taskList: string[]; // string[]
  list: CardListRecordStruct[];
}

const initState: StateStruct = {
  searchData: {},
  page: 3,
  age: 31,
  taskList: ["aa", "bb"],
  list: []
};

function Welcome() {
  const [state, setState] = useState(initState);

  const handleClick = () => {
    themeChange("dark");
    setState({
      searchData: {},
      page: 6,
      age: 36,
      taskList: ["ss", "zz"],
      list: [
        { orderId: 2333, name: "SDFS" },
        { orderId: 6523, name: "HYEE" }
      ]
    });
  };

  const getSearchData = (info: object) => {
    setState(dataCenter.save(state, { searchData: info }, true));
  };

  const { searchData, page, list, taskList } = state;

  useEffect(() => {
    interface ResStruct {
      data: { list: object[] };
    }
    cardOrderList({
      data: { page, ...searchData },
      success: (res: ResStruct) => {
        setState(dataCenter.save(state, { list: res.data.list }));
      }
    });
  }, [searchData]);

  return (
    <div className={`main-box ${welcomeStyle.pageBox}`}>
      <CardSearch publics={{ page, list }} privates={{ taskList }} sendData={getSearchData} />
      <CardList static={{ list }} publics={{ page }} privates={{ taskList }} />
      <CardInfo />
      <img src={require("assets/img/tab-my-pre.svg")} />
      <button className={welcomeStyle.hi} onClick={handleClick}>
        换肤
      </button>
    </div>
  );
}

export default Welcome;

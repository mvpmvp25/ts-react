import React from "react";
import { Router, Route, Switch } from "react-router-dom";
// import { ConfigProvider } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import appHistory from "./history";
import BasicLayout from "./components/layout/basicLayout";
import { routeList } from "./config/__system";
interface RouteData {
  path: string;
  component: any;
}

function RouterConfig() {
  return (
    // <ConfigProvider locale={zhCN}>
    <Router history={appHistory}>
      {/* <Switch> */}
      {/* <Route path="/user" exact component={UserPage} /> */}
      {/* <Route path="/products" exact component={Products} /> */}
      <BasicLayout>
        <Switch>
          {routeList.map((item: RouteData, index: number) => {
            // console.log(item.component)
            return (
              <Route
                key={index}
                path={item.path}
                exact
                component={item.component}
              />
            );
          })}
        </Switch>
      </BasicLayout>
      {/* </Switch> */}
    </Router>
    // </ConfigProvider>
  );
}

export default RouterConfig;

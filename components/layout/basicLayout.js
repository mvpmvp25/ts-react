import React, { useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Row, Col } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import appConfig from 'config/setting';
import { getBreadcrumb, pageView } from 'config/__system';
import { dataCenter } from 'utils/tool';
import appHistory from '../../history';
import basicLayoutStyle from './basicLayout.scss';

const iconInfo = {
  notification: HomeOutlined
};

const {
  location: { pathname }
} = appHistory;

const myReducer = (state, action) => {
  switch (action.type) {
    case 'save':
      return dataCenter.merge(state, action.payload);
    default:
      return state;
  }
};

const AppContext = React.createContext({});

const MainLayout = props => {
  const { dispatch } = props;
  const { selected, openKeys } = dataCenter.toJS(useContext(AppContext));
  const { SubMenu } = Menu;
  const { Header, Content, Sider } = Layout;

  const selectMenu = e => {
    dispatch({ type: 'save', payload: { selected: e.key } });
    let routePath = e.key == appConfig.indexPath ? '/' : e.key;
    pageView.go(routePath);
  };

  const openMenu = e => {
    dispatch({ type: 'save', payload: { openKeys: e } });
  };

  return (
    <Layout>
      <Header>
        <Row>
          <Col span={8}>
            <div className={basicLayoutStyle.logo} />
          </Col>
          <Col span={8} offset={8}>
            <div className={basicLayoutStyle.operator}>欢迎，管理员</div>
          </Col>
        </Row>
        {/* <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu> */}
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            // defaultSelectedKeys={[selected]}
            openKeys={openKeys}
            onOpenChange={openMenu}
            selectedKeys={[selected]}
            // defaultOpenKeys={["xx"]}
            style={{ height: '100%', borderRight: 0 }}
            onClick={selectMenu}
          >
            {appConfig.leftMenuList.map(item => {
              const Icon = iconInfo[item.icon];
              return (
                <SubMenu
                  key={item.navKey}
                  title={
                    <span>
                      <Icon />
                      {item.navName}
                    </span>
                  }
                >
                  {item.menu.map(v => {
                    return <Menu.Item key={`/${item.navKey}/${v.key}`}>{v.name}</Menu.Item>;
                  })}
                </SubMenu>
              );
            })}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {getBreadcrumb(selected).map((item, index) => {
              item;
              return <Breadcrumb.Item key={index}>{item.navText}</Breadcrumb.Item>;
            })}
          </Breadcrumb>

          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>{props.children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

MainLayout.propTypes = {
  dispatch: PropTypes.func.isRequired, // array bool func number object string
  children: PropTypes.object.isRequired
};

// const Messages = () => {
//   const { username } = useContext(AppContext)

//   return (
//     <div>
//       <p>3333{username}</p>
//     </div>
//   )
// }

function BasicLayout(props) {
  const selected = pathname == '/' ? appConfig.indexPath : pathname;
  const [state, dispatch] = useReducer(
    myReducer,
    dataCenter.fromJS({
      selected,
      openKeys: [selected.split('/')[1]]
    })
  );
  const rootProps = { dispatch };
  return (
    <AppContext.Provider value={state}>
      {/* <button onClick={() => dispatch({ type: 'countUp', payload: "aaa" })}>+1</button>
        <p>Count: {state.count}</p> */}
      <MainLayout {...rootProps}>{props.children}</MainLayout>
      {/* <Messages /> */}
    </AppContext.Provider>
  );
}

BasicLayout.propTypes = {
  children: PropTypes.object.isRequired
};

export default BasicLayout;

import React, { useState, useEffect } from 'react';
import { dataCenter } from 'utils/tool';
import { CardList, CardSearch, CardInfo } from 'components/order/index';
import { cardOrderList } from 'server/order';
import { themeChange } from 'config/__system';

import welcomeStyle from './welcome.scss';

function Welcome() {
  const [state, setState] = useState({
    searchData: {},
    page: 'xxxx',
    age: 'qqqq',
    taskList: ['aa', 'bb'],
    list: []
  });

  const handleClick = () => {
    themeChange('dark');
    setState({
      searchData: {},
      page: 'xxxx',
      age: 'qqqq',
      taskList: ['aa', 'bb'],
      list: [
        { ss: 'xx', ww: 'rr' },
        { ss: 'ee', ww: 'gg' }
      ]
    });
  };

  const getSearchData = info => {
    setState(dataCenter.save(state, { searchData: info }, true));
  };

  const { searchData, page, list, taskList } = state;

  useEffect(() => {
    cardOrderList({
      data: { page, ...searchData },
      success: res => {
        setState(dataCenter.save(state, { list: res.data.list }));
      }
    });
  }, [searchData]);

  return (
    <div className={`main-box ${welcomeStyle.pageBox}`}>
      <CardSearch publics={{ page, list }} privates={{ taskList }} sendData={getSearchData} />
      <CardList static={{ list }} publics={{ page }} privates={{ taskList }} />
      <CardInfo />
      <img src={require('assets/img/tab-my-pre.svg')} />
      <button className={welcomeStyle.hi} onClick={handleClick}>
        换肤
      </button>
    </div>
  );
}

export default Welcome;

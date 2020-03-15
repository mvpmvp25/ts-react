import React from 'react'; //, { useState }
import PropTypes from 'prop-types';
import { Table, Divider } from 'antd';

function CardList(props) {
  const {
    static: { list }
    // publics: { page },
    // privates: { taskList }
  } = props;
  // const [state] = useState({
  //   page,
  //   taskList
  // });

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      render(text) {
        return <a>{text}</a>;
      }
    },
    {
      title: '订单号',
      dataIndex: 'orderId'
    },
    {
      title: '操作',
      key: 'action',
      render(text, record) {
        return (
          <span>
            <a>Invite {record.name}</a>
            <Divider type="vertical" />
            <a>Delete</a>
          </span>
        );
      }
    }
  ];

  return (
    <div>
      <Table columns={columns} dataSource={list} rowKey={record => record.orderId} />
    </div>
  );
}

CardList.propTypes = {
  static: PropTypes.exact({
    list: PropTypes.array
  })
  // publics: PropTypes.object, // array bool func number object string
  // privates: PropTypes.object.isRequired
};

export default CardList;

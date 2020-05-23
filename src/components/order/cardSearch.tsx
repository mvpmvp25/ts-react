import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Form, Row, Col, Input, Button, DatePicker } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { checkEmpty, propsBaseStruct, dataCenter } from "utils/tool";

const dateFormat = "YYYY-MM-DD";

interface PropsStruct extends propsBaseStruct {
  sendData: (values: object) => void;
}

interface TimeStateStruct {
  startTime: object | null;
  endTime: object | null;
}

function cardSearch(props: PropsStruct) {
  const [form] = Form.useForm();
  // const fields = [
  //   {
  //     name: ['orderId'],
  //     value: ''
  //   },
  //   {
  //     name: ['startTime'],
  //     value: null
  //   },
  //   {
  //     name: ['endTime'],
  //     value: null
  //   },
  //   {
  //     name: ['userId'],
  //     value: ''
  //   }
  // ];
  const [state, setState] = useState({
    expand: false
  });
  const { expand } = state;

  const fieldShowCount = expand ? 6 : 3;
  const searchFields = [];

  const startTimeChange = (e: moment.Moment | null, dateStr: string): void => {
    // e: moment.Moment, dateStr: string
    const timeState: TimeStateStruct = {
      startTime: null,
      endTime: null
    };
    const fieldsInfo = form.getFieldsValue();
    if (checkEmpty(e)) {
      timeState.startTime = e;
      if (checkEmpty(fieldsInfo.endTime)) {
        const diffDay = moment(fieldsInfo.endTime).diff(e as moment.Moment, "days");
        if (diffDay < 0) {
          timeState.endTime = null;
        } else {
          timeState.endTime = fieldsInfo.endTime;
        }
      }
    } else {
      timeState.startTime = null;
      timeState.endTime = fieldsInfo.endTime;
    }
    form.setFields([
      {
        name: ["startTime"],
        value: timeState.startTime
      },
      {
        name: ["endTime"],
        value: timeState.endTime
      }
    ]);
  };

  const endTimeChange = (e: moment.Moment | null, dateStr: string): void => {
    // e: moment.Moment, dateStr: string
    const timeState: TimeStateStruct = {
      startTime: null,
      endTime: null
    };
    const fieldsInfo = form.getFieldsValue();
    if (checkEmpty(e)) {
      timeState.endTime = e;
      if (checkEmpty(fieldsInfo.startTime)) {
        const diffDay = (e as moment.Moment).diff(moment(fieldsInfo.startTime), "days");
        if (diffDay < 0) {
          timeState.startTime = null;
        } else {
          timeState.startTime = fieldsInfo.startTime;
        }
      }
    } else {
      timeState.startTime = fieldsInfo.startTime;
      timeState.endTime = null;
    }
    form.setFields([
      {
        name: ["startTime"],
        value: timeState.startTime
      },
      {
        name: ["endTime"],
        value: timeState.endTime
      }
    ]);
  };

  // 订单id
  searchFields[0] = (
    <Form.Item
      name="orderId"
      rules={[
        {
          required: true,
          message: "不能为空"
        }
      ]}
      label="订单号"
    >
      <Input placeholder="placeholder" />
    </Form.Item>
  );

  // 开始时间
  searchFields[1] = (
    <Form.Item
      name="startTime"
      rules={[
        {
          required: true,
          message: "不能为空"
        }
      ]}
      label="开始时间"
    >
      <DatePicker
        format={dateFormat}
        placeholder="请选择"
        onChange={startTimeChange}
        showToday={false}
        // allowClear={false}
        // suffixIcon={<img src="/static/icon/setoff-date.svg" />}
        // dropdownClassName="g-date-drop"
      />
    </Form.Item>
  );

  // 结束时间
  searchFields[2] = (
    <Form.Item
      name="endTime"
      rules={[
        {
          required: true,
          message: "不能为空"
        }
      ]}
      label="结束时间"
    >
      <DatePicker
        format={dateFormat}
        placeholder="请选择"
        onChange={endTimeChange}
        showToday={false}
        // allowClear={false}
        // suffixIcon={<img src="/static/icon/setoff-date.svg" />}
        // dropdownClassName="g-date-drop"
      />
    </Form.Item>
  );

  // 用户id
  searchFields[4] = (
    <Form.Item
      name="userId"
      rules={[
        {
          required: true,
          message: "不能为空"
        }
      ]}
      label="用户编号"
    >
      <Input placeholder="placeholder" />
    </Form.Item>
  );

  const handleSearch = (values: object) => {
    props.sendData(values);
  };

  const handleFailed = (err: object) => {
    console.info(err);
  };

  // const handleSearch = async () => {
  //   const values = await form.validateFields();
  //   console.info(values);
  // };

  const handleReset = () => {
    form.resetFields();
  };

  const toggle = () => {
    setState(dataCenter.save(state, { expand: !expand }));
  };

  return (
    <Form
      form={form}
      // fields={fields}
      name="card_search"
      className="ant-advanced-search-form"
      onFinish={handleSearch}
      onFinishFailed={handleFailed}
    >
      <Row gutter={24}>
        {searchFields.map((item, index) => {
          return (
            <Col
              span={8}
              key={index}
              style={{ display: index < fieldShowCount ? "block" : "none" }}
            >
              {item}
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
            Clear
          </Button>
          <a style={{ marginLeft: 8, fontSize: 12 }} onClick={toggle}>
            Collapse {expand ? <UpOutlined /> : <DownOutlined />}
          </a>
        </Col>
      </Row>
    </Form>
  );
}

cardSearch.propTypes = {
  sendData: PropTypes.func.isRequired
};

export default cardSearch; // name为表单域内字段 id 的前缀

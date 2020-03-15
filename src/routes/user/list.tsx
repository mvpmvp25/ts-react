import React from 'react';
import { Modal, Button } from 'antd';
// import '../../style/welcome.scss';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  showModal() {
    this.setState({
      visible: true
    });
  }

  handleOk() {
    this.setState({
      visible: false
    });
  }

  handleCancel() {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal.bind(this)}>
          Open Modal
        </Button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}

// UserList.propTypes = {

// };

export default UserList;

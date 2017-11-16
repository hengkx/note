import React from 'react';
import { Card, Input, Button } from 'antd';
import Param from '../../containers/Param';

const InputGroup = Input.Group;

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }
  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  }
  handleAddClick = () => {
    const { project } = this.props;
    const { email } = this.state;
    this.props.addMember({ email, _id: project._id });
  }
  render() {
    const { project } = this.props;
    const { email } = this.state;
    return (
      <div>
        <Card title="项目成员" style={{ marginBottom: 24 }} bordered={false}>
          <InputGroup compact>
            <Input
              style={{ width: '30%' }}
              value={email}
              onChange={this.handleEmailChange}
              placeholder="请输入帐号"
              addonBefore="帐号"
            />
            <Button onClick={this.handleAddClick}>添加</Button>
          </InputGroup>
        </Card>
        <Card title="请求参数" style={{ marginBottom: 24 }} bordered={false}>
          <Param
            isRequest
            project={project._id}
          />
        </Card>
        <Card title="响应参数" style={{ marginBottom: 24 }} bordered={false}>
          <Param
            project={project._id}
          />
        </Card>
      </div>
    );
  }
}

export default Setting;

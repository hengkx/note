import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Button, List, message } from 'antd';
import Param from '../../containers/Param';

const InputGroup = Input.Group;

class Setting extends React.Component {
  static propTypes = {
    project: PropTypes.object,
    getById: PropTypes.func.isRequired,
    addMember: PropTypes.func.isRequired,
    removeMember: PropTypes.func.isRequired,
    addMemberResult: PropTypes.object,
    removeMemberResult: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    const { addMemberResult, removeMemberResult } = nextProps;
    if (addMemberResult !== this.props.addMemberResult) {
      if (addMemberResult.code === 0) {
        this.props.getById(this.props.project);
      } else {
        message.error(addMemberResult.message);
      }
    }
    if (removeMemberResult !== this.props.removeMemberResult) {
      if (removeMemberResult.code === 0) {
        this.props.getById(this.props.project);
      } else {
        message.error(removeMemberResult.message);
      }
    }
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  }
  handleAddClick = () => {
    const { project } = this.props;
    const { email } = this.state;
    this.props.addMember({ email, _id: project._id });
  }
  handleRemoveMemberClick = (item) => {
    const { project } = this.props;
    this.props.removeMember({ user: item._id, _id: project._id });
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
          <List
            bordered
            dataSource={project.members}
            renderItem={item => (<List.Item>{item.email}<a href="javascript:;" onClick={() => this.handleRemoveMemberClick(item)}>移除项目组</a></List.Item>)}
          />
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

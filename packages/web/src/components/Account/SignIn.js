import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, message, Button } from 'antd';
import { Link } from 'react-router-dom';
import { rsa } from '../../utils';
import './less/account.less';

const FormItem = Form.Item;

class SignIn extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    sendActiveEmail: PropTypes.func.isRequired,
    signIn: PropTypes.func.isRequired,
    signInResult: PropTypes.object,
    sendActiveEmailResult: PropTypes.object,
  }

  static defaultProps = {
    signInResult: undefined
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const { signInResult, sendActiveEmailResult } = nextProps;
    if (signInResult !== this.props.signInResult) {
      if (signInResult.code === 1000) {
        message.error(signInResult.message);
        this.setState({ isShowActive: true });
      } else if (signInResult.code !== 0) {
        message.error(signInResult.message);
      } else {
        this.props.history.push('/home/project');
      }
    }
    if (sendActiveEmailResult !== this.props.sendActiveEmailResult) {
      if (sendActiveEmailResult.code === 0) {
        message.success('激活信息发送成功');
      }
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const password = rsa.encrypt(values.password);
        // const password = values.password;
        this.props.signIn({
          password,
          email: values.email
        });
        this.setState({ email: values.email });
      }
    });
  }
  handleSendActiveEmailClick = () => {
    const { email } = this.state;
    this.props.sendActiveEmail({ email });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isShowActive } = this.state;
    return (
      <Form className="account" onSubmit={this.handleSubmit}>
        <h1>云笔记</h1>
        <FormItem
          hasFeedback
        >
          {getFieldDecorator('email', {
            rules: [
              { type: 'email', message: '请输入正确的邮箱!' },
              { required: true, message: '请输入邮箱!' }
            ]
          })(<Input placeholder="邮箱" />)}
        </FormItem>
        <FormItem
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码!' }
            ]
          })(<Input placeholder="密码" type="password" />)}
        </FormItem>
        {isShowActive &&
          <FormItem>
            <Button onClick={this.handleSendActiveEmailClick}>重新发送激活信息</Button>
          </FormItem>
        }
        <FormItem>
          <Button type="primary" htmlType="submit" size="large">登录</Button>
        </FormItem>
        <FormItem>
          没有帐号，<Link to="/signup">免费注册</Link>
          <Link to="/forgot" style={{ float: 'right' }}>忘记密码？</Link>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(SignIn);

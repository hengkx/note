import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, message, Button } from 'antd';
import { Link } from 'react-router-dom';
// import { rsa } from '../../utils';
import './less/account.less';

const FormItem = Form.Item;

class SignIn extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    signIn: PropTypes.func.isRequired,
    signInResult: PropTypes.object
  }

  static defaultProps = {
    signInResult: undefined
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const { signInResult } = nextProps;
    if (signInResult !== this.props.signInResult) {
      if (signInResult.code !== 0) {
        message.error(signInResult.message);
      } else {
        this.props.history.push('/');
      }
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // const password = rsa.encrypt(values.password);
        const password = values.password;
        this.props.signIn({
          password,
          email: values.email
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <Form className="account" onSubmit={this.handleSubmit}>
        <h1>云笔记</h1>
        <FormItem
          {...formItemLayout}
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
          {...formItemLayout}
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码!' }
            ]
          })(<Input placeholder="密码" type="password" />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">登录</Button>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          没有帐号，<Link to="/signup">免费注册</Link>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(SignIn);

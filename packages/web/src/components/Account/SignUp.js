import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Button, message } from 'antd';
import { Link } from 'react-router-dom';
// import { rsa } from '../../utils';

const FormItem = Form.Item;

class SignUp extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    signUp: PropTypes.func.isRequired,
    checkUsernameExist: PropTypes.func.isRequired,
    signUpResult: PropTypes.object,
    checkUsernameExistResult: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      sendEmailCode: '获取验证码'
    };
  }

  componentWillReceiveProps(nextProps) {
    const { signUpResult, checkUsernameExistResult } = nextProps;
    if (signUpResult !== this.props.signUpResult) {
      if (signUpResult.code !== 0) {
        message.error(signUpResult.message);
      } else {
        this.props.history.push('/signin');
      }
    }

    if (checkUsernameExistResult !== this.props.checkUsernameExistResult) {
      if (checkUsernameExistResult.code !== 0) {
        this.props.form.setFields({
          username: {
            value: this.props.form.getFieldValue('username'),
            errors: [new Error(checkUsernameExistResult.message)],
          },
        });
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const password = values.password;// rsa.encrypt(values.password);

        this.props.signUp({
          password,
          email: values.email
        });
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('您输入的两次密码不一致!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  checkAgreement = (rule, value, callback) => {
    if (value) {
      return callback();
    }
    callback('服务条款必须同意!');
  }
  checkUsername = (rule, value, callback) => {
    if (value && value.length >= 6) {
      this.props.checkUsernameExist({ username: value });
    }
    callback();
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
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="邮箱"
        >
          {getFieldDecorator('email', {
            rules: [
              { type: 'email', message: '请输入正确的邮箱!' },
              { required: true, message: '请输入邮箱!' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [
              { min: 6, message: '密码不能小于6位!' },
              { required: true, message: '请输入密码!' },
              { validator: this.checkConfirm }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认密码"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [
              { required: true, message: '请输入确认密码!' },
              { validator: this.checkPassword }
            ]
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
          {getFieldDecorator('agreement', {
            initialValue: true,
            valuePropName: 'checked',
            rules: [
              { validator: this.checkAgreement }
            ]
          })(<Checkbox>我已阅读并同意<a href="">服务条款</a></Checkbox>)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">注册</Button>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          已有帐号，<Link to="/signin">直接登录</Link>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(SignUp);

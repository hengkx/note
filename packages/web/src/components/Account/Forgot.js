import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, message, Button } from 'antd';
import { Link } from 'react-router-dom';
import './less/account.less';

const FormItem = Form.Item;

class Forgot extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    forgot: PropTypes.func.isRequired,
    forgotResult: PropTypes.object
  }
  componentWillReceiveProps(nextProps) {
    const { forgotResult } = nextProps;
    if (forgotResult !== this.props.forgotResult) {
      if (forgotResult.code !== 0) {
        message.error(forgotResult.message);
      } else {
        message.success('密码已发送到您的邮箱请注意查收！');
      }
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.forgot({ email: values.email });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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
        <FormItem>
          <Button type="primary" htmlType="submit" size="large">找回密码</Button>
        </FormItem>
        <FormItem>
          <Link to="/signin">点击返回登录</Link>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Forgot);

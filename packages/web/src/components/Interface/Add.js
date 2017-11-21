import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input, Button, Card } from 'antd';
import PageHeaderLayout from '../PageHeaderLayout';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class Add extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    add: PropTypes.func.isRequired,
    addResult: PropTypes.object,
    project: PropTypes.object,
    groups: PropTypes.array,
  }

  componentWillReceiveProps(nextProps) {
    const { addResult } = nextProps;
    if (addResult !== this.props.addResult) {
      if (addResult.code === 0) {
        this.props.history.push(`${this.props.match.url}/${addResult.data._id}`);
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { id } = this.props.match.params;
        this.props.add({ ...values, project: id });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { groups } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
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
          offset: 4,
        },
      },
    };
    const prefixSelector = getFieldDecorator('method', {
      initialValue: 'GET',
    })(<Select style={{ width: 70 }}>
      <Option value="GET">GET</Option>
      <Option value="POST">POST</Option>
      <Option value="PUT">PUT</Option>
      <Option value="PATCH">PATCH</Option>
      <Option value="DELETE">DELETE</Option>
    </Select>);
    const { project } = this.props;
    return (
      <PageHeaderLayout
        title={project.name}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入名称!' }],
              })(<Input placeholder="请输入名称" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="请求"
            >
              {getFieldDecorator('url', {
                rules: [{ required: true, message: '请输入相对路径，支持路径参数，例如：/api/get/:id' }],
              })(<Input addonBefore={prefixSelector} placeholder="请输入相对路径，支持路径参数，例如：/api/get/:id" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分组"
            >
              {getFieldDecorator('group', {
                initialValue: ''
              })(
                <Select
                  placeholder="选择分组"
                >
                  <Option value="" >未分组</Option>
                  {groups.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)}
                </Select>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
              })(<TextArea placeholder="请输入备注" />)}
            </FormItem>
            <FormItem
              {...tailFormItemLayout}
            >
              <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(Add);

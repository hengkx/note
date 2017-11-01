import React, { Component } from 'react';
import { Table, Button, Input, Form } from 'antd';
import DynamicTable from '../DynamicTable';

const FormItem = Form.Item;

class TableC extends Component {
  handleChange = (val) => {
    console.log(val);
  }
  render() {
    const columns = [
      {
        title: '表名',
        dataIndex: 'name',
        key: 'name',
      },
    ];
    const tables = [];
    const { getFieldDecorator } = this.props.form;

    const tableColumns = [
      {
        title: '字段名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '非空',
        dataIndex: 'required',
        type: 'checkbox'
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ];
    const source = [
      {
        name: 'test',
        required: true
      }
    ];
    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '' }],
            })(<Input />)}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">添加</Button>
          </FormItem>
        </Form>
        <Input placeholder="表名" />
        <DynamicTable dataSource={source} columns={tableColumns} onChange={this.handleChange} />
        <div className="column">
          <div className="title">

          </div>
        </div>
        <Table dataSource={tables} columns={columns} />
      </div>
    );
  }
}

export default Form.create()(TableC);

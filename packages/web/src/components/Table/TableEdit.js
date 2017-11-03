import React from 'react';
import { Table, Button, Input, Form } from 'antd';
import find from 'lodash/find';
import DynamicTable from '../DynamicTable';

const FormItem = Form.Item;

class TableEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: []
    };
  }

  componentDidMount() {
    const { tableId } = this.props.match.params;
    if (tableId) {
      this.props.getById({ id: tableId });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { getByIdResult } = nextProps;
    if (getByIdResult !== this.props.getByIdResult) {
      const { data } = getByIdResult;
      this.setState({ table: data, columns: data.columns });
      this.props.form.setFieldsValue({
        name: data.name,
        remark: data.remark
      });
    }
  }

  handleChange = (val) => {
    this.setState({ columns: val });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { columns } = this.state;
        const { id, tableId } = this.props.match.params;
        if (tableId) {
          this.props.update({ ...values, id: tableId, columns });
        } else {
          this.props.add({ ...values, project: id, columns });
        }
      }
    });
  }

  render() {
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
    const { columns } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="表名"
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '' }],
            })(<Input />)}
          </FormItem>
          <FormItem
            label="备注"
          >
            {getFieldDecorator('remark', {
            })(<Input />)}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">添加</Button>
          </FormItem>
        </Form>
        <DynamicTable dataSource={columns} columns={tableColumns} onChange={this.handleChange} />
      </div>
    );
  }
}

export default Form.create({
  // mapPropsToFields: (props) => {
  //   if (props.match.params.tableId && props.getByIdResult && props.getByIdResult.data) {
  //     const { name, remark = '' } = props.getByIdResult.data;
  //     return {
  //       name: { value: name },
  //       remark: { value: remark },
  //     };
  //   }
  // }
})(TableEdit);

import React, { Component } from 'react';
import { Button, Input, Form, Table } from 'antd';
import { Route, Link } from 'react-router-dom';
import moment from 'moment';
import DynamicTable from '../DynamicTable';
import TableEdit from '../../containers/TableEdit';

const FormItem = Form.Item;

class TableC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      tables: []
    };
  }
  componentDidMount() {
    this.props.getList();
  }
  componentWillReceiveProps(nextProps) {
    const { getListResult } = nextProps;
    if (getListResult !== this.props.getListResult) {
      this.setState({ tables: getListResult.data });
    }
  }


  render() {
    const { tables } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { match } = this.props;
    const columns = [
      {
        title: '项目',
        dataIndex: 'name',
        render: (text, record) =>
          (<Link key={record._id} to={`${match.url}/table/${record._id}`}>{text}</Link>)
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        render: (text) =>
          (moment.unix(text).format('YYYY-MM-DD HH:mm:ss'))
      },
      {
        title: '修改时间',
        dataIndex: 'updated_at',
        render: (text) =>
          (moment.unix(text).format('YYYY-MM-DD HH:mm:ss'))
      },
    ];
    return (
      <div>
        {match.isExact &&
          <div>
            <Link to={`${match.url}/table`}>添加表</Link>
            <Table rowKey="_id" dataSource={tables} columns={columns} />
          </div>
        }

        <Route path={`${match.path}/table/:tableId?`} component={TableEdit} />
      </div>
    );
  }
}

export default Form.create()(TableC);

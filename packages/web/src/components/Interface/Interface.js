import React from 'react';
import moment from 'moment';
import { Button, Input, Form, Table } from 'antd';
import { Route, Link } from 'react-router-dom';

class Interface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interfaces: []
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getList({ project: id });
  }
  componentWillReceiveProps(nextProps) {
    const { getListResult } = nextProps;
    if (getListResult !== this.props.getListResult) {
      this.setState({ interfaces: getListResult.data });
    }
  }

  render() {
    const { match } = this.props;
    const { interfaces } = this.state;
    const columns = [
      {
        title: '接口名称',
        dataIndex: 'name',
        render: (text, record) =>
          (<Link key={record.id} to={`${match.url}/interface/${record.id}`}>{text}</Link>)
      },
      {
        title: '请求方式',
        dataIndex: 'method',
      },
      {
        title: '请求地址',
        dataIndex: 'url',
      },
      {
        title: '备注',
        dataIndex: 'remark',
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
        <Table rowKey="_id" dataSource={interfaces} columns={columns} />
      </div>
    );
  }
}

export default Interface;

import React, { Component } from 'react';
import { Button, Input, Form, Table } from 'antd';
import { Route, Link } from 'react-router-dom';
import moment from 'moment';
import DynamicTable from '../DynamicTable';
import TableEdit from '../../containers/TableEdit';

const FormItem = Form.Item;
const { TextArea } = Input;


function getTables(text) {
  const lineBreak = '\\r?\\n';
  const contentLine = '\\|?.*\\|.*\\|?';
  const hyphenLine = '\\|?[ :]*[-]{3,}[- :\\|]*\\|?';
  const tableRegex = new RegExp(`## .*${lineBreak}${lineBreak}${contentLine}${lineBreak}${hyphenLine}(?:${lineBreak}${contentLine})*`, 'g');
  const tables = text.match(tableRegex);
  const result = [];
  tables.forEach(item => {
    const rows = item.split(/\r?\n/g);
    try {
      const [, remark, tableName] = /## (.*)\((.*)\)/.exec(rows[0]);
      const columns = [];
      for (let i = 4; i < rows.length; i += 1) {
        const [name, type, required, defaultValue, colRemark] =
          rows[i].trim().replace(/^\|/g, '').replace(/\|$/g, '').trim().split(/\s*\|\s*/g);
        columns.push({
          name,
          type,
          defaultValue,
          required: required === '是',
          remark: colRemark
        });
      }
      result.push({
        columns,
        remark,
        name: tableName
      });
    } catch (error) {
      console.log('format invalid');
    }
  });
  return result;
}

class TableC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      tables: []
    };
    console.log(this.props.match.params.id);
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
  handleChange = (e) => {
    const content = e.target.value;

    this.setState({ content: e.target.value });
    console.log(getTables(content));
  }
  handleClick = () => {
    const { content } = this.state;
    const tables = getTables(content);
    tables.forEach(item => {
      this.props.add({ ...item, project: this.props.match.params.id });
    });
  }
  render() {
    const { tables, content } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { match } = this.props;
    const columns = [
      {
        title: '表名',
        dataIndex: 'name',
        render: (text, record) =>
          (<Link key={record._id} to={`${match.url}/table/${record._id}`}>{text}</Link>)
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
        {match.isExact &&
          <div>
            <Link to={`${match.url}/table`}>添加表</Link>
            <Table rowKey="_id" dataSource={tables} columns={columns} />
            <TextArea value={content} onChange={this.handleChange} />
            <Button onClick={this.handleClick}>生成</Button>
          </div>
        }

        <Route path={`${match.path}/table/:tableId?`} component={TableEdit} />
      </div>
    );
  }
}

export default Form.create()(TableC);

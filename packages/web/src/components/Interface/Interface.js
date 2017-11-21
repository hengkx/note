import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import queryString from 'query-string';
import { Card, Table, Button, Modal, Select } from 'antd';
import { Link } from 'react-router-dom';
import './less/interface.less';

const Option = Select.Option;

class Interface extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    getListResult: PropTypes.object,
    groups: PropTypes.array,
  }
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      projectId: id,
      interfaces: [],
      ids: []
    };
  }

  componentDidMount() {
    this.getInterfaceList();
  }
  componentWillReceiveProps(nextProps) {
    const { getListResult } = nextProps;
    if (getListResult !== this.props.getListResult) {
      this.setState({ interfaces: getListResult.data });
    }
  }

  getInterfaceList = (group) => {
    const { id } = this.props.match.params;
    if (group) {
      this.props.getList({ project: id, group });
    } else if (group === '') {
      this.props.getList({ project: id });
    } else {
      const parsed = queryString.parse(this.props.location.search);
      this.props.getList({ project: id, ...parsed });
    }
  }
  handleSelectedGroup = (group) => {
    const { match } = this.props;
    if (group) {
      this.props.history.push(`${match.url}?group=${group}`);
    } else {
      this.props.history.push(match.url);
    }
    this.getInterfaceList(group);
  }
  handleSaveGroup = () => {
    const { projectId, ids } = this.state;
    // this.props.batchSetGroup({ project: projectId, ids });
  }
  render() {
    const { match } = this.props;
    const { interfaces, ids } = this.state;
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
        dataIndex: 'display_url',
      },
      {
        title: '分组',
        dataIndex: 'group',
        render: (text) => (text ? text.name : '')
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

    const { groups } = this.props;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ ids: selectedRowKeys });
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
      }),
    };
    return (
      <Card bordered={false}>
        <div className="interface">
          <ul className="group">
            <li onClick={() => this.handleSelectedGroup('')}>所有接口</li>
            <li onClick={() => this.handleSelectedGroup('-1')}>未分组</li>
            {groups.map(item => (
              <li key={item._id} onClick={() => this.handleSelectedGroup(item._id)}>{item.name}</li>
            ))}
          </ul>
          <div className="list">
            {ids.length > 0 &&
              <div className="action">
                <Button onClick={() => this.setState({ visible: true })}>修改分组</Button>
              </div>
            }
            <Table rowSelection={rowSelection} rowKey="_id" dataSource={interfaces} columns={columns} />
          </div>
        </div>
        <Modal
          title="修改分组"
          visible={this.state.visible}
          onOk={this.handleSaveGroup}
          onCancel={() => this.setState({ visible: false })}
        >
          <Select
            placeholder="选择分组"
            style={{ width: '100%' }}
          >
            <Option value="" >未分组</Option>
            {groups.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)}
          </Select>
        </Modal>
      </Card>
    );
  }
}

export default Interface;

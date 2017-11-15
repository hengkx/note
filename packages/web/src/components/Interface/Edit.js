import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Card } from 'antd';
import PageHeaderLayout from '../PageHeaderLayout';
import Param from '../../containers/Param';
import { toTree } from '../../utils';

const Option = Select.Option;
const TextArea = Input.TextArea;

class Edit extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    getById: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    getByIdResult: PropTypes.object,
    getParamListResult: PropTypes.object,
    project: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      api: {}
    };
  }

  componentDidMount() {
    const { interfaceId } = this.props.match.params;
    this.props.getById({ id: interfaceId });
  }
  componentWillReceiveProps(nextProps) {
    const { getByIdResult, getParamListResult } = nextProps;
    if (getByIdResult !== this.props.getByIdResult) {
      this.setState({ api: getByIdResult.data });
    }
    if (getParamListResult !== this.props.getParamListResult) {
      const params = toTree(getParamListResult.data);
      this.setState({ params });
    }
  }

  handleBlur = (key) => {
    const { api } = this.state;
    const { interfaceId } = this.props.match.params;
    this.props.edit({ id: interfaceId, [key]: api[key] });
  }
  handleChange = (val, key) => {
    const { api } = this.state;
    api[key] = val;
    this.setState({ api });
    if (key === 'method') {
      const { interfaceId } = this.props.match.params;
      this.props.edit({ id: interfaceId, [key]: val });
    }
  }
  render() {
    const { project } = this.props;
    const { interfaceId, id } = this.props.match.params;
    const { api } = this.state;
    const prefixSelector = (
      <Select
        value={api.method}
        onChange={(val) => this.handleChange(val, 'method')}
        style={{ width: 70 }}
      >
        <Option value="GET">GET</Option>
        <Option value="POST">POST</Option>
        <Option value="PUT">PUT</Option>
        <Option value="PATCH">PATCH</Option>
        <Option value="DELETE">DELETE</Option>
      </Select>
    );
    return (
      <PageHeaderLayout
        title={project.name}
      >
        <Card title="基础信息" style={{ marginBottom: 24 }} bordered={false}>
          <Input
            value={api.name}
            onBlur={() => this.handleBlur('name')}
            onChange={(e) => this.handleChange(e.target.value, 'name')}
          />
          <Input
            value={api.url}
            addonBefore={prefixSelector}
            onBlur={() => this.handleBlur('url')}
            onChange={(e) => this.handleChange(e.target.value, 'url')}
            placeholder="请输入相对路径，支持路径参数，例如：/api/get/:id"
          />
          <TextArea
            value={api.remark}
            onBlur={() => this.handleBlur('remark')}
            onChange={(e) => this.handleChange(e.target.value, 'remark')}
          />
          <a href={`${window.baseURL}mock/${project._id}/${api.url}`} target="_blank">伪造数据</a>
        </Card>
        <Card title="请求参数" style={{ marginBottom: 24 }} bordered={false}>
          <Param
            isRequest
            interfaceId={interfaceId}
            project={id}
          />
        </Card>
        <Card title="响应参数" style={{ marginBottom: 24 }} bordered={false}>
          <Param
            interfaceId={interfaceId}
            project={id}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Edit;

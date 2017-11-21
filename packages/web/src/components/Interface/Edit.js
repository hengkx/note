import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Card, message } from 'antd';
import PageHeaderLayout from '../PageHeaderLayout';
import Param from '../../containers/Param';
import ParamSelect from '../Select';

const Option = Select.Option;
const TextArea = Input.TextArea;

class Edit extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    getById: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    getByIdResult: PropTypes.object,
    editResult: PropTypes.object,
    project: PropTypes.object,
    user: PropTypes.object,
    groups: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {
      api: {}
    };
  }

  componentDidMount() {
    const { interfaceId, id } = this.props.match.params;
    this.props.getById({ id: interfaceId, project: id });
  }
  componentWillReceiveProps(nextProps) {
    const { getByIdResult, editResult } = nextProps;
    if (getByIdResult !== this.props.getByIdResult) {
      this.setState({ api: getByIdResult.data });
    }
    if (editResult !== this.props.editResult) {
      if (editResult.code === 0) {
        message.success('更新成功');
      }
    }
  }

  handleBlur = (key) => {
    const { api } = this.state;
    const { interfaceId } = this.props.match.params;
    this.props.edit({ id: interfaceId, [key]: api[key] });
  }
  handleChange = (val, key) => {
    const { api } = this.state;
    if (key === 'group') {
      if (!api.group) api.group = {};
      api.group._id = val;
    } else {
      api[key] = val;
    }
    this.setState({ api });
    if (key === 'method' || key === 'group') {
      const { interfaceId } = this.props.match.params;
      this.props.edit({ id: interfaceId, [key]: val });
    }
  }
  handleReqParamChange = (val, key) => {
    const { interfaceId } = this.props.match.params;
    const { api } = this.state;
    api.req_param_type[key] = val;
    this.props.edit({ id: interfaceId, req_param_type: api.req_param_type });
  }
  handleResParamChange = (val, key) => {
    const { interfaceId } = this.props.match.params;
    const { api } = this.state;
    api.res_param_type[key] = val;
    this.props.edit({ id: interfaceId, res_param_type: api.res_param_type });
  }
  render() {
    const { project, user, groups } = this.props;
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
        {user._id !== project.user &&
          <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 9999 }} />
        }
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

          <Select
            placeholder="选择分组"
            value={api.group ? api.group._id : ''}
            onChange={(val) => this.handleChange(val, 'group')}
          >
            <Option value="" >未分组</Option>
            {groups.map(item => <Option key={item._id} value={item._id}>{item.name}</Option>)}
          </Select>

          <a href={`${window.baseURL}mock/${project._id}/${api.url}`} target="_blank">伪造数据</a>
          {api.req_param_type &&
            <Card title="请求动态参数" style={{ marginBottom: 24 }}>
              {Object.keys(api.req_param_type).map(key => (
                <div key={key} style={{ display: 'flex' }}>
                  <span style={{ width: 80, textAlign: 'right', marginRight: 10, lineHeight: '30px' }}>{key}</span>
                  <ParamSelect
                    style={{ flex: 1, margin: 0 }}
                    value={api.req_param_type[key]}
                    onChange={(val) => this.handleReqParamChange(val, key)}
                  />
                </div>
              ))}
            </Card>
          }
          {api.res_param_type &&
            <Card title="响应动态参数">
              {Object.keys(api.res_param_type).map(key => (
                <div key={key} style={{ display: 'flex' }}>
                  <span style={{ width: 80, textAlign: 'right', marginRight: 10, lineHeight: '30px' }}>{key}</span>
                  <ParamSelect
                    style={{ flex: 1, margin: 0 }}
                    value={api.res_param_type[key]}
                    onChange={(val) => this.handleResParamChange(val, key)}
                  />
                </div>
              ))}
            </Card>
          }
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

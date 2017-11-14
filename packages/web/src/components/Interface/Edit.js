import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import Mock from 'mockjs';
import brace from 'brace';// eslint-disable-line no-unused-vars
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/tomorrow_night_eighties';
// import Param from '../Param';
import Param from '../../containers/Param';
import { toTree } from '../../utils';

window.Mock = Mock;
window.Random = Mock.Random;

const Option = Select.Option;
const TextArea = Input.TextArea;

function getParamsMockObj(params) {
  const paramsObj = {};
  params.forEach(item => {
    let value;
    if (!item.rule) {
      if (item.type === 'String') {
        value = Mock.Random.string();
      } else if (item.type === '[String]') {
        value = [Mock.Random.string(), Mock.Random.string(), Mock.Random.string()];
      } else if (item.type === 'Number') {
        value = Math.random();
      } else if (item.type === 'Boolean') {
        value = Mock.Random.pick([true, false]);
      } else if (item.type === '[Boolean]') {
        const arr = [];
        let i = 0;
        while (i < 3) {
          arr.push(Mock.Random.pick([true, false]));
          i += 1;
        }
        value = arr;
      }
    } else {
      try {
        value = eval(item.rule);
      } catch (error) {
        console.log(error);
      }
    }
    if (item.type.indexOf('Object') !== -1 && item.children) {
      if (item.type === '[Object]') {
        const arr = [];
        let i = 0;
        while (i < 3) {
          arr.push(getParamsMockObj(item.children));
          i += 1;
        }
        value = arr;
      } else {
        value = getParamsMockObj(item.children);
      }
    }
    paramsObj[item.name] = value;
  });
  return paramsObj;
}

class Edit extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    getById: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    getByIdResult: PropTypes.object,
    getParamListResult: PropTypes.object,
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
      this.setState({ params, example: JSON.stringify(getParamsMockObj(params), null, 2) });
    }
  }


  handleResponseParamChange = (params) => {
    this.setState({ responseExample: JSON.stringify(getParamsMockObj(params), null, 2) });
  }
  handleRequestParamChange = (params) => {
    this.setState({ requestExample: JSON.stringify(getParamsMockObj(params), null, 2) });
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
    const { interfaceId, id } = this.props.match.params;
    const { requestExample, responseExample, api } = this.state;
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
      <div>
        <Link to={`/home/project/${id}`}>返回项目</Link>
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
        请求参数
        <Param
          isRequest
          interfaceId={interfaceId}
          project={id}
          onChange={this.handleRequestParamChange}
        />
        <AceEditor
          mode="json"
          theme="tomorrow_night_eighties"
          name="REQUEST_EXAMPLE"
          fontSize={14}
          width="100%"
          showPrintMargin={false}
          value={requestExample}
          editorProps={{ $blockScrolling: true }}
          readOnly
          maxLines={50}
        />
        响应参数
        <Param
          interfaceId={interfaceId}
          project={id}
          onChange={this.handleResponseParamChange}
        />
        <AceEditor
          mode="json"
          theme="tomorrow_night_eighties"
          name="RESPONSE_EXAMPLE"
          fontSize={14}
          width="100%"
          showPrintMargin={false}
          value={responseExample}
          editorProps={{ $blockScrolling: true }}
          readOnly
          maxLines={50}
        />

      </div>
    );
  }
}

export default Edit;

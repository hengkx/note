import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import Row from './Row';
import { toTree } from '../../utils';
import './less/param.less';

class Param extends React.Component {
  static propTypes = {
    interfaceId: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    getList: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    getListResult: PropTypes.object,
    editResult: PropTypes.object,
    delResult: PropTypes.object,
    addResult: PropTypes.object,
    onChange: PropTypes.func,
    isRequest: PropTypes.bool
  }
  static defaultProps = {
    onChange: () => { },
    isRequest: false
  }

  constructor(props) {
    super(props);
    this.state = {
      params: [],
      isRequest: props.isRequest
    };
  }
  componentDidMount() {
    this.getParamList();
  }

  componentWillReceiveProps(nextProps) {
    const { getListResult, editResult, delResult, addResult, isRequest } = nextProps;
    if (getListResult !== this.props.getListResult) {
      if (getListResult.data.is_request === isRequest) {
        const params = toTree(getListResult.data.params);
        this.setState({ params });
        this.props.onChange(params);
      }
    }
    if (editResult !== this.props.editResult) {
      if (editResult.code === 0 && editResult.data.is_request === isRequest) {
        message.success('更新成功');
        this.getParamList();
      }
    }
    if (delResult !== this.props.delResult && delResult.data.is_request === isRequest) {
      this.getParamList();
    }
    if (addResult !== this.props.addResult && addResult.data.is_request === isRequest) {
      this.getParamList();
    }
  }
  getParamList = () => {
    const { interfaceId, isRequest } = this.props;
    this.props.getList({ interface: interfaceId, is_request: isRequest });
  }
  getCurrentParam = (keys) => {
    const paths = keys.split('.');
    const { params } = this.state;
    if (!params[paths[1]].children) {
      params[paths[1]].children = [];
    }
    let current = params[paths[1]].children;
    for (let i = 2; i < paths.length; i += 1) {
      if (!current[paths[i]].children) {
        current[paths[i]].children = [];
      }
      current = current[paths[i]].children;
    }
    return current;
  }
  handleAddClick = (parent) => {
    const { params } = this.state;
    if (parent) {
      const current = this.getCurrentParam(parent);
      current.push({ type: 'String', required: true });
    } else {
      params.push({ type: 'String', required: true });
    }
    this.setState({ params });
    this.props.onChange(params);
  }
  handleParamChange = (param, key) => {
    const { params } = this.state;
    this.setState({ params });

    if (key === 'type' || key === 'required') {
      this.props.edit({ [key]: param[key], id: param._id });
    }
  }
  handleDel = (index) => {
    const paths = index.split('.');
    const { params } = this.state;
    let del;
    if (paths.length === 2) {
      del = { ...params[paths[1]] };
      params.splice(paths[1], 1);
    } else {
      let current = params[paths[1]].children;
      for (let i = 2; i < paths.length; i += 1) {
        if (paths.length - 1 === i) {
          del = { ...current[paths[i]] };
          current.splice(paths[i], 1);
        } else {
          current = current[paths[i]].children;
        }
      }
    }
    this.setState({ params });
    this.props.del(del);
  }
  handleBlur = (param, key) => {
    if (param._id) {
      this.props.edit({ [key]: param[key], id: param._id });
    }
  }
  handleSaveClick = () => {
    const { params } = this.state;
    const { interfaceId, project, isRequest } = this.props;
    this.props.add({ params, project, interface: interfaceId, is_request: isRequest });
  }
  renderEditor = (params = [], parent = '') => (
    <div className="editor">
      <div className="editor-core">
        <div className="editor-hd">
          <div>名称</div>
          <div>类型</div>
          <div>备注</div>
          <div className="required">必须</div>
          <div>默认值</div>
          <div>生成规则</div>
          <div className="action" />
        </div>
        <div className="editor-bd">
          {params.map((item, index) => (
            <div key={index}>
              <Row
                param={item}
                onDel={() => this.handleDel(`${parent}.${index}`)}
                onBlur={(key) => this.handleBlur(item, key)}
                onChange={(param, key) => this.handleParamChange(param, key, `${parent}.${index}`)}
              />
              {item.type.indexOf('Object') !== -1 &&
                <div className="nest">
                  {this.renderEditor(item.children, `${parent}.${index}`)}
                </div>
              }
            </div>
          ))}
        </div>
      </div>
      <div className="editor-action">
        <button className="btn" onClick={() => this.handleAddClick(parent)}>添加</button>
        {!parent &&
          <button className="btn save" onClick={this.handleSaveClick}>保存</button>
        }
      </div>
    </div>
  );

  render() {
    const { params } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <div className="param">
          {this.renderEditor(params)}
        </div>
      </div>
    );
  }
}

export default Param;

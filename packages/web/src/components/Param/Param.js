import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';
import './less/param.less';

class Param extends React.Component {
  static propTypes = {
    params: PropTypes.object,
    onChange: PropTypes.func,
    onDel: PropTypes.func,
  }
  static defaultProps = {
    onChange: () => { },
    onDel: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      params: props.params || []
    };
  }

  getCurrentParam = (keys) => {
    const paths = keys.split('.');
    const { params } = this.state;
    if (!params[paths[1]].childrens) {
      params[paths[1]].childrens = [];
    }
    let current = params[paths[1]].childrens;
    for (let i = 2; i < paths.length; i += 1) {
      if (!current[paths[i]].childrens) {
        current[paths[i]].childrens = [];
      }
      current = current[paths[i]].childrens;
    }
    return current;
  }
  handleAddClick = (parent) => {
    const { params } = this.state;
    if (parent) {
      const current = this.getCurrentParam(parent);
      current.push({ type: 'String' });
    } else {
      params.push({ type: 'String' });
    }
    this.setState({ params });
    this.props.onChange(params);
  }
  handleParamChange = (param, key) => {
    const { params } = this.state;
    this.setState({ params });
    this.props.onChange(params, param, key);
  }
  handleDel = (index) => {
    const paths = index.split('.');
    const { params } = this.state;
    let del;
    if (paths.length === 2) {
      del = { ...params[paths[1]] };
      params.splice(paths[1], 1);
    } else {
      let current = params[paths[1]].childrens;
      for (let i = 2; i < paths.length; i += 1) {
        if (paths.length - 1 === i) {
          del = { ...current[paths[i]] };
          current.splice(paths[i], 1);
        } else {
          current = current[paths[i]].childrens;
        }
      }
    }
    this.setState({ params });
    this.props.onDel(del);
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
                onChange={(param, key) => this.handleParamChange(param, key, `${parent}.${index}`)}
              />
              {item.type.indexOf('Object') !== -1 &&
                <div className="nest">
                  {this.renderEditor(item.childrens, `${parent}.${index}`)}
                </div>
              }
            </div>
          ))}
        </div>
      </div>
      <div className="editor-action">
        <button className="btn" onClick={() => this.handleAddClick(parent)}>添加</button>
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

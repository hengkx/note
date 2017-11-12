import React from 'react';
import Select from '../Select';
import Row from './Row';
import './less/param.less';

class Param extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: []
    };
  }

  getCurrentParam = (keys) => {
    const paths = keys.split('.');
    const { params } = this.state;
    if (!params[paths[1]].childrens) {
      params[paths[1]].childrens = [];
    }
    let current = params[paths[1]].childrens;
    let parent = params[paths[1]];
    for (let i = 2; i < paths.length; i += 1) {
      parent = current[paths[i]];
      current = current[paths[i]].childrens;
    }
    return { parent, current };
  }
  handleAddClick = (parent) => {
    const { params } = this.state;
    if (parent) {
      const { current } = this.getCurrentParam(parent);
      current.push({ type: 'String' });
    } else {
      params.push({ type: 'String' });
    }
    this.setState({ params });
  }
  handleParamChange = (param, key, index) => {
    // const paths = index.split('.');
    // const current = this.getCurrentParam(index);
    const { parent } = this.getCurrentParam(index);
    console.log(parent);
    // const { params } = this.state;
    // params[index] = param;
    // this.setState({ params });
    // console.log(params);
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
        </div>
        <div className="editor-bd">
          {params.map((item, index) => (
            <div key={index}>
              <Row
                param={item}
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

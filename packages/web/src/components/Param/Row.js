import React from 'react';
import PropTypes from 'prop-types';
import Select from '../Select';

class Row extends React.Component {
  static propTypes = {
    param: PropTypes.object.isRequired,
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
      param: props.param
    };
  }
  componentWillReceiveProps(nextProps) {
    const { param } = nextProps;
    if (param !== this.props.param) {
      this.setState({ param });
    }
  }
  handleChange = (val, key) => {
    const { param } = this.state;
    param[key] = val;
    this.setState({ param });
    this.props.onChange(param, key);
  }
  handleDelClick = () => {
    this.props.onDel();
  }
  render() {
    const { param } = this.state;
    return (
      <div className="editor-row">
        <div>
          <input
            type="text"
            placeholder="名称"
            value={param.name || ''}
            onChange={(e) => this.handleChange(e.target.value, 'name')}
          />
        </div>
        <div>
          <Select
            value={param.type || ''}
            onChange={(val) => this.handleChange(val, 'type')}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="备注"
            value={param.remark || ''}
            onChange={(e) => this.handleChange(e.target.value, 'remark')}
          />
        </div>
        <div className="required">
          <input
            type="checkbox"
            value={param.required}
            onChange={(e) => this.handleChange(e.target.checked, 'required')}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="默认值"
            value={param.defaultValue || ''}
            onChange={(e) => this.handleChange(e.target.value, 'defaultValue')}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="生成规则"
            value={param.rule || ''}
            onChange={(e) => this.handleChange(e.target.value, 'rule')}
          />
        </div>
        <div className="action">
          <button className="btn" onClick={this.handleDelClick}>X</button>
        </div>
      </div>
    );
  }
}

export default Row;

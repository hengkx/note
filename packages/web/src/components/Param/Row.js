import React from 'react';
import PropTypes from 'prop-types';
import Select from '../Select';

class Row extends React.Component {
  static propTypes = {
    param: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onDel: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool
  }
  static defaultProps = {
    onChange: () => { },
    onDel: () => { },
    onBlur: () => { },
    readOnly: false
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
  handleBlur = (key) => {
    const { readOnly } = this.props;
    if (!readOnly) this.props.onBlur(key);
  }
  render() {
    const { param } = this.state;
    const { readOnly } = this.props;
    return (
      <div className="editor-row">
        <div>
          <input
            type="text"
            readOnly={readOnly}
            placeholder="名称"
            value={param.name || ''}
            onBlur={() => this.handleBlur('name')}
            onChange={(e) => this.handleChange(e.target.value, 'name')}
          />
        </div>
        <div>
          <Select
            readOnly={readOnly}
            value={param.type || ''}
            onChange={(val) => this.handleChange(val, 'type')}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="备注"
            readOnly={readOnly}
            value={param.remark || ''}
            onBlur={() => this.handleBlur('remark')}
            onChange={(e) => this.handleChange(e.target.value, 'remark')}
          />
        </div>
        <div className="required">
          <input
            type="checkbox"
            disabled={readOnly}
            checked={param.required || false}
            onChange={(e) => this.handleChange(e.target.checked, 'required')}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="默认值"
            readOnly={readOnly}
            value={param.defaultValue || ''}
            onBlur={() => this.handleBlur('defaultValue')}
            onChange={(e) => this.handleChange(e.target.value, 'defaultValue')}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="生成规则"
            readOnly={readOnly}
            value={param.rule || ''}
            onBlur={() => this.handleBlur('rule')}
            onChange={(e) => this.handleChange(e.target.value, 'rule')}
          />
        </div>
        {!readOnly &&
          <div className="action">
            <button className="btn" onClick={this.handleDelClick}>X</button>
          </div>
        }
      </div>
    );
  }
}

export default Row;

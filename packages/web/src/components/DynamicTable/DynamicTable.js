import React from 'react';
import PropTypes from 'prop-types';

function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}


class DynamicTable extends React.Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array,
    onChange: PropTypes.func
  }
  static defaultProps = {
    onChange: () => { }
  }
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource || [],
      columns: props.columns
    };
  }
  componentWillReceiveProps(nextProps) {
    const { dataSource } = nextProps;
    if (dataSource && dataSource !== this.state.dataSource) {
      this.setState({ dataSource });
    }
  }

  handleAddClick = () => {
    const dataSource = [...this.state.dataSource];
    dataSource.push({});
    this.setState({ dataSource });
    this.props.onChange(dataSource);
  }
  handleValueChange = (e, column, index) => {
    let value;
    if (column.type === 'checkbox') {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    console.log(value, column, index);
    const dataSource = [...this.state.dataSource];
    dataSource[index][column.dataIndex] = value;
    this.setState({ dataSource });
    this.props.onChange(dataSource);
  }
  handleRemoveRowClick = (index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ dataSource });
    this.props.onChange(dataSource);
  }
  renderControl = (item, column, index) => {
    if (column.type === 'checkbox') {
      return <input type="checkbox" checked={fixControlledValue(item[column.dataIndex])} onChange={(e) => this.handleValueChange(e, column, index)} />;
    }
    return <input value={fixControlledValue(item[column.dataIndex])} onChange={(e) => this.handleValueChange(e, column, index)} />;
  }
  render() {
    const { dataSource, columns } = this.state;
    return (
      <div>
        <button onClick={this.handleAddClick}>增加</button>
        <table>
          <thead>
            <tr>
              {columns.map(item => (
                <th key={item.dataIndex}>
                  {item.title}
                </th>
              ))}
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {dataSource.map((item, index) => (
              <tr key={index}>
                {columns.map((column, i) => (
                  <td key={`${column.dataIndex}${i}`}>
                    {this.renderControl(item, column, index)}
                  </td>
                ))}
                <td><button onClick={() => this.handleRemoveRowClick(index)}>删除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DynamicTable;

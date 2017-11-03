import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import { Route, Link } from 'react-router-dom';
import DynamicTable from '../DynamicTable';
import TableEdit from '../../containers/TableEdit';

const FormItem = Form.Item;

class TableC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      tables: []
    };
  }
  componentDidMount() {
    this.props.getList();
  }
  componentWillReceiveProps(nextProps) {
    const { getListResult } = nextProps;
    if (getListResult !== this.props.getListResult) {
      this.setState({ tables: getListResult.data });
    }
  }


  render() {
    const { tables } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { match } = this.props;
    return (
      <div>
        {match.isExact &&
          <div>
            <Link to={`${match.url}/table`}>添加表</Link>
            {tables.map(item => <Link key={item.id} to={`${match.url}/table/${item.id}`}>{item.name}</Link>)}
          </div>
        }

        <Route path={`${match.path}/table/:tableId?`} component={TableEdit} />
      </div>
    );
  }
}

export default Form.create()(TableC);

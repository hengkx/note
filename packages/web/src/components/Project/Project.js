import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import { Route, Link } from 'react-router-dom';
import Table from '../../containers/Table';

const FormItem = Form.Item;

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    this.props.getList();
  }
  componentWillReceiveProps(nextProps) {
    const { getListResult } = nextProps;
    if (getListResult !== this.props.getListResult) {
      this.setState({ projects: getListResult.data });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.add(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { projects } = this.state;
    const { match } = this.props;
    console.log(match);
    return (
      <div>
        {match.isExact &&
          <div>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '' }],
                })(<Input />)}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  添加
                </Button>
              </FormItem>
            </Form>
            {projects.map(item =>
              <Link key={item.id} to={`${match.url}/project/${item.id}`}>{item.name}</Link>)}
          </div>}

        <Route path={`${match.url}/:id`} component={Table} />
      </div>
    );
  }
}

export default Form.create()(Project);

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Table } from 'antd';
import { Route, Link } from 'react-router-dom';
import moment from 'moment';
import TableList from '../../containers/Table';
import './less/project.less';

const FormItem = Form.Item;

class Project extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    getListResult: PropTypes.object,
    getList: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired
  }
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
    console.log(projects);
    const columns = [
      {
        title: '项目',
        dataIndex: 'name',
        render: (text, record) =>
          (<Link key={record.id} to={`${match.url}/${record.id}`}>{text}</Link>)
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        render: (text) =>
          (moment.unix(text).format('YYYY-MM-DD HH:mm:ss'))
      },
      {
        title: '修改时间',
        dataIndex: 'updated_at',
        render: (text) =>
          (moment.unix(text).format('YYYY-MM-DD HH:mm:ss'))
      },
    ];
    return (
      <div className="project">
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
            <Table rowKey="_id" dataSource={projects} columns={columns} />
            a
          </div>
        }
        <Route path={`${match.url}/:id`} component={TableList} />
      </div>
    );
  }
}

export default Form.create()(Project);

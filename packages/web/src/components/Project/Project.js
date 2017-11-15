import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Modal, Card, Avatar, message } from 'antd';
import { Route, Link } from 'react-router-dom';
import moment from 'moment';
import TableList from '../../containers/Table';
import ProjectDetail from '../../containers/ProjectDetail';
import PageHeaderLayout from '../PageHeaderLayout';
import './less/project.less';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
class Project extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    getListResult: PropTypes.object,
    getList: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    addResult: PropTypes.object,
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
    const { getListResult, addResult } = nextProps;
    if (getListResult !== this.props.getListResult) {
      this.setState({ projects: getListResult.data });
    }
    if (addResult !== this.props.addResult) {
      if (addResult.code === 0) {
        message.success('创建项目成功');
        this.setState({ visible: false });
        this.props.form.resetFields();
        this.props.getList();
      }
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
  handkeAddClick = () => {
    this.setState({ visible: true });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { projects } = this.state;
    const { match } = this.props;
    if (match.isExact) {
      const action = (
        <div>
          <Button type="primary" onClick={this.handkeAddClick}>新建项目</Button>
        </div>
      );
      return (
        <PageHeaderLayout
          action={action}
        >
          <Modal
            title="创建项目"
            visible={this.state.visible}
            onOk={this.handleSubmit}
            onCancel={() => this.setState({ visible: false })}
          >
            <Form>
              <FormItem
                label="项目名称"
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '' }],
                })(<Input />)}
              </FormItem>
              <FormItem
                label="项目描述"
              >
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: '' }],
                })(<TextArea />)}
              </FormItem>
            </Form>
          </Modal>
          <Card
            className="projectList"
            style={{ marginBottom: 24 }}
            title="进行中的项目"
            bordered={false}
            extra={<Link to="/">全部项目</Link>}
            // loading={projectLoading}
            bodyStyle={{ padding: 0 }}
          >
            {projects.map(item => (
              <Card.Grid className="projectGrid" key={item._id}>
                <Card bodyStyle={{ padding: 0 }} bordered={false}>
                  <Card.Meta
                    title={(
                      <div className="cardTitle">
                        <Avatar size="small" style={{ backgroundColor: '#76b0f3' }}>{item.name[0]}</Avatar>
                        <Link to={`${match.url}/${item._id}`}>{item.name}</Link>
                      </div>
                    )}
                    description={item.description}
                  />
                  <div className="projectItemContent">
                    <Link to={`${match.url}/${item._id}`}>{item.user.name || ''}</Link>
                    {item.updated_at && (
                      <span className="datetime" title={moment.unix(item.updated_at).format('YYYY-MM-DD HH:mm:ss')}>
                        {moment.unix(item.updated_at).fromNow()}
                      </span>
                    )}
                  </div>
                </Card>
              </Card.Grid>
            ))}
          </Card>
        </PageHeaderLayout>
      );
    }
    return <Route path={`${match.url}/:id`} component={ProjectDetail} />;
  }
}

export default Form.create()(Project);

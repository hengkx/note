import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Modal, Card, Avatar, message, List } from 'antd';
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
      projects: [],
      logs: []
    };
  }

  componentDidMount() {
    this.props.getList();
    this.props.getLogList();
  }
  componentWillReceiveProps(nextProps) {
    const { getListResult, addResult, getLogListResult } = nextProps;
    if (getListResult !== this.props.getListResult) {
      this.setState({ projects: getListResult.data });
    }
    if (getLogListResult !== this.props.getLogListResult) {
      this.setState({ logs: getLogListResult.data });
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
  handleAddClick = () => {
    this.setState({ visible: true });
  }
  renderActivities = () => {
    // const { logs } = this.state;
    // return logs.map((item) => {
    //   // const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
    //   //   if (item[key]) {
    //   //     return <a href={item[key].link} key={item[key].name}>{item[key].name}</a>;
    //   //   }
    //   //   return key;
    //   // });
    //   const events = ['在 '];
    //   events.push(<a href={`/project/${item.project._id}`} key={item.project._id}>{item.project.name}</a>);
    //   events.push(' 项目 ');
    //   if (item.action === 'add_project_member') {
    //     events.push('添加项目成员');
    //   } else if (item.action === 'create_interface') {
    //     events.push(' 添加接口 ');
    //     events.push(<a href={`/project/${item.project._id}/interface/${item.interface._id}`} key={item.interface._id}>{item.interface.name}</a>);
    //   } else if (item.action === 'create_param') {
    //     events.push(<a href={`/project/${item.project._id}/interface/${item.interface._id}`} key={item.interface._id}>{item.interface.name}</a>);
    //     events.push(' 接口 添加参数 ');
    //     events.push(item.data.current);
    //   } else if (item.action === 'remove_param') {
    //     events.push(<a href={`/project/${item.project._id}/interface/${item.interface._id}`} key={item.interface._id}>{item.interface.name}</a>);
    //     events.push(' 接口 移除参数 ');
    //     events.push(item.data.current);
    //   } else if (item.action === 'update_param_remark') {
    //     events.push(<a href={`/project/${item.project._id}/interface/${item.interface._id}`} key={item.interface._id}>{item.interface.name}</a>);
    //     events.push(' 接口 更新参数 ');
    //     events.push(item.param.name);
    //     events.push(item.data.current);
    //   }
    //   return (
    //     <List.Item key={item.id}>
    //       <List.Item.Meta
    //         avatar={<Avatar src={item.user.avatar} />}
    //         title={
    //           <span>
    //             <a className="username">{item.user.name}</a>
    //             &nbsp;
    //             <span className="event">{events}</span>
    //           </span>
    //         }
    //         description={
    //           <span className="datetime" title={item.updatedAt}>
    //             {moment.unix(item.updated_at).fromNow()}
    //           </span>
    //         }
    //       />
    //     </List.Item>
    //   );
    // });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { projects } = this.state;
    const { match } = this.props;
    if (match.isExact) {
      const action = (
        <div>
          <Button type="primary" onClick={this.handleAddClick}>新建项目</Button>
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
          <Card
            bodyStyle={{ padding: 0 }}
            bordered={false}
            className="activeCard"
            title="动态"
          >
            <List size="large">
              <div className="activitiesList">
                {this.renderActivities()}
              </div>
            </List>
          </Card>
        </PageHeaderLayout>
      );
    }
    return <Route path={`${match.url}/:id`} component={ProjectDetail} />;
  }
}

export default Form.create()(Project);

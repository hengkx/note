import React from 'react';
import PropTypes from 'prop-types';
import { Card, Modal, Button, Form, Input } from 'antd';
import { Route } from 'react-router-dom';
import TagSelect from 'ant-design-pro/lib/TagSelect';
import Interface from '../../containers/Interface';
import InterfaceAdd from '../../containers/InterfaceAdd';
import InterfaceEdit from '../../containers/InterfaceEdit';
import PageHeaderLayout from '../PageHeaderLayout';
import ProjectSetting from '../../containers/ProjectSetting';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create()
class Detail extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    getById: PropTypes.func.isRequired,
    getGroup: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    getByIdResult: PropTypes.object,
    getGroupResult: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      project: {},
      groups: [],
      tab: 'interface',
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getById({ id });
    this.props.getGroup({ id });
  }
  componentWillReceiveProps(nextProps) {
    const { getByIdResult, getGroupResult } = nextProps;
    if (getByIdResult !== this.props.getByIdResult) {
      this.setState({ project: getByIdResult.data });
    }
    if (getGroupResult !== this.props.getGroupResult) {
      this.setState({ groups: getGroupResult.data });
    }
  }
  handleTabChange = (key) => {
    this.setState({ tab: key });
  }
  handleAddInterfaceClick = () => {
    const { match } = this.props;
    this.props.history.push(`${match.url}/interface`);
  }
  handleAddClick = () => {
    this.setState({ visible: true });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.props.match.params;
        this.props.addGroup({ ...values, _id: id });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { match } = this.props;
    const tabList = [
      {
        key: 'interface',
        tab: '接口列表',
      },
      {
        key: 'db',
        tab: '数据库',
      },
      {
        key: 'setting',
        tab: '设置',
      },
    ];
    const action = (
      <div>
        <Button.Group>
          <Button onClick={this.handleAddClick}>添加分组</Button>
          <Button onClick={this.handleAddInterfaceClick}>添加接口</Button>
        </Button.Group>
      </div>
    );
    if (match.isExact) {
      const { project, tab, groups } = this.state;
      return (
        <PageHeaderLayout
          title={project.name}
          action={action}
          tabList={tabList}
          onTabChange={this.handleTabChange}
        >
          {tab === 'interface' &&
            <Interface groups={groups} />
          }
          {tab === 'setting' &&
            <ProjectSetting project={project} />
          }
          <Modal
            title="添加分组"
            visible={this.state.visible}
            onOk={this.handleSubmit}
            onCancel={() => this.setState({ visible: false })}
          >
            <Form>
              <FormItem
                label="分组名称"
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '' }],
                })(<Input />)}
              </FormItem>
              <FormItem
                label="URL"
              >
                {getFieldDecorator('url', {
                })(<Input />)}
              </FormItem>
            </Form>
          </Modal>
        </PageHeaderLayout>
      );
    }
    return (
      <div>
        <Route exact path={`${match.path}/interface`} component={InterfaceAdd} />
        <Route exact path={`${match.path}/interface/:interfaceId`} component={InterfaceEdit} />
      </div>
    );
  }
}
export default Detail;

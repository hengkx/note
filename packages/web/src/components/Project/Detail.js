import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { Route, Link } from 'react-router-dom';
import Interface from '../../containers/Interface';
import InterfaceAdd from '../../containers/InterfaceAdd';
import InterfaceEdit from '../../containers/InterfaceEdit';
import PageHeaderLayout from '../PageHeaderLayout';
import Param from '../../containers/Param';

// const TabPane = Tabs.TabPane;

class Detail extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    getById: PropTypes.func.isRequired,
    getByIdResult: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      tab: 'interface'
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getById({ id });
  }
  componentWillReceiveProps(nextProps) {
    const { getByIdResult } = nextProps;
    if (getByIdResult !== this.props.getByIdResult) {
      this.setState({ project: getByIdResult.data });
    }
  }
  handleTabChange = (key) => {
    this.setState({ tab: key });
  }
  render() {
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
        <Link to={`${match.url}/interface`}>添加接口</Link>
      </div>
    );
    if (match.isExact) {
      const { project, tab } = this.state;
      return (
        <PageHeaderLayout
          title={project.name}
          action={action}
          tabList={tabList}
          onTabChange={this.handleTabChange}
        >
          {tab === 'interface' &&
            <Interface />
          }
          {tab === 'setting' &&
            <div>
              <Card title="请求参数" style={{ marginBottom: 24 }} bordered={false}>
                <Param
                  isRequest
                  project={project._id}
                />
              </Card>
              <Card title="响应参数" style={{ marginBottom: 24 }} bordered={false}>
                <Param
                  project={project._id}
                />
              </Card>
            </div>
          }
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

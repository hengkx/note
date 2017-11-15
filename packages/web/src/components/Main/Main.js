import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Dropdown, Avatar, Spin } from 'antd';
import { parse as urlParse } from 'url';
import { Route, Link } from 'react-router-dom';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import NoteMain from '../Note/NoteMain';
import Project from '../../containers/Project';
import './less/main.less';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

class Main extends React.Component {
  static propTypes = {
    location: PropTypes.object,
  }
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      program: 'note'
    };
  }
  getChildContext() {
    const { location } = this.props;
    const breadcrumbNameMap = {
      '/note': '笔记',
      '/project': '项目列表',
      '/project/:id': '项目详情',
      '/project/:id/interface': '添加接口',
      '/project/:id/interface/:interfaceId': '接口详情',
    };
    return { location, breadcrumbNameMap };
  }
  componentWillMount() {
    const { program } = urlParse(window.location.href, true).query;
    if (program) {
      this.setState({ program });
    }
  }

  handleChange = (val) => {
    this.setState({ program: val });
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const menu = (
      <Menu className="menu" selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const currentUser = {};
    const noticeData = {};
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            onClick={this.handleClick}
            defaultOpenKeys={['sub2']}
            selectedKeys={[this.state.current]}
            mode="inline"
          >
            <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>功能</span></span>}>
              <Menu.Item key="1"><Link to="/note">笔记</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/project">项目</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title={<span><Icon type="setting" /><span>设置</span></span>}>
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header className="header">
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className="right">
              <NoticeIcon
                className="action"
                count={currentUser.notifyCount}
                onItemClick={(item, tabProps) => {
                  console.log(item, tabProps); // eslint-disable-line
                }}
                onClear={this.handleNoticeClear}
                onPopupVisibleChange={this.handleNoticeVisibleChange}
                // loading={fetchingNotices}
                popupAlign={{ offset: [20, -16] }}
              >
                <NoticeIcon.Tab
                  list={noticeData['通知']}
                  title="通知"
                  emptyText="你已查看所有通知"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['消息']}
                  title="消息"
                  emptyText="您已读完所有消息"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['待办']}
                  title="待办"
                  emptyText="你已完成所有待办"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                />
              </NoticeIcon>
              {currentUser.name ? (
                <Dropdown overlay={menu}>
                  <span className="action account">
                    <Avatar size="small" className="avatar" src={currentUser.avatar} />
                    {currentUser.name}
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
          </Header>
          <Content style={{ margin: '24px', height: '100%' }}>
            <Route path="/note" component={NoteMain} />
            <Route path="/project" component={Project} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Main;

// <div className="pageHeader">
// <Breadcrumb className="breadcrumb">
//   {breadcrumbItems}
// </Breadcrumb>
// </div>
// <div className="content">

// </div>

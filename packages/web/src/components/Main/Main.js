import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { message, Modal, Input, Tree } from 'antd';
import { NProgress } from 'redux-nprogress';
import { ContextMenuTrigger } from 'react-contextmenu';
import GroupMenu from './GroupMenu';
import { toTree } from '../../utils';
import './less/main.less';

const TreeNode = Tree.TreeNode;

class Main extends React.Component {
  static propTypes = {
    getGroupList: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    delGroup: PropTypes.func.isRequired,
    getGroupListResult: PropTypes.object,
    addGroupResult: PropTypes.object,
    delGroupResult: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      groupTree: [],
      groupName: '新建分组'
    };
  }

  componentDidMount() {
    this.props.getGroupList();
  }
  componentWillReceiveProps(nextProps) {
    const { getGroupListResult, addGroupResult, delGroupResult } = nextProps;
    if (this.props.getGroupListResult !== getGroupListResult) {
      if (getGroupListResult.code === 0) {
        const groupTree = toTree(getGroupListResult.data);
        const groupExpandedKeys = this.state.groupExpandedKeys ? this.state.groupExpandedKeys : [groupTree[0].id];
        const groupSelectedKeys = this.state.groupSelectedKeys ? this.state.groupSelectedKeys : [groupTree[0].id];
        this.setState({ groups: getGroupListResult.data, groupTree, groupSelectedKeys, groupExpandedKeys });
      } else {
        message.error(getGroupListResult.message);
      }
    }
    if (this.props.addGroupResult !== addGroupResult) {
      if (addGroupResult.code === 0) {
        this.props.getGroupList();
        const groupExpandedKeys = [addGroupResult.data.parent];
        const groupSelectedKeys = [addGroupResult.data.id];
        this.setState({ groupName: '新建分组', groupExpandedKeys, groupSelectedKeys });
      } else {
        message.error(addGroupResult.message);
      }
    }
    if (this.props.delGroupResult !== delGroupResult) {
      if (delGroupResult.code === 0) {
        this.props.getGroupList();
        message.success('删除成功！');
      } else {
        message.error(delGroupResult.message);
      }
    }
  }
  handleMenuClick = (e, data) => {
    if (data.action === 'add_group') {
      this.setState({ visible: true, currentGroup: data.group });
    } else if (data.action === 'del_group') {
      this.props.delGroup({ id: data.group.id });
    }
  }
  handleOkClick = () => {
    const { currentGroup, groupName } = this.state;
    this.props.addGroup({ name: groupName, parent: currentGroup.id });
    this.setState({ visible: false });
  }
  handleExpand = (expandedKeys) => {
    this.setState({ groupExpandedKeys: expandedKeys });
  }
  handleSelect = (selectedKeys) => {
    this.setState({ groupSelectedKeys: selectedKeys });
  }
  render() {
    const { visible, groupName, groupTree, groupExpandedKeys, groupSelectedKeys } = this.state;
    const groupItem = (group) => (
      <ContextMenuTrigger
        id="GROUP_MENU"
        onItemClick={this.handleMenuClick}
        group={group}
        collect={(props) => (props)}
      >
        {group.name}
      </ContextMenuTrigger>
    );

    const renderGroupTreeNode = data => data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.id}
            title={groupItem(item)}
          >{renderGroupTreeNode(item.children)}</TreeNode>);
      }
      return (<TreeNode key={item.id} title={groupItem(item)} />);
    });
    return (
      <div className="main">
        <Tree
          className="group-tree"
          onSelect={this.handleSelect}
          selectedKeys={groupSelectedKeys}
          onExpand={this.handleExpand}
          expandedKeys={groupExpandedKeys}
        >
          {renderGroupTreeNode(groupTree)}
        </Tree>
        <GroupMenu />
        <Modal
          title="新建分组"
          visible={visible}
          onOk={this.handleOkClick}
          onCancel={() => { this.setState({ visible: false }); }}
        >
          <Input value={groupName} onChange={(e) => { this.setState({ groupName: e.target.value }); }} />
        </Modal>
      </div>
    );
  }
}

export default Main;

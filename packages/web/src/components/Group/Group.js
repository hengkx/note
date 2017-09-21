import React from 'react';
import PropTypes from 'prop-types';
import { message, Modal, Input, Tree } from 'antd';
import { ContextMenuTrigger } from 'react-contextmenu';
import GroupMenu from './GroupMenu';
import { toTree } from '../../utils';
import './less/group.less';

const TreeNode = Tree.TreeNode;

class Group extends React.Component {
  static propTypes = {
    getList: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    getNoteList: PropTypes.func.isRequired,
    getListResult: PropTypes.object,
    addResult: PropTypes.object,
    delResult: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      notes: [],
      groupTree: [],
      groupName: '新建分组'
    };
  }
  componentDidMount() {
    this.props.getList();
  }
  componentWillReceiveProps(nextProps) {
    const { getListResult, addResult, delResult } = nextProps;
    if (this.props.getListResult !== getListResult) {
      if (getListResult.code === 0) {
        const groupTree = toTree(getListResult.data);
        const expandedKeys = this.state.expandedKeys ? this.state.expandedKeys : [groupTree[0].id];
        const selectedKeys = this.state.selectedKeys ? this.state.selectedKeys : [groupTree[0].id];
        this.setState({ groups: getListResult.data, groupTree, selectedKeys, expandedKeys });
        this.props.getNoteList({ group: selectedKeys[0] });
      } else {
        message.error(getListResult.message);
      }
    }
    if (this.props.addResult !== addResult) {
      if (addResult.code === 0) {
        this.props.getList();
        const expandedKeys = [addResult.data.parent];
        const selectedKeys = [addResult.data.id];
        this.setState({ groupName: '新建分组', expandedKeys, selectedKeys });
      } else {
        message.error(addResult.message);
      }
    }
    if (this.props.delResult !== delResult) {
      if (delResult.code === 0) {
        this.props.getList();
        message.success('删除成功！');
      } else {
        message.error(delResult.message);
      }
    }
  }
  handleMenuClick = (e, data) => {
    if (data.action === 'add_group') {
      this.setState({ visible: true, currentGroup: data.group });
    } else if (data.action === 'del_group') {
      this.props.del({ id: data.group.id });
    } else if (data.action === 'add_note') {
      this.props.addNote({ group: data.group.id, title: '无标题笔记', content: '' });
    }
  }
  handleOkClick = () => {
    const { currentGroup, groupName } = this.state;
    this.props.add({ name: groupName, parent: currentGroup.id });
    this.setState({ visible: false });
  }
  handleExpand = (expandedKeys) => {
    this.setState({ expandedKeys });
  }
  handleSelect = (selectedKeys) => {
    this.props.getNoteList({ group: selectedKeys[0] });
    this.setState({ selectedKeys });
  }
  handleSelectedNoteClick = (note) => {
    this.setState({ selectedNote: note, isEdit: false });
  }

  render() {
    const { visible, groupName, groupTree, expandedKeys, selectedKeys } = this.state;
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
      <div className="group">
        <Tree
          className="group-tree"
          onSelect={this.handleSelect}
          selectedKeys={selectedKeys}
          onExpand={this.handleExpand}
          expandedKeys={expandedKeys}
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

export default Group;

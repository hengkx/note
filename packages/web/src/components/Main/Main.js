import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { message, Modal, Input, Tree, Icon } from 'antd';
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
    addNote: PropTypes.func.isRequired,
    getNoteList: PropTypes.func.isRequired,
    getGroupListResult: PropTypes.object,
    addGroupResult: PropTypes.object,
    delGroupResult: PropTypes.object,
    getNoteListResult: PropTypes.object,
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
    this.props.getGroupList();
  }
  componentWillReceiveProps(nextProps) {
    const {
      getGroupListResult, addGroupResult, delGroupResult,
      getNoteListResult, delNoteResult, addNoteResult
    } = nextProps;
    if (this.props.getGroupListResult !== getGroupListResult) {
      if (getGroupListResult.code === 0) {
        const groupTree = toTree(getGroupListResult.data);
        const groupExpandedKeys = this.state.groupExpandedKeys ? this.state.groupExpandedKeys : [groupTree[0].id];
        const groupSelectedKeys = this.state.groupSelectedKeys ? this.state.groupSelectedKeys : [groupTree[0].id];
        this.setState({ groups: getGroupListResult.data, groupTree, groupSelectedKeys, groupExpandedKeys });
        this.props.getNoteList({ group: groupSelectedKeys[0] });
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
    if (this.props.getNoteListResult !== getNoteListResult) {
      if (getNoteListResult.code === 0) {
        this.setState({ notes: getNoteListResult.data });
      } else {
        message.error(getNoteListResult.message);
      }
    }
    if (this.props.delNoteResult !== delNoteResult) {
      if (delNoteResult.code === 0) {
        const { groupSelectedKeys } = this.state;
        this.props.getNoteList({ group: groupSelectedKeys[0] });
      } else {
        message.error(delNoteResult.message);
      }
    }
    if (this.props.addNoteResult !== addNoteResult) {
      if (addNoteResult.code === 0) {
        const { groupSelectedKeys } = this.state;
        this.props.getNoteList({ group: groupSelectedKeys[0] });
      } else {
        message.error(addNoteResult.message);
      }
    }

  }
  handleMenuClick = (e, data) => {
    if (data.action === 'add_group') {
      this.setState({ visible: true, currentGroup: data.group });
    } else if (data.action === 'del_group') {
      this.props.delGroup({ id: data.group.id });
    } else if (data.action === 'add_note') {
      this.props.addNote({ group: data.group.id, title: '无标题笔记', content: '' });
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
    this.props.getNoteList({ group: selectedKeys[0] });
    this.setState({ groupSelectedKeys: selectedKeys });
  }
  handleSelectedNoteClick = (note) => {
    console.log(note);
  }
  handleDelNoteClick = (note) => {
    this.props.delNote({ id: note.id });
  }
  render() {
    const { visible, notes, groupName, groupTree, groupExpandedKeys, groupSelectedKeys } = this.state;
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
        <div className="header">
          <div className="logo">云笔记</div>
        </div>
        <div className="container">
          <div className="sidebar">
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
          </div>
          <div className="content">
            <div className="list">
              <ul>
                {notes.map(item => (
                  <li
                    key={item.id}
                    onClick={() => { this.handleSelectedNoteClick(item); }}
                  >
                    <div className="note-item">
                      <div className="detail">
                        {item.title}
                      </div>
                      <div className="action">
                        <Icon type="delete" onClick={() => { this.handleDelNoteClick(item); }} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="detail"></div>
          </div>
        </div>
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

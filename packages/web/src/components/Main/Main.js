import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button, message, Input, Icon, Tag } from 'antd';
import moment from 'moment';
import Markdown from '../Markdown';
import Group from '../../containers/Group';
import './less/main.less';

const { Option } = Select;
const { TextArea } = Input;

class Main extends React.Component {
  static propTypes = {
    getTagList: PropTypes.func.isRequired,
    delNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    getNoteList: PropTypes.func.isRequired,
    getNoteListResult: PropTypes.object,
    delNoteResult: PropTypes.object,
    addNoteResult: PropTypes.object,
    getTagListResult: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      notes: [],
      tags: [],
      groupTree: [],
      groupName: '新建分组'
    };
  }
  componentDidMount() {
    this.props.getTagList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getNoteListResult, delNoteResult, addNoteResult, getTagListResult
    } = nextProps;

    if (this.props.getNoteListResult !== getNoteListResult) {
      if (getNoteListResult.code === 0) {
        const notes = getNoteListResult.data;
        notes.forEach(note => {
          note.sourceTags = note.tags;// eslint-disable-line no-param-reassign
          note.tags = note.tags.map(tag => (tag.name));// eslint-disable-line no-param-reassign
        });
        this.setState({ notes });
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
        message.success('新建笔记成功！');
        const { data } = addNoteResult;
        this.props.getNoteList({ group: data.group });
      } else {
        message.error(addNoteResult.message);
      }
    }
    if (this.props.getTagListResult !== getTagListResult) {
      if (getTagListResult.code === 0) {
        const { data } = getTagListResult;
        this.setState({ tags: data });
      } else {
        message.error(getTagListResult.message);
      }
    }
  }

  handleSelectedNoteClick = (note) => {
    this.setState({ selectedNote: note, isEdit: false });
  }
  handleDelNoteClick = (note) => {
    this.props.delNote({ id: note.id });
  }
  handleSaveNoteClick = () => {
    const { selectedNote } = this.state;
    this.props.updateNote(selectedNote);
  }
  handleTitleChange = (e) => {
    const { selectedNote } = this.state;
    selectedNote.title = e.target.value;
    this.setState({ selectedNote });
  }
  handleContentChange = (e) => {
    const { selectedNote } = this.state;
    selectedNote.content = e.target.value;
    this.setState({ selectedNote });
  }
  handleTagChange = (val) => {
    const { selectedNote } = this.state;
    selectedNote.tags = val;
    this.setState({ selectedNote });
  }
  render() {
    const { notes, isEdit, tags, selectedNote } = this.state;

    return (
      <div className="main">
        <div className="header">
          <div className="logo">云笔记</div>
        </div>
        <div className="container">
          <div className="sidebar">
            <Group />
          </div>
          <div className="content">
            <div className="list">
              <ul>
                {notes.map(item => (
                  <li
                    key={item.id}
                    className={selectedNote === item ? 'active' : ''}
                    onClick={() => { this.handleSelectedNoteClick(item); }}
                  >
                    <div className="note-item">
                      <div className="detail">
                        {item.title}{moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                      <div className="action">
                        <Icon type="delete" onClick={() => { this.handleDelNoteClick(item); }} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {selectedNote && isEdit &&
              <div className="detail">
                <div className="detail-header">
                  <div className="title">
                    <Input value={selectedNote.title} onChange={this.handleTitleChange} />
                  </div>
                  <div className="action">
                    <Button onClick={this.handleSaveNoteClick}>保存</Button>
                  </div>
                </div>
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="标签"
                  value={selectedNote.tags}
                  onChange={this.handleTagChange}
                >
                  {tags.map(tag => <Option key={tag.id} value={tag.name}>{tag.name}</Option>)}
                </Select>
                <div className="content">
                  {isEdit ?
                    <TextArea value={selectedNote.content} onChange={this.handleContentChange} /> :
                    <Markdown content={selectedNote.content} />
                  }
                </div>
              </div>
            }
            {selectedNote && !isEdit &&
              <div className="detail">
                <div className="detail-header">
                  <div className="title">
                    {selectedNote.title}
                  </div>
                  <div className="tag">
                    {selectedNote.sourceTags.map(tag => (<Tag key={tag.id}>{tag.name}</Tag>))}
                  </div>
                  <div className="action">
                    <Button onClick={() => { this.setState({ isEdit: true }); }}>编辑</Button>
                  </div>
                </div>
                <Markdown content={selectedNote.content} />
              </div>
            }
          </div>
        </div>

      </div>
    );
  }
}

export default Main;

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Button, message, Icon, Tag } from 'antd';
import moment from 'moment';
import { ContextMenuTrigger } from 'react-contextmenu';
import randomize from 'randomatic';
import CopyToClipboard from 'react-copy-to-clipboard';
import NoteMenu from './NoteMenu';
import Markdown from '../Markdown';
import NoteEdit from '../../containers/NoteEdit';
import NoteLog from '../../containers/NoteLog';
import './less/note.less';

class Note extends React.Component {
  static propTypes = {
    getTagList: PropTypes.func.isRequired,
    delNote: PropTypes.func.isRequired,
    getNoteList: PropTypes.func.isRequired,
    shareNote: PropTypes.func.isRequired,
    getNoteListResult: PropTypes.object,
    delNoteResult: PropTypes.object,
    addNoteResult: PropTypes.object,
    shareNoteResult: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      status: 0
    };
  }
  componentDidMount() {
    this.props.getTagList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getNoteListResult, delNoteResult, addNoteResult, shareNoteResult
    } = nextProps;

    if (this.props.getNoteListResult !== getNoteListResult) {
      if (getNoteListResult.code === 0) {
        const notes = getNoteListResult.data;
        notes.forEach(note => {
          note.sourceTags = note.tags;// eslint-disable-line no-param-reassign
          note.tags = note.tags.map(tag => (tag.name));// eslint-disable-line no-param-reassign
        });
        let group;
        if (notes.length > 0) {
          group = notes[0].group;
        }
        this.setState({ notes, group });
      } else {
        message.error(getNoteListResult.message);
      }
    }
    if (this.props.shareNoteResult !== shareNoteResult) {
      if (shareNoteResult.code === 0) {
        const note = shareNoteResult.data;
        const url = `${window.location.href}share?id=${note.id}&type=note`;
        if (note.is_shared) {
          Modal.success({
            title: '分享成功',
            okText: '关闭',
            content: (
              <div>
                <Input value={url} readOnly />
                <CopyToClipboard
                  text={url}
                  onCopy={() => message.success('复制成功')}
                >
                  <Button>复制链接</Button>
                </CopyToClipboard>
                {note.share_password &&
                  <div>
                    提取密码：{note.share_password}
                  </div>
                }
              </div>
            ),
          });
        } else {
          message.success('取消分享成功');
        }
      } else {
        message.error(shareNoteResult.message);
      }
    }
    if (this.props.delNoteResult !== delNoteResult) {
      if (delNoteResult.code === 0) {
        const { group } = this.state;
        message.success('删除笔记成功！');
        this.props.getNoteList({ group });
      } else {
        message.error(delNoteResult.message);
      }
    }
    if (this.props.addNoteResult !== addNoteResult) {
      if (addNoteResult.code === 0) {
        message.success('新建笔记成功！');
        const { data } = addNoteResult;
        this.props.getNoteList({ group: data.group });
        this.setState({ group: data.group, selectedNoteId: data.id, selectedNote: data, isEdit: true });
      } else {
        message.error(addNoteResult.message);
      }
    }
  }

  handleSelectedNoteClick = (note) => {
    this.setState({ selectedNote: note, selectedNoteId: note.id, status: 0 });
  }
  handleDelNoteClick = (note) => {
    this.props.delNote({ id: note.id });
  }

  handleMenuClick = (e, data) => {
    if (data.action === 'public_share') {
      this.props.shareNote({ id: data.note.id, is_shared: true });
    } else if (data.action === 'private_share') {
      this.props.shareNote({ id: data.note.id, is_shared: true, share_password: randomize('a0', 4) });
    } else if (data.action === 'cancel_share') {
      this.props.shareNote({ id: data.note.id, is_shared: false, share_password: '' });
    }
  }
  render() {
    const { notes, status, selectedNote, selectedNoteId } = this.state;

    return (
      <div className="note">
        <div className="content">
          <div className="list">
            <ul>
              {notes.map(item => (
                <li
                  key={item.id}
                  className={selectedNoteId === item.id ? 'active' : ''}
                  onClick={() => { this.handleSelectedNoteClick(item); }}
                >

                  <div className="note-item">
                    <ContextMenuTrigger
                      id="NOTE_MENU"
                      onItemClick={this.handleMenuClick}
                      note={item}
                      collect={(props) => (props)}
                    >
                      <div className="detail">
                        <div className="title">
                          {item.title}
                        </div>
                        <div className="time">
                          {moment.unix(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                      </div>
                    </ContextMenuTrigger>
                    <div className="action">
                      <Icon type="delete" onClick={() => { this.handleDelNoteClick(item); }} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <NoteMenu />
          </div>
          {status === 1 &&
            <NoteEdit note={selectedNote} />
          }
          {status === 2 &&
            <NoteLog id={selectedNote.id} />
          }
          {selectedNote && !status &&
            <div className="note-detail">
              <div className="note-detail-header">
                <div className="title">
                  {selectedNote.title}
                </div>
                <div className="tag">
                  {selectedNote.sourceTags && selectedNote.sourceTags.map(tag => (<Tag key={tag.id}>{tag.name}</Tag>))}
                </div>
                <div className="action">
                  <Button onClick={() => { this.setState({ status: 2 }); }}>历史版本</Button>
                  <Button onClick={() => { this.setState({ status: 1 }); }}>编辑</Button>
                </div>
              </div>
              <Markdown content={selectedNote.content} />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Note;

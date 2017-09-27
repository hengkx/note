import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button, Input, message } from 'antd';
import brace from 'brace';// eslint-disable-line no-unused-vars
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/tomorrow_night_eighties';
import './less/noteEdit.less';

const { Option } = Select;

class NoteEdit extends React.Component {
  static propTypes = {
    updateNote: PropTypes.func.isRequired,
    base64Img: PropTypes.func.isRequired,
    note: PropTypes.object,
    getTagListResult: PropTypes.object,
    base64ImgResult: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      note: props.note,
      tags: [],
      cursorStart: 1
    };
  }
  componentDidMount() {
    document.querySelector('.ace_editor').addEventListener('paste', this.handleContentPasteClick, true);
  }

  componentWillReceiveProps(nextProps) {
    const { getTagListResult, base64ImgResult, note, updateNoteResult } = nextProps;

    if (this.props.note !== note) {
      this.setState({ note });
    }

    if (this.props.getTagListResult !== getTagListResult) {
      if (getTagListResult.code === 0) {
        const { data } = getTagListResult;
        this.setState({ tags: data });
      }
    }
    if (this.props.updateNoteResult !== updateNoteResult) {
      if (updateNoteResult.code === 0) {
        message.success('保存成功！');
      }
    }
    if (this.props.base64ImgResult !== base64ImgResult) {
      if (base64ImgResult.code === 0) {
        const { data } = base64ImgResult;
        const { content } = note;
        note.content = content.replace('![Uploading image.png…]()', `![image](${data})`);
        this.setState({ note });
      }
    }
  }
  updateNote = () => {
    const { note } = this.state;
    this.props.updateNote(note);
  }
  handleSaveNoteClick = () => {
  }
  handleTitleChange = (e) => {
    const { note } = this.state;
    note.title = e.target.value;
    this.setState({ note });
  }
  handleContentChange = (val) => {
    const { note } = this.state;
    note.content = val;
    this.setState({ note });
  }
  handleTagChange = (val) => {
    const { note } = this.state;
    note.tags = val;
    this.setState({ note });
  }
  handleContentPasteClick = (e) => {
    const { selection } = this.content.editor;
    const { row, column, document } = selection.anchor;
    const lines = document.$lines;
    let index = column;
    for (let i = 0; i < row; i += 1) {
      index += lines[i].length + 1;
    }
    const { items } = e.clipboardData;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        const { note } = this.state;
        const { content } = note;
        const uploadContent = '\n![Uploading image.png…]()\n';
        note.content = `${content.substring(0, index)}${uploadContent}${content.substring(index)}`;
        this.setState({ note }, () => {
          selection.moveCursorTo(row + 2, 0);
        });
        const reader = new FileReader();
        reader.onload = (event) => {
          this.props.base64Img({ img: event.target.result });
        };
        reader.readAsDataURL(blob);
      }
    }
  }
  handleContentBlur = () => {
    this.updateNote();
  }
  handleTitleBlur = () => {
    this.updateNote();
  }
  render() {
    const { tags, note } = this.state;

    return (
      <div className="note-edit">
        <div className="detail-header">
          <div className="title">
            <Input onBlur={this.handleTitleBlur} value={note.title} onChange={this.handleTitleChange} />
          </div>
          <div className="action">
            <Button onClick={this.handleSaveNoteClick}>保存</Button>
          </div>
        </div>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="标签"
          value={note.tags}
          onChange={this.handleTagChange}
        >
          {tags.map(tag => <Option key={tag.id} value={tag.name}>{tag.name}</Option>)}
        </Select>
        <div
          className="content-edit"
        >
          <AceEditor
            ref={(content) => { this.content = content; }}
            onChange={this.handleContentChange}
            onBlur={this.handleContentBlur}
            mode="markdown"
            theme="tomorrow_night_eighties"
            name="UNIQUE_ID_OF_DIV"
            fontSize={14}
            width="100%"
            height="100%"
            wrapEnabled
            showPrintMargin={false}
            value={note.content}
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      </div>
    );
  }
}

export default NoteEdit;

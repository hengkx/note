import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button, Input } from 'antd';
import './less/noteEdit.less';

const { Option } = Select;
const { TextArea } = Input;

class NoteEdit extends React.Component {
  static propTypes = {
    updateNote: PropTypes.func,
    note: PropTypes.object,
    getTagListResult: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      note: props.note,
      tags: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { getTagListResult, base64ImgResult, note } = nextProps;

    if (this.props.note !== note) {
      this.setState({ note });
    }

    if (this.props.getTagListResult !== getTagListResult) {
      if (getTagListResult.code === 0) {
        const { data } = getTagListResult;
        this.setState({ tags: data });
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

  handleSaveNoteClick = () => {
    const { note } = this.state;
    this.props.updateNote(note);
  }
  handleTitleChange = (e) => {
    const { note } = this.state;
    note.title = e.target.value;
    this.setState({ note });
  }
  handleContentChange = (e) => {
    const { note } = this.state;
    note.content = e.target.value;
    this.setState({ note });
  }
  handleTagChange = (val) => {
    const { note } = this.state;
    note.tags = val;
    this.setState({ note });
  }
  handleContentPasteClick = (e) => {
    const end = e.target.selectionEnd;
    const { items } = e.clipboardData;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        const { note } = this.state;
        const { content } = note;
        const uploadContent = '\n![Uploading image.png…]()\n';
        note.content = `${content.substring(0, end)}${uploadContent}${content.substring(end)}`;
        this.setState({ note }, () => {
          this.content.textAreaRef.selectionStart = this.content.textAreaRef.selectionEnd = end + uploadContent.length;
        });
        const reader = new FileReader();
        reader.onload = (event) => {
          this.props.base64Img({ img: event.target.result });
        };
        reader.readAsDataURL(blob);
      }
    }
  }
  render() {
    const { tags, note } = this.state;
    return (
      <div className="note-edit">
        <div className="detail-header">
          <div className="title">
            <Input value={note.title} onChange={this.handleTitleChange} />
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
        <div className="content">
          <TextArea
            ref={(content) => { this.content = content; }}
            value={note.content}
            onPaste={this.handleContentPasteClick}
            onChange={this.handleContentChange}
          />
        </div>
      </div>
    );
  }
}

export default NoteEdit;

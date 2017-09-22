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
    const { getTagListResult, note } = nextProps;

    if (this.props.note !== note) {
      this.setState({ note });
    }

    if (this.props.getTagListResult !== getTagListResult) {
      if (getTagListResult.code === 0) {
        const { data } = getTagListResult;
        this.setState({ tags: data });
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
          <TextArea value={note.content} onChange={this.handleContentChange} />
        </div>
      </div>
    );
  }
}

export default NoteEdit;

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import moment from 'moment';
import { Modal, Input, Button, message, Icon, Tag } from 'antd';
import Markdown from '../Markdown';

class Share extends React.Component {
  constructor(props) {
    super(props);
    const { id, type } = url.parse(window.location.href, true).query;
    this.state = {
      id,
      type
    };
  }
  componentDidMount() {
    const { id, type } = this.state;
    this.props.getShareContent({ id, type });
  }

  componentWillReceiveProps(nextProps) {
    const { getShareContentResult } = nextProps;
    if (getShareContentResult !== this.props.getShareContentResult) {
      if (getShareContentResult.code === 0) {
        const note = getShareContentResult.data;
        this.setState({ note });
      }
    }
  }

  render() {
    const { note } = this.state;
    if (!note) return <div />;
    return (
      <div className="share">
        <div className="note-detail-header">
          <div className="title">
            {note.title}
          </div>
          <div className="tag">
            {note.tags.map(tag => (<Tag key={tag.id}>{tag.name}</Tag>))}
          </div>
        </div>
        <Markdown content={note.content} />
      </div>
    );
  }
}

export default Share;

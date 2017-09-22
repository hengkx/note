import React from 'react';
import Group from '../../containers/Group';
import Note from '../../containers/Note';
import './less/main.less';

class Main extends React.Component {
  render() {
    return (
      <div className="main">
        <div className="header">
          <div className="logo">云笔记</div>
        </div>
        <div className="container">
          <Group />
          <Note />
        </div>
      </div>
    );
  }
}

export default Main;

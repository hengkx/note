import React from 'react';
import Group from '../../containers/Group';
import Note from '../../containers/Note';
import PageHeaderLayout from '../PageHeaderLayout';
import './less/noteMain.less';

const NoteMain = () => (
  <PageHeaderLayout>
    <div className="note-main">
      <Group />
      <Note />
    </div>
  </PageHeaderLayout>
);

export default NoteMain;

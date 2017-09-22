import { connect } from 'react-redux';
import Note from '../components/Note';
import { getList as getNoteList, add as addNote, del as delNote, share as shareNote } from '../redux/note';
import { getList as getTagList } from '../redux/tag';

const mapStateToProps = (state) => ({
  getNoteListResult: state.note.getListResult,
  addNoteResult: state.note.addResult,
  delNoteResult: state.note.delResult,
  shareNoteResult: state.note.shareResult,
  getTagListResult: state.tag.getListResult,
});

export default connect(
  mapStateToProps,
  { getNoteList, addNote, delNote, shareNote, getTagList }
)(Note);

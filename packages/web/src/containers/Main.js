import { connect } from 'react-redux';
import Main from '../components/Main';
import { getList as getNoteList, add as addNote, del as delNote, update as updateNote } from '../redux/note';
import { getList as getTagList } from '../redux/tag';

const mapStateToProps = (state) => ({
  getNoteListResult: state.note.getListResult,
  addNoteResult: state.note.addResult,
  delNoteResult: state.note.delResult,
  updateNoteResult: state.note.updateResult,
  getTagListResult: state.tag.getListResult,
});

export default connect(
  mapStateToProps,
  { getNoteList, addNote, delNote, updateNote, getTagList }
)(Main);

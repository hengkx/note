import { connect } from 'react-redux';
import Main from '../components/Main';
import { getList as getGroupList, add as addGroup, del as delGroup } from '../redux/group';
import { getList as getNoteList, add as addNote, del as delNote } from '../redux/note';

const mapStateToProps = (state) => ({
  getGroupListResult: state.group.getListResult,
  addGroupResult: state.group.addResult,
  delGroupResult: state.group.delResult,
  getNoteListResult: state.note.getListResult,
  addNoteResult: state.note.addResult,
  delNoteResult: state.note.delResult,
});

export default connect(
  mapStateToProps,
  { getGroupList, addGroup, delGroup, getNoteList, addNote, delNote }
)(Main);

import { connect } from 'react-redux';
import { NoteEdit } from '../components/Note';
import { update as updateNote } from '../redux/note';
import { getList as getTagList } from '../redux/tag';

const mapStateToProps = (state) => ({
  updateNoteResult: state.note.updateResult,
  getTagListResult: state.tag.getListResult,
});

export default connect(
  mapStateToProps,
  { updateNote, getTagList }
)(NoteEdit);

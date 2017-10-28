import { connect } from 'react-redux';
import { NoteLog } from '../components/Note';
import { getLogList } from '../redux/note';
import { getList as getTagList } from '../redux/tag';

const mapStateToProps = (state) => ({
  getLogListResult: state.note.getLogListResult,
  getTagListResult: state.tag.getListResult,
});

export default connect(
  mapStateToProps,
  { getLogList, getTagList }
)(NoteLog);

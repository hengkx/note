import { connect } from 'react-redux';
import { NoteEdit } from '../components/Note';
import { update as updateNote } from '../redux/note';
import { getList as getTagList } from '../redux/tag';
import { base64Img } from '../redux/upload';

const mapStateToProps = (state) => ({
  updateNoteResult: state.note.updateResult,
  getTagListResult: state.tag.getListResult,
  base64ImgResult: state.upload.base64ImgResult,
});

export default connect(
  mapStateToProps,
  { updateNote, getTagList, base64Img }
)(NoteEdit);

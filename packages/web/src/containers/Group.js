import { connect } from 'react-redux';
import Group from '../components/Group';
import { getList, add, del } from '../redux/group';
import { getList as getNoteList, add as addNote } from '../redux/note';

const mapStateToProps = (state) => ({
  getListResult: state.group.getListResult,
  addResult: state.group.addResult,
  delResult: state.group.delResult,
});

export default connect(
  mapStateToProps,
  { getList, add, del, getNoteList, addNote }
)(Group);

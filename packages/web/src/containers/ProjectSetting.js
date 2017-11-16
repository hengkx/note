import { connect } from 'react-redux';
import { Setting } from '../components/Project';
import { add, addMember } from '../redux/project';

const mapStateToProps = (state) => ({
  addResult: state.project.addResult,
  addMemberResult: state.project.addMemberResult,
});

export default connect(
  mapStateToProps,
  { add, addMember }
)(Setting);

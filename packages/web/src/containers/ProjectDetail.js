import { connect } from 'react-redux';
import { Detail } from '../components/Project';
import { getById, addGroup, getGroup } from '../redux/project';

const mapStateToProps = (state) => ({
  getByIdResult: state.project.getByIdResult,
  getGroupResult: state.project.getGroupResult,
  addGroupResult: state.project.addGroupResult,
});

export default connect(
  mapStateToProps,
  { getById, addGroup, getGroup }
)(Detail);

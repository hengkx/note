import { connect } from 'react-redux';
import Project from '../components/Project';
import { add, getList } from '../redux/project';

const mapStateToProps = (state) => ({
  addResult: state.project.addResult,
  getListResult: state.project.getListResult,
});

export default connect(
  mapStateToProps,
  { add, getList }
)(Project);

import { connect } from 'react-redux';
import Project from '../components/Project';
import { add, getList, getLogList } from '../redux/project';

const mapStateToProps = (state) => ({
  addResult: state.project.addResult,
  getListResult: state.project.getListResult,
  getLogListResult: state.project.getLogListResult,
});

export default connect(
  mapStateToProps,
  { add, getList, getLogList }
)(Project);

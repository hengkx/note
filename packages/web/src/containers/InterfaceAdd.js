import { connect } from 'react-redux';
import { Add } from '../components/Interface';
import { add, getList } from '../redux/interface';

const mapStateToProps = (state) => ({
  addResult: state.interfaces.addResult,
  getListResult: state.interfaces.getListResult,
  project: state.project.getByIdResult ? state.project.getByIdResult.data : {},
  groups: state.project.getGroupResult ? state.project.getGroupResult.data : [],
});

export default connect(
  mapStateToProps,
  { add, getList }
)(Add);

import { connect } from 'react-redux';
import Interface from '../components/Interface';
import { add, getList } from '../redux/project';

const mapStateToProps = (state) => ({
  addResult: state.project.addResult,
  getListResult: state.project.getListResult,
});

export default connect(
  mapStateToProps,
  { add, getList }
)(Interface);

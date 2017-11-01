import { connect } from 'react-redux';
import Table from '../components/Table';
import { add, getList } from '../redux/project';

const mapStateToProps = (state) => ({
  addResult: state.project.addResult,
  getListResult: state.project.getListResult,
});

export default connect(
  mapStateToProps,
  { add, getList }
)(Table);

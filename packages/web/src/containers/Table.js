import { connect } from 'react-redux';
import Table from '../components/Table';
import { add, getList } from '../redux/table';

const mapStateToProps = (state) => ({
  addResult: state.table.addResult,
  getListResult: state.table.getListResult,
});

export default connect(
  mapStateToProps,
  { add, getList }
)(Table);

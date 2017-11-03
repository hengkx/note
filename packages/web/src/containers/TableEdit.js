import { connect } from 'react-redux';
import { TableEdit } from '../components/Table';
import { add, update, getById } from '../redux/table';

const mapStateToProps = (state) => ({
  addResult: state.table.addResult,
  updateResult: state.table.updateResult,
  getByIdResult: state.table.getByIdResult,
});

export default connect(
  mapStateToProps,
  { add, update, getById }
)(TableEdit);

import { connect } from 'react-redux';
import Param from '../components/Param';
import { add, del, getList, edit } from '../redux/param';

const mapStateToProps = (state) => ({
  editResult: state.param.editResult,
  addResult: state.param.addResult,
  getListResult: state.param.getListResult,
  delResult: state.param.delResult,
});

export default connect(
  mapStateToProps,
  { edit, add, del, getList }
)(Param);

import { connect } from 'react-redux';
import { Add } from '../components/Interface';
import { add, getList } from '../redux/interface';

const mapStateToProps = (state) => ({
  addResult: state.interfaces.addResult,
  getListResult: state.interfaces.getListResult,
});

export default connect(
  mapStateToProps,
  { add, getList }
)(Add);

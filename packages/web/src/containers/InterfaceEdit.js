import { connect } from 'react-redux';
import { Edit } from '../components/Interface';
import { getById, edit } from '../redux/interface';

const mapStateToProps = (state) => ({
  getByIdResult: state.interfaces.getByIdResult,
  editResult: state.interfaces.editResult,
  getParamListResult: state.param.getListResult,
});

export default connect(
  mapStateToProps,
  { getById, edit }
)(Edit);

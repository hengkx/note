import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Interface from '../components/Interface';
import { add, getList } from '../redux/interface';

const mapStateToProps = (state) => ({
  addResult: state.project.addResult,
  getListResult: state.interfaces.getListResult,
});

export default withRouter(connect(
  mapStateToProps,
  { add, getList }
)(Interface));

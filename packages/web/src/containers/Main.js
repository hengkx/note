import { connect } from 'react-redux';
import Main from '../components/Main';
import { getInfo } from '../redux/account';

const mapStateToProps = (state) => ({
  getInfoResult: state.account.getInfoResult,
  isfetching: state.account.isfetching,
});

export default connect(
  mapStateToProps,
  { getInfo }
)(Main);

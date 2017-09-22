import { connect } from 'react-redux';
import { Forgot } from '../components/Account';
import { forgot } from '../redux/account';

const mapStateToProps = (state) => ({
  forgotResult: state.account.forgotResult,
});

export default connect(
  mapStateToProps,
  { forgot }
)(Forgot);

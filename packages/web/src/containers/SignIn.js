import { connect } from 'react-redux';
import { SignIn } from '../components/Account';
import { signIn, sendActiveEmail } from '../redux/account';

const mapStateToProps = (state) => ({
  signInResult: state.account.signInResult,
  sendActiveEmailResult: state.account.sendActiveEmailResult,
  isfetching: state.account.isfetching,
});

export default connect(
  mapStateToProps,
  { signIn, sendActiveEmail }
)(SignIn);

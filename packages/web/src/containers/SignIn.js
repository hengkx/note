import { connect } from 'react-redux';
import { SignIn } from '../components/Account';
import { signIn, checkUsernameExist } from '../redux/account';

const mapStateToProps = (state) => ({
  signInResult: state.account.signInResult,
  checkUsernameExistResult: state.account.checkUsernameExistResult,
  isfetching: state.account.isfetching,
});

export default connect(
  mapStateToProps,
  { signIn, checkUsernameExist }
)(SignIn);

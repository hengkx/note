import { connect } from 'react-redux';
import { SignUp } from '../components/Account';
import { signUp, checkUsernameExist } from '../redux/account';

const mapStateToProps = (state) => ({
  signUpResult: state.account.signUpResult,
  checkUsernameExistResult: state.account.checkUsernameExistResult,
  isfetching: state.account.isfetching,
});

export default connect(
  mapStateToProps,
  { signUp, checkUsernameExist }
)(SignUp);

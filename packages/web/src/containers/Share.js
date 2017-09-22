import { connect } from 'react-redux';
import Share from '../components/Share';
import { getShareContent } from '../redux/note';

const mapStateToProps = (state) => ({
  getShareContentResult: state.note.getShareContentResult,
});

export default connect(
  mapStateToProps,
  { getShareContent }
)(Share);

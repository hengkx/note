import { connect } from 'react-redux';
import { Detail } from '../components/Project';
import { getById } from '../redux/project';

const mapStateToProps = (state) => ({
  getByIdResult: state.project.getByIdResult,
});

export default connect(
  mapStateToProps,
  { getById }
)(Detail);

import { connect } from 'react-redux';
import Main from '../components/Main';
import { getList as getGroupList, add as addGroup, del as delGroup } from '../redux/group';

const mapStateToProps = (state) => ({
  getGroupListResult: state.group.getListResult,
  addGroupResult: state.group.addResult,
  delGroupResult: state.group.delResult,
});

export default connect(
  mapStateToProps,
  { getGroupList, addGroup, delGroup }
)(Main);

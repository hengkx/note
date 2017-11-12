import React from 'react';
import { Select } from 'antd';
import { parse as urlParse } from 'url';
import { Route, Link } from 'react-router-dom';
import Group from '../../containers/Group';
import Note from '../../containers/Note';
import Project from '../../containers/Project';
import Param from '../Param';
import './less/main.less';

const Option = Select.Option;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      program: 'note'
    };
  }

  componentWillMount() {
    const { program } = urlParse(window.location.href, true).query;
    if (program) {
      this.setState({ program });
    }
  }

  handleChange = (val) => {
    this.setState({ program: val });
  }
  render() {
    const { program } = this.state;
    const { match } = this.props;
    return (
      <div className="main">
        <div className="header">
          <div className="logo">办公</div>
          <Link to={`${match.url}/note`}>笔记</Link>
          <Link to={`${match.url}/project`}>项目</Link>
          <Link to={`${match.url}/param`}>参数</Link>
        </div>
        <div className="container">
          <Route
            path={`${match.url}/note`}
            component={() =>
              (<div className="container"><Group />
                <Note /></div>)}
          />
          <Route path={`${match.url}/project`} component={Project} />
          <Route path={`${match.url}/param`} component={Param} />
        </div>
      </div>
    );
  }
}

export default Main;

import React from 'react';
import { Select } from 'antd';
import { parse as urlParse } from 'url';
import Group from '../../containers/Group';
import Note from '../../containers/Note';
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
    return (
      <div className="main">
        <div className="header">
          <div className="logo">办公</div>
          <Select value={program} onChange={this.handleChange}>
            <Option value="note">笔记</Option>
            <Option value="db">数据库</Option>
          </Select>
        </div>
        {program === 'note' &&
          <div className="container">
            <Group />
            <Note />
          </div>
        }
        {program === 'db' &&
          <div className="container">
            db
          </div>
        }
      </div>
    );
  }
}

export default Main;

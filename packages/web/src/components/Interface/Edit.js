import React from 'react';
import { Button } from 'antd';
import Param from '../Param';

class Edit extends React.Component {
  handleParamChange = (params) => {
    this.setState({ params });
  }
  render() {
    return (
      <div>
        <Param onChange={this.handleParamChange} />
        <Button>保存</Button>
      </div>
    );
  }
}

export default Edit;

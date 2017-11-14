import React from 'react';
import { Tabs } from 'antd';
import { Route, Link } from 'react-router-dom';
import Interface from '../../containers/Interface';
import InterfaceAdd from '../../containers/InterfaceAdd';
import InterfaceEdit from '../../containers/InterfaceEdit';

const TabPane = Tabs.TabPane;

class Detail extends React.Component {
  render() {
    const { match } = this.props;

    return (
      <div>
        {match.isExact &&
          <Tabs defaultActiveKey="1" >
            <TabPane tab="API" key="1">
              <Link to={`${match.url}/interface`}>添加接口</Link>
              <Interface />
            </TabPane>
            <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
          </Tabs>
        }
        <Route exact path={`${match.path}/interface`} component={InterfaceAdd} />
        <Route exact path={`${match.path}/interface/:interfaceId`} component={InterfaceEdit} />
      </div>
    );
  }
}

export default Detail;

import React from 'react';
import PropTypes from 'prop-types';
import { ContextMenu, MenuItem, SubMenu, connectMenu } from 'react-contextmenu';

const GroupMenu = (props) => {
  const { id, trigger } = props;
  const handleItemClick = trigger ? trigger.onItemClick : null;
  if (trigger && !trigger.group.parent) {
    return (
      <ContextMenu id={id}>
        <SubMenu title="新建" hoverDelay={0}>
          <MenuItem onClick={handleItemClick} data={{ action: 'add_note' }}>笔记</MenuItem>
          <MenuItem onClick={handleItemClick} data={{ action: 'add_group' }}>分组</MenuItem>
        </SubMenu>
      </ContextMenu>
    );
  }
  return (
    <ContextMenu id={id}>
      <SubMenu title="新建" hoverDelay={0}>
        <MenuItem onClick={handleItemClick} data={{ action: 'add_note' }}>笔记</MenuItem>
        <MenuItem onClick={handleItemClick} data={{ action: 'add_group' }}>分组</MenuItem>
      </SubMenu>
      <MenuItem divider />
      <MenuItem data={{ action: 'rename' }} onClick={handleItemClick}>
        重命名
      </MenuItem>
      <MenuItem data={{ action: 'del_group' }} onClick={handleItemClick}>
        删除
      </MenuItem>
    </ContextMenu>
  );
};

GroupMenu.propTypes = {
  id: PropTypes.string.isRequired,
  trigger: PropTypes.object
};

export default connectMenu('GROUP_MENU')(GroupMenu);

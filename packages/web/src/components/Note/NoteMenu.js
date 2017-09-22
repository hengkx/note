import React from 'react';
import PropTypes from 'prop-types';
import { ContextMenu, MenuItem, SubMenu, connectMenu } from 'react-contextmenu';

const NoteMenu = (props) => {
  const { id, trigger } = props;
  const handleItemClick = trigger ? trigger.onItemClick : null;
  if (trigger && trigger.note) {
    const { note } = trigger;
    return (
      <ContextMenu id={id}>
        <MenuItem onClick={handleItemClick} data={{ action: 'public_share' }}>公开分享</MenuItem>
        <MenuItem onClick={handleItemClick} data={{ action: 'private_share' }}>私密分享</MenuItem>
        {note.is_shared &&
          <MenuItem onClick={handleItemClick} data={{ action: 'cancel_share' }}>取消分享</MenuItem>
        }
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

NoteMenu.propTypes = {
  id: PropTypes.string.isRequired,
  trigger: PropTypes.object
};

export default connectMenu('NOTE_MENU')(NoteMenu);

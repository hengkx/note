import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import { Link } from 'react-router-dom';
import './less/pageHeaderLayout.less';

const PageHeaderLayout = ({ children, wrapperClassName, top, ...restProps }) => (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <PageHeader {...restProps} linkElement={Link} />
    {children ? <div className="content">{children}</div> : null}
  </div>
);

PageHeaderLayout.propTypes = {
  children: PropTypes.any,
  top: PropTypes.element,
  wrapperClassName: PropTypes.string,
};

export default PageHeaderLayout;

/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';

import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
  const { layoutConfig } = useContext(LayoutContext);

  return (
    <div className="layout-footer">
      <span className="ml-2 font-medium">
        {process.env.NEXT_PUBLIC_PROJECT_NAME}
      </span>
    </div>
  );
};

export default AppFooter;

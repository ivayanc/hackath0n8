/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';

import type { AppMenuItem } from '@/types';

import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model: AppMenuItem[] = [
    {
      label: 'Головна сторінка',
      items: [
        {
          label: 'Дашборд',
          icon: 'pi pi-fw pi-home',
          to: '/'
        }
      ]
    },
    {
      label: 'Запити',
      items: [
        {
          label: 'Нові запити',
          icon: 'pi pi-fw pi-list',
          to: '/new-user-request'
        },
        { label: 'Мої запити', icon: 'pi pi-fw pi-list', to: '/my-request' }
      ]
    }
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuitem item={item} root index={i} key={item.label} />
          ) : (
            <li className="menu-separator" />
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;

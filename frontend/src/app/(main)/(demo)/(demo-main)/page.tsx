'use client';

import type { ChartData, ChartOptions } from 'chart.js';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { ProductService } from '@/service/ProductService';
import type { Demo } from '@/types';

const lineData: ChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: '#2f4860',
      borderColor: '#2f4860',
      tension: 0.4
    },
    {
      label: 'Second Dataset',
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: '#00bb7e',
      borderColor: '#00bb7e',
      tension: 0.4
    }
  ]
};

const Dashboard = () => {
  const [products, setProducts] = useState<Demo.Product[]>([]);
  const menu1 = useRef<Menu>(null);
  const menu2 = useRef<Menu>(null);
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
  const { layoutConfig } = useContext(LayoutContext);

  const applyLightTheme = () => {
    const lineOptions: ChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };

    setLineOptions(lineOptions);
  };

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)'
          }
        },
        y: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)'
          }
        }
      }
    };

    setLineOptions(lineOptions);
  };

  useEffect(() => {
    ProductService.getProductsSmall().then(data => setProducts(data));
  }, []);

  useEffect(() => {
    if (layoutConfig.colorScheme === 'light') {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig.colorScheme]);

  const formatCurrency = (value: number) => {
    return value?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="justify-content-between mb-3 flex">
            <div>
              <span className="text-500 mb-3 block font-medium">Orders</span>
              <div className="text-900 text-xl font-medium">152</div>
            </div>
            <div
              className="align-items-center justify-content-center border-round flex bg-blue-100"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-shopping-cart text-xl text-blue-500" />
            </div>
          </div>
          <span className="font-medium text-green-500">24 new </span>
          <span className="text-500">since last visit</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="justify-content-between mb-3 flex">
            <div>
              <span className="text-500 mb-3 block font-medium">Revenue</span>
              <div className="text-900 text-xl font-medium">$2.100</div>
            </div>
            <div
              className="align-items-center justify-content-center border-round flex bg-orange-100"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-map-marker text-xl text-orange-500" />
            </div>
          </div>
          <span className="font-medium text-green-500">%52+ </span>
          <span className="text-500">since last week</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="justify-content-between mb-3 flex">
            <div>
              <span className="text-500 mb-3 block font-medium">Customers</span>
              <div className="text-900 text-xl font-medium">28441</div>
            </div>
            <div
              className="align-items-center justify-content-center border-round flex bg-cyan-100"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-inbox text-xl text-cyan-500" />
            </div>
          </div>
          <span className="font-medium text-green-500">520 </span>
          <span className="text-500">newly registered</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="justify-content-between mb-3 flex">
            <div>
              <span className="text-500 mb-3 block font-medium">Comments</span>
              <div className="text-900 text-xl font-medium">152 Unread</div>
            </div>
            <div
              className="align-items-center justify-content-center border-round flex bg-purple-100"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-comment text-xl text-purple-500" />
            </div>
          </div>
          <span className="font-medium text-green-500">85 </span>
          <span className="text-500">responded</span>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Recent Sales</h5>
          <DataTable
            value={products}
            rows={5}
            paginator
            responsiveLayout="scroll"
          >
            <Column
              header="Image"
              body={data => (
                <img
                  className="shadow-2"
                  src={`/demo/images/product/${data.image}`}
                  alt={data.image}
                  width="50"
                />
              )}
            />
            <Column
              field="name"
              header="Name"
              sortable
              style={{ width: '35%' }}
            />
            <Column
              field="price"
              header="Price"
              sortable
              style={{ width: '35%' }}
              body={data => formatCurrency(data.price)}
            />
            <Column
              header="View"
              style={{ width: '15%' }}
              body={() => <Button icon="pi pi-search" text />}
            />
          </DataTable>
        </div>
        <div className="card">
          <div className="justify-content-between align-items-center mb-5 flex">
            <h5>Best Selling Products</h5>
            <div>
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                rounded
                text
                className="p-button-plain"
                onClick={event => menu1.current?.toggle(event)}
              />
              <Menu
                ref={menu1}
                popup
                model={[
                  { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                  { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                ]}
              />
            </div>
          </div>
          <ul className="m-0 list-none p-0">
            <li className="flex-column md:align-items-center md:justify-content-between mb-4 flex md:flex-row">
              <div>
                <span className="text-900 mb-1 mr-2 font-medium md:mb-0">
                  Space T-Shirt
                </span>
                <div className="text-600 mt-1">Clothing</div>
              </div>
              <div className="align-items-center mt-2 flex md:mt-0">
                <div
                  className="surface-300 border-round w-10rem lg:w-6rem overflow-hidden"
                  style={{ height: '8px' }}
                >
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: '50%' }}
                  />
                </div>
                <span className="ml-3 font-medium text-orange-500">%50</span>
              </div>
            </li>
            <li className="flex-column md:align-items-center md:justify-content-between mb-4 flex md:flex-row">
              <div>
                <span className="text-900 mb-1 mr-2 font-medium md:mb-0">
                  Portal Sticker
                </span>
                <div className="text-600 mt-1">Accessories</div>
              </div>
              <div className="align-items-center ml-0 mt-2 flex md:ml-8 md:mt-0">
                <div
                  className="surface-300 border-round w-10rem lg:w-6rem overflow-hidden"
                  style={{ height: '8px' }}
                >
                  <div
                    className="h-full bg-cyan-500"
                    style={{ width: '16%' }}
                  />
                </div>
                <span className="ml-3 font-medium text-cyan-500">%16</span>
              </div>
            </li>
            <li className="flex-column md:align-items-center md:justify-content-between mb-4 flex md:flex-row">
              <div>
                <span className="text-900 mb-1 mr-2 font-medium md:mb-0">
                  Supernova Sticker
                </span>
                <div className="text-600 mt-1">Accessories</div>
              </div>
              <div className="align-items-center ml-0 mt-2 flex md:ml-8 md:mt-0">
                <div
                  className="surface-300 border-round w-10rem lg:w-6rem overflow-hidden"
                  style={{ height: '8px' }}
                >
                  <div
                    className="h-full bg-pink-500"
                    style={{ width: '67%' }}
                  />
                </div>
                <span className="ml-3 font-medium text-pink-500">%67</span>
              </div>
            </li>
            <li className="flex-column md:align-items-center md:justify-content-between mb-4 flex md:flex-row">
              <div>
                <span className="text-900 mb-1 mr-2 font-medium md:mb-0">
                  Wonders Notebook
                </span>
                <div className="text-600 mt-1">Office</div>
              </div>
              <div className="align-items-center ml-0 mt-2 flex md:ml-8 md:mt-0">
                <div
                  className="surface-300 border-round w-10rem lg:w-6rem overflow-hidden"
                  style={{ height: '8px' }}
                >
                  <div
                    className="h-full bg-green-500"
                    style={{ width: '35%' }}
                  />
                </div>
                <span className="ml-3 font-medium text-green-500">%35</span>
              </div>
            </li>
            <li className="flex-column md:align-items-center md:justify-content-between mb-4 flex md:flex-row">
              <div>
                <span className="text-900 mb-1 mr-2 font-medium md:mb-0">
                  Mat Black Case
                </span>
                <div className="text-600 mt-1">Accessories</div>
              </div>
              <div className="align-items-center ml-0 mt-2 flex md:ml-8 md:mt-0">
                <div
                  className="surface-300 border-round w-10rem lg:w-6rem overflow-hidden"
                  style={{ height: '8px' }}
                >
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: '75%' }}
                  />
                </div>
                <span className="ml-3 font-medium text-purple-500">%75</span>
              </div>
            </li>
            <li className="flex-column md:align-items-center md:justify-content-between mb-4 flex md:flex-row">
              <div>
                <span className="text-900 mb-1 mr-2 font-medium md:mb-0">
                  Robots T-Shirt
                </span>
                <div className="text-600 mt-1">Clothing</div>
              </div>
              <div className="align-items-center ml-0 mt-2 flex md:ml-8 md:mt-0">
                <div
                  className="surface-300 border-round w-10rem lg:w-6rem overflow-hidden"
                  style={{ height: '8px' }}
                >
                  <div
                    className="h-full bg-teal-500"
                    style={{ width: '40%' }}
                  />
                </div>
                <span className="ml-3 font-medium text-teal-500">%40</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Sales Overview</h5>
          <Chart type="line" data={lineData} options={lineOptions} />
        </div>

        <div className="card">
          <div className="align-items-center justify-content-between mb-4 flex">
            <h5>Notifications</h5>
            <div>
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                rounded
                text
                className="p-button-plain"
                onClick={event => menu2.current?.toggle(event)}
              />
              <Menu
                ref={menu2}
                popup
                model={[
                  { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                  { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                ]}
              />
            </div>
          </div>

          <span className="text-600 mb-3 block font-medium">TODAY</span>
          <ul className="mx-0 mb-4 mt-0 list-none p-0">
            <li className="align-items-center border-bottom-1 surface-border flex py-2">
              <div className="w-3rem h-3rem align-items-center justify-content-center border-circle mr-3 flex shrink-0 bg-blue-100">
                <i className="pi pi-dollar text-xl text-blue-500" />
              </div>
              <span className="text-900 line-height-3">
                Richard Jones
                <span className="text-700">
                  {' '}
                  has purchased a blue t-shirt for{' '}
                  <span className="text-blue-500">79$</span>
                </span>
              </span>
            </li>
            <li className="align-items-center flex py-2">
              <div className="w-3rem h-3rem align-items-center justify-content-center border-circle mr-3 flex shrink-0 bg-orange-100">
                <i className="pi pi-download text-xl text-orange-500" />
              </div>
              <span className="text-700 line-height-3">
                Your request for withdrawal of{' '}
                <span className="font-medium text-blue-500">2500$</span> has
                been initiated.
              </span>
            </li>
          </ul>

          <span className="text-600 mb-3 block font-medium">YESTERDAY</span>
          <ul className="m-0 list-none p-0">
            <li className="align-items-center border-bottom-1 surface-border flex py-2">
              <div className="w-3rem h-3rem align-items-center justify-content-center border-circle mr-3 flex shrink-0 bg-blue-100">
                <i className="pi pi-dollar text-xl text-blue-500" />
              </div>
              <span className="text-900 line-height-3">
                Keyser Wick
                <span className="text-700">
                  {' '}
                  has purchased a black jacket for{' '}
                  <span className="text-blue-500">59$</span>
                </span>
              </span>
            </li>
            <li className="align-items-center border-bottom-1 surface-border flex py-2">
              <div className="w-3rem h-3rem align-items-center justify-content-center border-circle mr-3 flex shrink-0 bg-pink-100">
                <i className="pi pi-question text-xl text-pink-500" />
              </div>
              <span className="text-900 line-height-3">
                Jane Davis
                <span className="text-700">
                  {' '}
                  has posted a new questions about your product.
                </span>
              </span>
            </li>
          </ul>
        </div>
        <div
          className="shadow-2 flex-column md:align-items-center justify-content-between mb-3 flex px-4 py-5 md:flex-row"
          style={{
            borderRadius: '1rem',
            background:
              'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)'
          }}
        >
          <div>
            <div className="mb-3 mt-2 text-xl font-medium text-blue-100">
              TAKE THE NEXT STEP
            </div>
            <div className="text-5xl font-medium text-white">
              Try PrimeBlocks
            </div>
          </div>
          <div className="mr-auto mt-4 md:mr-0 md:mt-0">
            <Link
              href="https://blocks.primereact.org"
              className="p-button p-button-warning p-button-rounded p-button-raised px-5 py-3 font-bold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

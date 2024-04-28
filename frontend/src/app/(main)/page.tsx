'use client';

import type { ChartData, ChartOptions } from 'chart.js';
import { useRouter } from 'next/navigation';
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';

import { LayoutContext } from '@/layout/context/layoutcontext';
import UserRequestService from '@/service/UserRequestService';
import { Dashboard } from '@/types/dashboard';

const Dashboard = () => {
  const [lineOptions, setLineOptions] = useState<ChartOptions>({});
  const { layoutConfig } = useContext(LayoutContext);
  const [dashboard, setDashboard] = useState<Dashboard>({});

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
  const router = useRouter();
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('auth-tokens-development');
      if (!token) {
        router.push('/login');
      }
    };

    checkLoginStatus().then(() =>
      UserRequestService.getDashboard().then(data => setDashboard(data))
    );
  }, [router]);

  const lineData: ChartData = {
    labels: dashboard.day_statistic?.map(stat => stat.day),
    datasets: [
      {
        label: 'Кількість запитів',
        data: dashboard.day_statistic?.map(stat => stat.cnt),
        fill: false,
        backgroundColor: '#2f4860',
        borderColor: '#2f4860',
        tension: 0.6
      }
    ]
  };
  useEffect(() => {
    if (layoutConfig.colorScheme === 'light') {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig.colorScheme]);

  return (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="justify-content-between mb-3 flex">
            <div>
              <span className="text-500 mb-3 block font-medium">
                Нові запити{' '}
              </span>
              <div className="text-900 text-xl font-medium">
                {dashboard.new_cnt}
              </div>
            </div>
            <div
              className="align-items-center justify-content-center border-round flex bg-blue-100"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-sign-in text-xl text-blue-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="justify-content-between mb-3 flex">
            <div>
              <span className="text-500 mb-3 block font-medium">
                Запити в обробці
              </span>
              <div className="text-900 text-xl font-medium">
                {dashboard.in_progress_cnt}
              </div>
            </div>
            <div
              className="align-items-center justify-content-center border-round flex bg-yellow-100"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-spinner text-xl text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="justify-content-between mb-3 flex">
            <div>
              <span className="text-500 mb-3 block font-medium">
                Завершені запити
              </span>
              <div className="text-900 text-xl font-medium">
                {dashboard.completed_cnt}
              </div>
            </div>
            <div
              className="align-items-center justify-content-center border-round flex bg-green-100"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-check text-xl text-green-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="justify-content-between mb-3 flex">
            <div>
              <span className="text-500 mb-3 block font-medium">
                Загальна кількість
              </span>
              <div className="text-900 text-xl font-medium">
                {dashboard.total_cnt}
              </div>
            </div>
            <div
              className="align-items-center justify-content-center border-round flex bg-purple-100"
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              <i className="pi pi-th-large text-xl text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 xl:col-3">
        <div className="card">
          <div className="justify-content-between align-items-start mb-5 flex">
            <h5>Статистика по категоріям</h5>
          </div>
          <ul className="m-0 list-none p-0">
            {dashboard.category_statistic?.map(category => (
              <li className="flex-column md:align-items-center md:justify-content-between mb-4 md:flex-row">
                <div>
                  <span className="text-900 mb-2 mr-2 font-medium md:mb-0">
                    {category.category_name}
                  </span>
                </div>
                <div className="align-items-center mt-2 flex md:mt-0">
                  <div
                    className="surface-300 border-round w-10rem lg:w-6rem overflow-hidden"
                    style={{ height: '8px' }}
                  >
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${category.procent}%` }}
                    />
                  </div>
                  <span className="ml-3 font-medium text-green-500">
                    %{category.procent}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-12 xl:col-9">
        <div className="card">
          <h5>Статистика нових запитів за тиждень</h5>
          <Chart type="line" data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

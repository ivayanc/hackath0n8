'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import React, { useContext, useState } from 'react';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { login } from '@/lib/login';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);

  const { layoutConfig } = useContext(LayoutContext);
  const router = useRouter();
  const containerClassName = classNames(
    'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen'
  );

  const handleSubmit = async () => {
    if (!email || !password) {
      console.log('Input email and password');
      return;
    }

    try {
      await login({ email, password });
      router.push('/my-request');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className={containerClassName}>
      <div className="flex-column align-items-center justify-content-center flex">
        <div
          style={{
            borderRadius: '56px',
            padding: '0.3rem',
            background:
              'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
          }}
        >
          <div
            className="surface-card w-full px-5 py-8 sm:px-8"
            style={{ borderRadius: '53px' }}
          >
            <div className="mb-5 text-center">
              <span className="text-600 font-medium">Авторизуйтесь для продовження</span>
            </div>

            <div>
              <label
                htmlFor="email1"
                className="text-900 mb-2 block text-xl font-medium"
              >
                Email
              </label>
              <InputText
                id="email1"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email адреса"
                className="md:w-30rem mb-5 w-full"
                style={{ padding: '1rem' }}
              />

              <label
                htmlFor="password1"
                className="text-900 mb-2 block text-xl font-medium"
              >
                Пароль
              </label>
              <Password
                inputId="password1"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Пароль"
                toggleMask
                className="mb-5 w-full"
                inputClassName="w-full p-3 md:w-30rem"
                feedback={false}
              />

              <div className="align-items-center justify-content-between mb-5 flex gap-5">
                <div className="align-items-center flex" />
              </div>
              <Button
                label="Авторизуватись"
                className="w-full p-3 text-xl"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

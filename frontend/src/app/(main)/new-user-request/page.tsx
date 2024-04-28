'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import UserRequestList from '@/components/user-request/user-request.list';
import { UserRequestService } from '@/service/UserRequestService';
import type { UserRequest } from '@/types/user-request';

function Page() {
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('auth-tokens-development');
      if (!token) {
        router.push('/login');
      }
    };

    checkLoginStatus().then(() =>
      UserRequestService.getUserRequestAll().then(data => setUserRequests(data))
    );
  }, [router]);

  return (
    <UserRequestList
      initialUserRequests={userRequests}
      showFilterOptions={false}
    />
  );
}
export default Page;

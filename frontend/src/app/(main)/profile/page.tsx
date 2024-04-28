'use client';

import {Card} from "primereact/card";
import React, {useEffect, useState} from "react";
import type {UserRequest} from "@/types/user-request";
import {useRouter} from "next/navigation";
import UserRequestService from "@/service/UserRequestService";
import {UserProfile} from "@/types/user-profile";

export default function Page(){

    const [userProfile, setUserProfile] = useState<UserProfile>({});
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem('auth-tokens-development');
            if (!token) {
                router.push('/login');
            }
        };

        checkLoginStatus().then(() =>
            UserRequestService.getUserProfile().then(data =>
                setUserProfile(data)
            )
        );
    }, [router]);


    return (
        <Card>

            <div className="flex-column align-items-center flex flex-1 text-center md:text-left">
                <img src="/demo/images/profile-svgrepo-com.svg" className="mb-5 w-6rem flex-shrink-0"/>
                <div className="text-2xl font-bold">{userProfile.full_name}</div>
                <div className="mb-2">{userProfile.email}</div>
                <div className="align-items-center flex">
                </div>
            </div>
        </Card>
    )
}
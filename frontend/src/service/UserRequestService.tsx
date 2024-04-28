import { axiosInstance } from '@/http/api';
import type { Dashboard } from '@/types/dashboard';
import type { UserRequest } from '@/types/user-request';
import {UserProfile} from "@/types/user-profile";

export const UserRequestService = {
  async getUserRequestAll() {
    return axiosInstance
      .get<UserRequest[]>('/requests/')
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to fetch user requests: ${error.message}`);
      });
  },

    async getUserProfile() {
        return axiosInstance
            .get<UserProfile>('/profile/')
            .then(response => response.data)
            .catch(error => {
                throw new Error(`Failed to fetch user requests: ${error.message}`);
            });
    },

  async startRequestProcessing({ requestId }: { requestId: string }) {
    axiosInstance
      .post(`/requests/${requestId}/take_in_progress/`)
      .then()
      .catch(error => {
        throw new Error(`Failed to fetch user requests: ${error.message}`);
      });
  },

  async completeRequest({ requestId }: { requestId: string }) {
    axiosInstance
      .post(`/requests/${requestId}/complete/`)
      .then()
      .catch(error => {
        throw new Error(`Failed to fetch user requests: ${error.message}`);
      });
  },

  async getMyUserRequestAll() {
    return axiosInstance
      .get<UserRequest[]>('/requests/my/')
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to fetch user requests: ${error.message}`);
      });
  },

  async getDashboard() {
    return axiosInstance
      .get<Dashboard>('/dashboard/')
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to fetch user requests: ${error.message}`);
      });
  }
};

export default UserRequestService;

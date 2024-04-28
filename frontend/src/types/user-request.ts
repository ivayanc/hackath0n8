export enum UserRequestStatus {
  Completed = 'completed',
  New = 'new',
  InProgress = 'in_progress'
}

export interface UserRequest {
  id: string;
  category: string;
  name: string;
  description: string;
  created_at: string;
  status: UserRequestStatus;
  full_name: string;
  phone_number: string;
}

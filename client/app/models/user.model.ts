export declare interface User {
  _id: string;
  name: string;
  description: string;
  email: string;
  gender: string;
  role: string;
  createdOn: Date;
  phone: string;
  birthdate: Date;
  occupation: string;
  profileUrl: string;
  coverUrl: string;
  password: string;
  profileImageUrl: string;
  coverImageUrl: string;
  messageConversations: any[];
  status: string;
  active: boolean;
}

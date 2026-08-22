import { UserTypes } from "./_user";

export type LoginResponse={
    data: null,
    code: number,
    statusCode: 200 | 401 | 404 | 402 | 403 | 405 | 500;
    message: string;
    success: boolean;
    errors: string | null | Record<string, string[]>;
}

export type OtpResponse = {
  user:UserTypes.UserProfile;
  token:string;
}
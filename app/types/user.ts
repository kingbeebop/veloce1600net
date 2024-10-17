// Defines the shape of the payload required for user login
export interface LoginPayload {
    username: string;  // The username of the user attempting to log in
    password: string;  // The password of the user attempting to log in
  }
  
  // Defines the shape of the response returned after a successful login
  export interface LoginResponse {
    user: User;              // The user object containing user information
    accessToken: string;     // The access token issued after a successful login
    refreshToken: string;    // The refresh token issued after a successful login
  }
  
  // Defines the shape of the user object
  export interface User {
    username: string;  // The username of the logged-in user
    email: string;
    avatar: string;    // The URL of the user's avatar image
  }
  
class AuthenticationService {
  
  static isAuthenticated = false;

  static logout() {
    // Perform logout logic here, such as revoking the token on the server
    AuthenticationService.isAuthenticated = false;
    localStorage.removeItem('token'); // Remove the stored token
  }

  static getToken() {
    return localStorage.getItem('token');
  }
}

export default AuthenticationService;

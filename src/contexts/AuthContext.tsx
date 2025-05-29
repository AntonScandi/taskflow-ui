import React, { createContext, useContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthState, User } from "../types/data-types";
import { api } from "../services/api";

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "REGISTER_SUCCESS"; payload: { user: User; token: string } }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "AUTH_LOADED" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "AUTH_LOADED":
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType>({
  authState: initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        dispatch({ type: "AUTH_LOADED" });
        return;
      }
      
      try {
        // Set the token in the API headers
        api.setAuthToken(token);
        
        // Decode the token to get user info
        const decoded: any = jwtDecode(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          dispatch({ type: "LOGOUT" });
          return;
        }
        
        // Get user data from API
        try {
          // Try to get user from actual API
          const response = await api.get(`/users/me`);
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: response.data, token }
          });
        } catch (apiError) {
          // Fallback to mock data if API fails
          console.log("Falling back to mock data for user");
          const mockUserId = decoded.id;
          const mockResponse = await api.get(`/users/${mockUserId}`);
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: mockResponse.data, token }
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);
        dispatch({ type: "LOGOUT" });
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Use the explicit login method
      const response = await api.login(email, password);
      const { user, token } = response.data;
      
      api.setAuthToken(token);
      
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token }
      });
    } catch (error: any) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response?.data?.message || "Login failed"
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Use the explicit register method
      const response = await api.register(name, email, password);
      const { user, token } = response.data;
      
      api.setAuthToken(token);
      
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: { user, token }
      });
    } catch (error: any) {
      dispatch({
        type: "REGISTER_FAILURE",
        payload: error.response?.data?.message || "Registration failed"
      });
      throw error;
    }
  };

  const logout = () => {
    api.removeAuthToken();
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (user: User) => {
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
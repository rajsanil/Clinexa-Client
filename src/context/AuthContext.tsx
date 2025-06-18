import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { API_SETTINGS } from "../utils/settings";
import { AuthContextType, AuthResponse, AuthUser } from "../types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to decode JWT token
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        // Check if token is expired
        const decodedToken = decodeJWT(savedToken);
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } else {
          // Token is expired, clear localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      console.log("Attempting login for:", username);

      const response = await fetch(API_SETTINGS.USER_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          Password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AuthResponse = await response.json();
      console.log("Login response:", data);

      if (data.result && data.token) {
        // Check for account restrictions
        if (data.isLockedOut) {
          console.error("Account is locked out");
          return false;
        }

        if (data.isNotAllowed) {
          console.error("Account is not allowed");
          return false;
        }

        // Decode token to get role information
        const decodedToken = decodeJWT(data.token);
        const userRole = decodedToken?.role || "User";

        const userData: AuthUser = {
          userName: data.username,
          role: userRole,
          isLockedOut: data.isLockedOut,
          isNotAllowed: data.isNotAllowed,
          requiresTwoFactor: data.requiresTwoFactor,
        };

        // Save to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update state
        setToken(data.token);
        setUser(userData);
        setIsAuthenticated(true);

        console.log("Login successful");
        return true;
      } else {
        console.error("Login failed:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log("User logged out");
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

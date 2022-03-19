import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../config";
import { setAuthToken, setUsername } from "../slices/userSlice";
import { RootState } from "../store";

export const useAuthentication = () => {
  const dispatch = useDispatch();

  const token = useSelector<RootState, string>(state => state.users.authToken);
  const username = useSelector<RootState, string>(state => state.users.username);

  const setToken = (newToken: string) => {
    dispatch(setAuthToken(newToken));
    localStorage.setItem("authToken", newToken);
  };

  const regenerateToken = async (): Promise<string> => {
    try {
      const response = await fetch(`${apiUrl}/auth/regenerate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        setToken(newToken);
        return newToken;
      }
      else {
        return Promise.reject(await response.text());
      }
    }
    catch (error) {
      return Promise.reject(error);
    }
  };

  const register = async (username: string, password: string): Promise<string> => {
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        setToken(authToken);
        dispatch(setUsername(username));
        return authToken;
      }
      else {
        return Promise.reject(await response.text());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const login = async (username: string, password: string): Promise<string> => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        setToken(authToken);
        dispatch(setUsername(username));
        return authToken;
      }
      else {
        return Promise.reject(await response.text());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logOut = () => {
    dispatch(setAuthToken(""));
    dispatch(setUsername(""));
    localStorage.removeItem("authToken");
  };

  const refetchUsername = async () => {
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/@me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          dispatch(setUsername(data.user_name));
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    else {
      dispatch(setUsername(""));
    }
  };

  return {
    token,
    setToken,
    isLoggedIn: !!token,
    regenerateToken,
    register,
    login,
    logOut,
    username,
    refetchUsername
  };
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser({ username: storedUser, token: storedToken });
    }
  }, []);

  const loginUser = (username, token) => {
    setUser({ username, token });
    localStorage.setItem("username", username);
    localStorage.setItem("authToken", token);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("username");
    localStorage.removeItem("authToken");
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

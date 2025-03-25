import { createContext, useState, useEffect, useContext } from "react";

export const authContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const user = JSON.parse(atob(token.split(".")[1]));
        setAuthUser(user);
      } catch (error) {
        console.error("Invalid Token: ", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <authContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(authContext);
};

export default AuthContextProvider;

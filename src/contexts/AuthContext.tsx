import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import STORAGE_KEY from '../utils/storageKeyMap';

const defaultValue = {
  isLoggedIn: false,
  token: null,
  name: null,
  email: null,
  username: null,
  id: null,
};

type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  name: string | null;
  email: string | null;
  username: string | null;
  id: string | null;
};

type ContextType = {
  state: AuthState;
  logout: (() => Promise<void>) | (() => void);
  addUser:
    | ((payload: {
        token: string;
        name: string;
        email: string;
        id: string;
        username: string | null;
      }) => Promise<void>)
    | (() => void);
};

const defaultFunc = () => {};

const AuthContext = createContext<ContextType>({
  state: defaultValue,
  logout: defaultFunc,
  addUser: defaultFunc,
});

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [state, setState] = useState<AuthState>(defaultValue);

  useEffect(() => {
    async function init() {
      try {
        let isLoggedIn = await AsyncStorage.getItem(STORAGE_KEY.IS_LOGGED_IN);
        isLoggedIn = JSON.parse(isLoggedIn as string);

        if (isLoggedIn) {
          let user = await AsyncStorage.getItem(STORAGE_KEY.USER);

          let parsedUser: {
            token: string;
            name: string;
            email: string;
            id: string;
            username: string | null;
          } = JSON.parse(user as string);

          setState({...parsedUser, isLoggedIn: true});
        }
      } catch (err) {
        console.log(err);
      }
    }

    init();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY.USER);
      await AsyncStorage.setItem(
        STORAGE_KEY.IS_LOGGED_IN,
        JSON.stringify(false),
      );

      setState(defaultValue);
    } catch (err) {
      console.log(err);
    }
  };

  const addUser = async (payload: {
    token: string;
    name: string;
    email: string;
    id: string;
    username: string | null;
  }) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY.USER, JSON.stringify(payload));
      await AsyncStorage.setItem(
        STORAGE_KEY.IS_LOGGED_IN,
        JSON.stringify(true),
      );

      setState({isLoggedIn: true, ...payload});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider value={{state, logout, addUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export {AuthProvider};

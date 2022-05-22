/* 
Universal Provider
A component to keep all the providers at a place and keep the code clean.
*/

import {View, Text} from 'react-native';
import React from 'react';

// Providers
import {AuthProvider} from './AuthContext';
import {EditorProvider} from './EditorContext';
import {ThemeProvider} from './ThemeContext';

const Provider = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EditorProvider>{children}</EditorProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Provider;

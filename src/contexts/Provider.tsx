/* 
Universal Provider
A component to keep all the providers at a place and keep the code clean.
*/

import {View, Text} from 'react-native';
import React from 'react';

// Custom Providers
import {AuthProvider} from './AuthContext';
import {EditorProvider} from './EditorContext';
import {ThemeProvider} from './ThemeContext';

// Library based

const Provider = ({children}: {children: React.ReactNode}) => {
  return (
    // Custom
    <ThemeProvider>
      <AuthProvider>
        <EditorProvider>
          {/* From libraries */}
          {children}
        </EditorProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Provider;

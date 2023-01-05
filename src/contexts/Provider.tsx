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
import {ListProvider} from './ListContext';
import {StreakProvider} from './StreakContext';

// Library based

const Provider = ({children}: {children: React.ReactNode}) => {
  return (
    // Custom
    <ThemeProvider>
      <AuthProvider>
        <EditorProvider>
          <ListProvider>
            <StreakProvider>
              {/* From libraries */}
              {children}
            </StreakProvider>
          </ListProvider>
        </EditorProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Provider;

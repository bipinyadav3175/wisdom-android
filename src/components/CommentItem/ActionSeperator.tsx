import {View} from 'react-native';
import React, {useContext} from 'react';

import ThemeContext from '../../contexts/ThemeContext';
import {Spacing} from '../../../theme';

const ActionSeperator = () => {
  const {Theme} = useContext(ThemeContext);

  return (
    <View
      style={{
        backgroundColor: Theme.Placeholder,
        width: 1,
        height: '80%',
        borderRadius: 3,
        marginHorizontal: Spacing.Margin.Small,
      }}
    />
  );
};

export default ActionSeperator;

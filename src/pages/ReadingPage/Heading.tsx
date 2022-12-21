import {View, Text} from 'react-native';
import React, {useContext} from 'react';
import {CustomFonts, Spacing} from '../../../theme';

import ThemeContext from '../../contexts/ThemeContext';

const Heading = ({text}: {text: string}) => {
  const {Theme, type} = useContext(ThemeContext);

  return (
    <Text
      style={{
        color: type === 'dark' ? Theme.SecondaryText : Theme.PrimaryText,
        marginVertical: Spacing.Margin.Normal,
        paddingHorizontal: Spacing.Padding.Normal,
        fontSize: 24,
        fontFamily: CustomFonts.SSP.SemiBold,
      }}>
      {text}
    </Text>
  );
};

export default Heading;

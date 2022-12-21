import {View, Text} from 'react-native';
import React, {useMemo, useContext} from 'react';
import {formatData} from '../../components/Editor/utils';
import {CustomFonts, Spacing} from '../../../theme';

import ThemeContext from '../../contexts/ThemeContext';

type Props = {
  content: string;
  markup: {
    type: string;
    start: number;
    end: number;
  }[];
};

const Paragraph = ({content, markup}: Props) => {
  const {Theme, type} = useContext(ThemeContext);

  const data = useMemo(() => {
    return formatData(content, markup);
  }, []);

  return (
    <Text
      style={{
        fontFamily: CustomFonts.SSP.Regular,
        color: type === 'dark' ? Theme.SecondaryText : Theme.PrimaryText,
        fontSize: 21,
        marginVertical: Spacing.Margin.Normal,
        paddingHorizontal: Spacing.Padding.Normal,
      }}>
      {data.map((item, ind) => {
        let font = CustomFonts.SSP.Regular;
        let underline = false;
        switch (item.type) {
          case 'BOLD':
            font = CustomFonts.SSP.SemiBold;
            break;

          case 'ITALIC':
            font = CustomFonts.SSP.Italic;
            break;

          case 'UNDERLINE':
            underline = true;
            break;

          default:
            break;
        }

        return (
          <Text
            key={'text-' + ind}
            style={{
              color: type === 'dark' ? Theme.SecondaryText : Theme.PrimaryText,
              fontSize: 21,
              fontFamily: font,
              textDecorationLine: underline ? 'underline' : undefined,
            }}>
            {item.text}
          </Text>
        );
      })}
    </Text>
  );
};

export default Paragraph;

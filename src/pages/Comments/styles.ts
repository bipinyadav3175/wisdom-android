import {StyleSheet} from 'react-native';
import {CustomFonts, Spacing} from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCont: {
    marginVertical: Spacing.Margin.Normal,
    paddingHorizontal: Spacing.Padding.Normal,
  },
  heading: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 18,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    borderRadius: 13,
    fontSize: 17,
    paddingHorizontal: Spacing.Padding.Normal,
    marginVertical: Spacing.Margin.Normal,
    maxHeight: 300,
    borderWidth: 1,
  },
  sendCont: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  send: {
    fontSize: 19,
    fontFamily: CustomFonts.SSP.SemiBold,
  },
});

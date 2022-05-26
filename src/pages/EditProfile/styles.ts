import {StyleSheet} from 'react-native';
import {CustomFonts, Spacing} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: Spacing.Padding.Normal,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 80,
  },
  change: {
    fontSize: 13,
    marginTop: 5,
  },
  inputTitle: {
    fontFamily: CustomFonts.Ubuntu.Regular,
    fontSize: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  saveBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#0984e3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.Margin.Large,
  },
  saveText: {
    fontFamily: CustomFonts.Ubuntu.Medium,
    fontSize: 20,
  },
  tipText: {
    fontSize: 14,
    marginTop: 10,
  },
});

export default styles;

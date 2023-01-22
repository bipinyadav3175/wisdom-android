import {StyleSheet, Dimensions} from 'react-native';
import {CustomFonts, Spacing} from '../../../theme';

const deviceWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    width: deviceWidth,
    // paddingHorizontal: Spacing.Padding.Normal,
    // paddingRight: Spacing.Padding.Normal,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginHorizontal: Spacing.Margin.Normal,
  },
  name: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 17,
  },
  username: {
    fontSize: 15,
  },
  commentCont: {
    width: '100%',
    marginTop: Spacing.Margin.Small,
    paddingRight: Spacing.Padding.Normal,
  },
  commentText: {
    fontSize: 19,
    lineHeight: 25,
  },
  actionsCont: {
    marginTop: Spacing.Margin.Normal,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginHorizontal: Spacing.Margin.Small,
  },
  viewMore: {
    // color: '#70a1ff',
  },
  bodyWrapper: {
    marginRight: Spacing.Margin.Normal,
    width: deviceWidth - (40 + 15 * 3),
  },
});

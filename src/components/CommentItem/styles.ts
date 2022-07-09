import {StyleSheet} from 'react-native';
import {CustomFonts, Spacing} from '../../../theme';

export default StyleSheet.create({
  container: {
    width: '100%',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: Spacing.Margin.Large,
  },
  name: {
    fontFamily: CustomFonts.Ubuntu.Medium,
    fontSize: 17,
  },
  username: {
    fontSize: 13,
  },
  commentCont: {
    marginTop: Spacing.Margin.Large,
  },
  commentText: {
    fontSize: 18,
    lineHeight: 30,
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
    color: '#70a1ff',
  },
});

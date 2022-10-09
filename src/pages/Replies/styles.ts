import {StyleSheet} from 'react-native';
import {Spacing, CustomFonts} from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.Padding.Large,
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
  header: {
    flexDirection: 'row',
    marginBottom: Spacing.Margin.Large,
    alignItems: 'center',
  },
  chevron: {
    marginRight: Spacing.Padding.Normal,
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
  },
});

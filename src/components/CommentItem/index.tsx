import {View, Text, Image, Pressable} from 'react-native';
import React, {useContext} from 'react';
import styles from './styles';

import ThemeContext from '../../contexts/ThemeContext';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

// Components
import ActionSeperator from './ActionSeperator';

// Utils
import trimCommentText from '../../utils/trimCommentText';

const CommentItem = () => {
  const {Theme} = useContext(ThemeContext);

  const commentText =
    'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, totam! Quas, laudantium nam similique iure doloribus quam optio neque itaque fugiat adipisci dicta eius voluptatibus cupiditate hic porro beatae facilis, architecto amet quibusdam mollitia facere eum eveniet. Suscipit, odit ipsam fugiat, fuga sed accusantium voluptas laudantium dignissimos, officiis dolorem debitis.';

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={{uri: 'https://i.pravatar.cc/50'}}
          style={styles.avatar}
        />
        <View>
          <Text style={[styles.name, {color: Theme.PrimaryText}]}>
            This is the name
          </Text>
          <Text style={[styles.username, {color: Theme.SecondaryText}]}>
            @username
          </Text>
        </View>
      </View>

      <Pressable style={styles.commentCont}>
        <Text style={[styles.commentText, {color: Theme.SecondaryText}]}>
          {commentText.length > 250
            ? trimCommentText(commentText)
            : commentText}

          {commentText.length > 250 ? (
            <Text style={styles.viewMore}>View more</Text>
          ) : null}
        </Text>
      </Pressable>

      <View style={styles.actionsCont}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable>
            <AntDesign name="hearto" size={24} color={Theme.SecondaryText} />
          </Pressable>
          <Text style={[{color: Theme.SecondaryText}, styles.statText]}>
            12K
          </Text>
        </View>

        <ActionSeperator />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="back" size={24} color={Theme.SecondaryText} />
            <Text style={[{color: Theme.SecondaryText}, styles.statText]}>
              120 replies
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CommentItem;

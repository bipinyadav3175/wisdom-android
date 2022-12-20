import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useContext, useState, useRef, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
//
import DropDownPicker from 'react-native-dropdown-picker';

import EditorContext from '../../contexts/EditorContext';
//
import axios from 'axios';
import CONSTANTS from '../../../CONSTANTS';

import AuthContext from '../../contexts/AuthContext';
import ThemeContext from '../../contexts/ThemeContext';
import {CustomFonts, Spacing} from '../../../theme';
import {EditorContentType, EditorItemType} from '../../components/Editor';

const StoryDetails = () => {
  const {state, title, clear} = useContext(EditorContext);
  const {state: user} = useContext(AuthContext);
  const {Theme, type} = useContext(ThemeContext);

  const navigation = useNavigation();

  const [storyTitle, setStoryTitle] = useState(title);
  const [tags, setTags] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCat, setSelectedCat] = useState<null | string>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{value: string; label: string}[]>([]);

  const [btnDisabled, setBtnDisabled] = useState(true);

  const tagInput = useRef<TextInput>(null);

  useEffect(() => {
    if (!storyTitle?.trim() || !selectedCat) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
  }, [storyTitle, selectedCat]);

  const removeTag = (index: number) => {
    setTags(() => {
      return tags.filter((_, ind) => {
        return ind !== index;
      });
    });
  };

  const addTag = () => {
    if (!inputText.trim()) {
      return;
    }

    setTags(oldTags => {
      return [...oldTags, inputText];
    });

    setInputText('');
    tagInput.current?.focus();
  };

  const publish = async () => {
    // Publish the Story
    let storyData = state as EditorContentType;

    const storyMetaData = {
      title: storyTitle,
      tags: tags,
      category: selectedCat,
    };

    // Images
    var allImages: EditorContentType = [];

    state?.forEach(item => {
      if (item.type === 'IMG') {
        allImages.push(item);
      }
    });

    let lastElement = storyData[storyData?.length - 1];

    if (lastElement.type === 'P' && !lastElement.content) {
      // Remove the last element
      storyData.pop();
    }

    const data = new FormData();

    if (allImages.length > 0) {
      allImages.forEach(img => {
        data.append('postImages', {
          uri: img.url,
          type: img.imgType,
          name: img.imgName,
        });
      });
    }

    data.append('storyData', JSON.stringify(storyData));
    data.append('storyMetaData', JSON.stringify(storyMetaData));

    try {
      const res = await fetch(`${CONSTANTS.BACKEND_URI}/post`, {
        body: data,
        method: 'POST',
        headers: {
          Authorization: user.token as string,
        },
      });

      const resData = await res.json();

      console.log(resData);

      if (resData.success) {
        // @ts-ignore
        navigation.navigate('Home');
      }
    } catch (err) {
      console.log(err);
    }
    // else {
    //   // Send to the api endpoint
    //   try {
    //     const res = await axios.post(
    //       `${CONSTANTS.BACKEND_URI}/post`,
    //       {
    //         storyData,
    //         storyMetaData,
    //       },
    //       {
    //         headers: {
    //           Authorization: user.token as string,
    //         },
    //       },
    //     );

    //     const data = res.data;

    //     console.log(data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
  };

  useEffect(() => {
    async function init() {
      try {
        const res = await axios.get(`${CONSTANTS.BACKEND_URI}/categories`, {
          headers: {
            Authorization: user.token as string,
          },
        });

        const resData = res.data;
        if (resData.success) {
          setItems(resData.categories);
        }
      } catch (err) {
        console.log(err);
      }
    }

    init();
  }, []);

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.titleTitle, {color: Theme.PrimaryText}]}>
          Title
        </Text>
        <TextInput
          value={storyTitle as string}
          onChangeText={val => {
            setStoryTitle(val);
          }}
          placeholder="Title"
          placeholderTextColor={Theme.Placeholder}
          style={[
            styles.title,
            {color: Theme.PrimaryText, borderColor: Theme.Placeholder},
          ]}
          maxLength={120}
          multiline
        />

        <Text style={[styles.tagTitle, {color: Theme.PrimaryText}]}>
          Add tags
        </Text>

        <View style={styles.tagsCont}>
          {tags.map((tag, index) => {
            return (
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor:
                      type === 'dark' ? 'rgb(28,38,44)' : 'rgb(230, 230, 230)',
                  },
                ]}
                key={'tag-' + index}>
                <Text
                  style={[
                    styles.tagText,
                    {
                      color:
                        type === 'dark'
                          ? Theme.SecondaryText
                          : Theme.PrimaryText,
                    },
                  ]}>
                  {tag}
                </Text>
                <Pressable
                  style={[
                    styles.xCont,
                    {
                      backgroundColor:
                        type === 'dark'
                          ? 'rgb(15,25,33)'
                          : 'rgb(180, 180, 180)',
                    },
                  ]}
                  onPress={() => removeTag(index)}>
                  <AntDesign name="close" size={13} color={Theme.PrimaryText} />
                </Pressable>
              </View>
            );
          })}

          <View
            style={[
              styles.tagInputCont,
              {
                display: tags.length >= 10 ? 'none' : 'flex',
                backgroundColor:
                  type === 'dark' ? 'rgb(28,38,44)' : 'rgb(230, 230, 230)',
              },
            ]}>
            <TextInput
              ref={tagInput}
              value={inputText}
              style={[styles.tagInput, {color: Theme.SecondaryText}]}
              placeholder="add..."
              placeholderTextColor={Theme.Placeholder}
              onEndEditing={addTag}
              onChangeText={tex => setInputText(tex)}
            />
          </View>
        </View>

        <Text style={[styles.catTitle, {color: Theme.PrimaryText}]}>
          Choose a category
        </Text>

        <View style={styles.dropCont}>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            multiple={false}
            value={selectedCat}
            items={items}
            setItems={setItems}
            setValue={setSelectedCat}
            listMode="MODAL"
            modalTitle="Select a category"
            placeholder="Select a category"
            theme={type === 'dark' ? 'DARK' : 'LIGHT'}
            style={[
              styles.drop,
              {
                backgroundColor:
                  type === 'dark' ? 'rgb(28,38,44)' : 'rgb(230, 230, 230)',
              },
            ]}
            arrowIconStyle={{borderColor: Theme.SecondaryText}}
            textStyle={{color: Theme.PrimaryText}}
            modalContentContainerStyle={{
              backgroundColor: Theme.PrimaryBackground,
            }}
            modalTitleStyle={{color: Theme.PrimaryText}}
            placeholderStyle={{color: Theme.Placeholder}}
          />
        </View>

        <View style={styles.btnCont}>
          <Pressable
            onPress={publish}
            style={[
              styles.btn,
              {
                backgroundColor: btnDisabled ? Theme.Placeholder : '#5f27cd',
                opacity: !btnDisabled ? 1 : 0.7,
              },
            ]}
            disabled={btnDisabled}>
            <Text style={[styles.btnText]}>Publish</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Spacing.Padding.Normal,
  },
  title: {
    fontFamily: CustomFonts.SSP.Bold,
    fontSize: 22,
    paddingHorizontal: Spacing.Padding.Normal,
    borderWidth: 1,
    borderRadius: 7,
    marginHorizontal: Spacing.Margin.Normal,
    marginBottom: 40,
  },
  tagsCont: {
    paddingHorizontal: Spacing.Padding.Normal,
    paddingVertical: Spacing.Padding.Small,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tagTitle: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 16,
    marginBottom: 10,
    marginLeft: Spacing.Margin.Normal,
  },
  titleTitle: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 16,
    marginBottom: 10,
    marginLeft: Spacing.Margin.Normal,
  },
  catTitle: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 16,
    marginVertical: 10,
    marginLeft: Spacing.Margin.Normal,
  },
  tag: {
    paddingLeft: 10,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 13,
    marginBottom: 15,
  },
  tagInputCont: {
    paddingHorizontal: 10,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tagInput: {
    fontSize: 12,
    padding: 0,
    paddingHorizontal: 5,
  },
  tagText: {
    fontSize: 13,
    marginRight: 6,
  },
  xCont: {
    padding: 2,
    margin: 3,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  drop: {
    borderWidth: 0,
    elevation: 2,
  },
  dropCont: {
    paddingHorizontal: Spacing.Padding.Normal,
  },
  btnCont: {
    width: '100%',
    paddingHorizontal: Spacing.Padding.Normal,
    marginTop: 60,
  },
  btn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 7,
    backgroundColor: '#5f27cd',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: CustomFonts.SSP.Regular,
    fontSize: 20,
    color: '#fff',
  },
});

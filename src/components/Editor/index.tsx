import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import {nanoid} from 'nanoid';
import React, {useState, useEffect, useContext} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {launchImageLibrary} from 'react-native-image-picker';

import ThemeContext from '../../contexts/ThemeContext';
import {CustomFonts, Spacing} from '../../../theme';
//Input
import Input from './Input';
//Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

type EditorItemType = {
  type: string;
  markup: [] | null;
  // id: string;
  content: string | null;
  url: string | null;
  aspectRatio: number | null;
  imgType?: string;
  imgName?: string;
};

type EditorContentType = EditorItemType[];

type Action = {
  id: string;
  type: string;
} | null;

const Editor = ({
  action,
  editorData,
  onTitle,
}: {
  action: Action;
  editorData: (val: EditorContentType) => void;
  onTitle: (val: string) => void;
}) => {
  const {Theme, type} = useContext(ThemeContext);

  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState<EditorContentType>([
    {
      type: 'P',
      markup: null,
      content: '',
      url: null,
      aspectRatio: null,
    },
  ]);
  const [currentFocusedInput, setCurrentFocusedInput] = useState(0);
  const [selection, setSelection] = useState({start: 0, end: 0});

  useEffect(() => {
    onTitle(title);
  }, [title]);

  useEffect(() => {
    editorData(editorContent);
  }, [editorContent]);

  useEffect(() => {
    async function init() {
      if (!action) {
        return;
      }

      try {
        const result = await launchImageLibrary({mediaType: 'photo'});
        if (result.assets) {
          const imagePath = result.assets[0].uri;
          const imgType = result.assets[0].type;
          const imgName = result.assets[0].fileName;
          let width = result.assets[0].width as number;
          let height = result.assets[0].height as number;

          const aspectRatio = width / height;

          let eContent = Array.from(editorContent);
          let newEmptyImageIndex: EditorItemType = {
            type: 'IMG',
            aspectRatio: aspectRatio,
            content: '',
            markup: null,
            url: imagePath as string,
            imgType,
            imgName,
          };

          if (
            selection.end !== editorContent[currentFocusedInput].content?.length
          ) {
            let prevText = editorContent[currentFocusedInput].content?.slice(
              0,
              selection.end,
            ) as string;
            let newText = editorContent[currentFocusedInput].content?.slice(
              selection.end,
            );

            eContent[currentFocusedInput].content = prevText;
            console.log(eContent[currentFocusedInput].content);

            let newEmptyIndex: EditorItemType = {
              type: 'P',
              aspectRatio: null,
              content: newText as string,
              markup: null,
              url: null,
            };

            eContent.splice(currentFocusedInput + 1, 0, newEmptyImageIndex);
            eContent.splice(currentFocusedInput + 2, 0, newEmptyIndex);
          } else {
            let newEmptyIndex: EditorItemType = {
              type: 'P',
              aspectRatio: null,
              content: '',
              markup: null,
              url: null,
            };

            if (
              editorContent[currentFocusedInput].type === 'P' &&
              editorContent[currentFocusedInput].content?.length === 0
            ) {
              eContent.splice(currentFocusedInput, 1);
            }

            if (currentFocusedInput) {
              eContent.splice(currentFocusedInput + 1, 0, newEmptyImageIndex);
              eContent.splice(currentFocusedInput + 2, 0, newEmptyIndex);
            } else {
              eContent.push(newEmptyImageIndex);
              eContent.push(newEmptyIndex);
            }
          }

          setEditorContent(eContent);
        }
      } catch (err) {
        console.log(err);
      }
    }
    init();
  }, [action]);

  // Creating a text input after a image is added
  // useEffect(()=> {

  //   if(editorContent[editorContent.length - 1].type !== ("P" || "H")){
  //     let newEmptyIndex: EditorItemType = {
  //       type : "P",
  //       aspectRatio: null,
  //       content: '',
  //       id: "ddgfhdregrfrghdf",
  //       key: "gwtefes 3",
  //       markup: null,
  //       url: null
  //     }

  //     setEditorContent((prev)=> {
  //       return [...prev, newEmptyIndex]
  //     })
  //   }

  //   if(editorContent.length > 1){
  //     if(editorContent[editorContent.length - 1].type === ("P" || "H") && editorContent[editorContent.length - 2].type !== ("P" || "H"))
  //   {
  //     setEditorContent((prev)=> {
  //       return prev.filter((_, index)=> index !== (editorContent.length - 1))
  //     })
  //   }
  //   }

  // }, [editorContent])

  return (
    <View style={[styles.container]}>
      <TextInput
        maxLength={120}
        multiline
        value={title}
        onChangeText={val => setTitle(val)}
        placeholder="Title"
        placeholderTextColor={Theme.Placeholder}
        style={{
          fontFamily: CustomFonts.Ubuntu.Regular,
          fontSize: 22,
          color: Theme.PrimaryText,
          paddingHorizontal: Spacing.Padding.Normal,
        }}
        onSubmitEditing={() => {
          setTitle(title.trimEnd());
        }}
      />

      {editorContent.map((item, index) => {
        if (item.type === 'P') {
          return (
            <Input
              type={type}
              Theme={Theme}
              index={index}
              onChangeText={val => {
                let eContent = Array.from(editorContent);
                eContent[index].content = val;

                setEditorContent(eContent);
              }}
              key={'textInput-' + index}
              value={editorContent[index].content as string}
              onFocus={() => {
                setCurrentFocusedInput(index);
              }}
              onSelectionChange={val => {
                setSelection(val);
              }}
              editorData={editorContent}
              onPressDelete={indexToDelete => {
                setEditorContent(prev => {
                  return prev.filter((_, index) => index !== indexToDelete);
                });
              }}
            />
          );
        }

        if (item.type === 'IMG') {
          return (
            <View
              key={'image-' + index}
              style={{
                marginHorizontal: Spacing.Margin.Normal,
                marginVertical: Spacing.Margin.Small,
                alignSelf: 'center',
                position: 'relative',
              }}>
              {/* Image itself */}
              <Image
                source={{uri: item.url as string}}
                style={{aspectRatio: item.aspectRatio as number, width: '100%'}}
                resizeMode="contain"
              />

              {/* For removing the image */}
              <Pressable
                style={{
                  position: 'absolute',
                  top: Spacing.Padding.Small,
                  right: Spacing.Padding.Small,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                  backgroundColor:
                    type === 'dark'
                      ? 'rgba(5, 5, 5, 0.7)'
                      : 'rgba(233, 233, 233, 0.7)',
                  borderRadius: 50,
                  overflow: 'hidden',
                }}
                // android_ripple={{ color: Theme.RippleColor, borderless: true}}
                onPress={() => {
                  // If there is any text above or below the image then concatinate it

                  if (
                    editorContent[index - 1] &&
                    editorContent[index - 1].type === ('P' || 'H') &&
                    editorContent[index + 1] &&
                    editorContent[index + 1].type === ('P' || 'H')
                  ) {
                    let afterText = editorContent[index + 1].content;

                    let dummyContent = Array.from(editorContent);

                    dummyContent[index - 1].content =
                      dummyContent[index - 1].content + ' ' + afterText;

                    dummyContent = dummyContent.filter(
                      (_, afterIndex) => afterIndex !== index + 1,
                    );

                    setEditorContent(dummyContent);
                  }

                  setEditorContent(prev => {
                    return prev.filter((_, prevIndex) => prevIndex !== index);
                  });
                }}>
                <AntDesign name="close" size={20} color={Theme.SecondaryText} />
              </Pressable>
            </View>
          );
        }
      })}
    </View>
  );
};

export default Editor;
export type {EditorContentType, EditorItemType};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // marginTop: 50
  },
});

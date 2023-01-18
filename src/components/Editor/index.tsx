import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {nanoid} from 'nanoid';
import React, {useState, useEffect, useContext, useRef} from 'react';
// import Clipboard from '@react-native-clipboard/clipboard';
import {launchImageLibrary} from 'react-native-image-picker';

import ThemeContext from '../../contexts/ThemeContext';
import {CustomFonts, Spacing} from '../../../theme';
//Input
import Input from './Input';
//Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {handleMarkup, handleSection, refreshMarkup} from './utils';
import Heading from './Input/Heading';

type EditorItemType = {
  type: string;
  // id: string;
  markup:
    | {
        type: string;
        start: number;
        end: number;
      }[]
    | null;
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
  scrollRef,
  action,
  editorData,
  onTitle,
}: {
  scrollRef: React.RefObject<KeyboardAwareScrollView>;
  action: Action;
  editorData: (val: EditorContentType) => void;
  onTitle: (val: string) => void;
}) => {
  const {Theme, type} = useContext(ThemeContext);

  const allRefs = useRef([]);

  const [title, setTitle] = useState('');
  const titleRef = useRef<TextInput>(null);
  const [editorContent, setEditorContent] = useState<EditorContentType>([
    {
      type: 'P',
      content: '',
      markup: [],
      url: null,
      aspectRatio: null,
    },
  ]);
  const [currentFocusedInput, setCurrentFocusedInput] = useState(0);
  const [forceFocus, setForceFocus] = useState<number | null>(null);
  const [selection, setSelection] = useState({start: 0, end: 0});

  useEffect(() => {
    onTitle(title);
  }, [title]);

  useEffect(() => {
    console.log(allRefs);
  }, [allRefs.current]);

  useEffect(() => {
    editorData(editorContent);
  }, [editorContent]);

  useEffect(() => {
    async function init() {
      if (!action) {
        return;
      }
      console.log('action', action.type);
      if (action.type !== 'IMAGE') return;

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
            markup: null,
            content: null,
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
              markup: [],
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
              if (eContent[currentFocusedInput + 2].type === ('P' || 'H!')) {
                eContent.splice(currentFocusedInput + 2, 0, newEmptyIndex);
              }
            } else {
              eContent.push(newEmptyImageIndex);
              eContent.push(newEmptyIndex);
            }
          }

          setEditorContent(eContent);
          scrollRef.current?.scrollToEnd();
        }
      } catch (err) {
        console.log(err);
      }
    }
    init();
  }, [action]);

  useEffect(() => {
    if (
      action?.type === 'BOLD' ||
      action?.type === 'ITALIC' ||
      action?.type === 'UNDERLINE'
    ) {
      const newDat = handleMarkup(editorContent, {
        markupType: action.type,
        selection,
        focusedIndex: currentFocusedInput,
      });
      setEditorContent(newDat);
    }

    if (action?.type === 'H1') {
      const {data: newData, addedNew} = handleSection(editorContent, {
        sectionType: 'H1',
        focusedInput: currentFocusedInput,
        selection,
      });

      if (addedNew) {
        setForceFocus(currentFocusedInput + 1);
      } else {
        setForceFocus(currentFocusedInput);
      }

      setEditorContent(newData);
    }
  }, [action]);

  // Creating a text input after a image is added
  // useEffect(()=> {

  //   if(editorContent[editorContent.length - 1].type !== ("P" || "H")){
  //     let newEmptyIndex: EditorItemType = {
  //       type : "P",
  //       aspectRatio: null,
  //       content: '',

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
        underlineColorAndroid="transparent"
        ref={titleRef}
        onBlur={() => {
          setForceFocus(0);
        }}
        maxLength={120}
        multiline
        value={title}
        onChangeText={val => setTitle(val.replace('\n', ''))}
        placeholder="Title"
        placeholderTextColor={Theme.Placeholder}
        style={{
          fontFamily: CustomFonts.SSP.SemiBold,
          fontSize: 26,
          color: Theme.PrimaryText,
          paddingHorizontal: Spacing.Padding.Normal,
        }}
        onSubmitEditing={() => {
          setTitle(title.trimEnd());
          titleRef.current?.blur();
        }}
      />

      {editorContent.map((item, index) => {
        if (item.type === 'P') {
          return (
            <Input
              forceFocus={forceFocus}
              type={type}
              Theme={Theme}
              index={index}
              onChangeText={val => {
                let eContent = Array.from(editorContent);

                const diff =
                  val.length - (editorContent[index].content?.length || 0);

                eContent[index].content = val;
                // setEditorContent(eContent);

                eContent = refreshMarkup(eContent, {
                  selection,
                  focusedIndex: index,
                  difference: diff,
                });
                setEditorContent(eContent);
              }}
              key={'textInput-' + index}
              value={editorContent[index]}
              onFocus={() => {
                setCurrentFocusedInput(index);
              }}
              onSelectionChange={val => {
                setSelection(val);
              }}
              onBackspaceWithNoText={() => {
                let eContent = Array.from(editorContent);
                if (
                  editorContent[index - 1] &&
                  editorContent[index - 1].type !== 'IMG'
                ) {
                  eContent.splice(index, 1);
                  setForceFocus(index - 1);
                }

                if (
                  editorContent[index - 1] &&
                  editorContent[index - 1].type === 'IMG' &&
                  editorContent[index + 1]
                ) {
                  eContent.splice(index, 1);
                  setForceFocus(index + 1);
                }

                setEditorContent(eContent);
              }}
              editorData={editorContent}
              onPressDelete={indexToDelete => {
                setEditorContent(prev => {
                  return prev.filter((_, index) => index !== indexToDelete);
                });
              }}
              // onDoubleEnter={() => {
              //   let i = currentFocusedInput;

              //   let eContent = Array.from(editorContent);
              //   let currentText = eContent[index].content;
              //   eContent[index].content = currentText?.slice(
              //     0,
              //     currentText.length - 1,
              //   ) as string;

              //   setEditorContent(eContent);
              // }}
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
                style={{
                  aspectRatio: item.aspectRatio as number,
                  width: '100%',
                  borderRadius: 13,
                }}
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
                    let afterMarkup = editorContent[index + 1].markup;
                    let beforeMarkup = editorContent[index - 1].markup;

                    let dummyContent = Array.from(editorContent);

                    for (let i = 0; i < afterMarkup?.length; i++) {
                      const currentStart = afterMarkup[i].start;
                      const currentEnd = afterMarkup[i].end;
                      const additionalLength =
                        dummyContent[index - 1].content?.length + 1;

                      afterMarkup[i] = {
                        type: afterMarkup[i].type,
                        start: currentStart + additionalLength,
                        end: currentEnd + additionalLength,
                      };
                    }

                    let totalMarkup = beforeMarkup?.concat(afterMarkup);
                    totalMarkup?.sort((a, b) => a.start - b.start);

                    dummyContent[index - 1].content =
                      dummyContent[index - 1].content + ' ' + afterText;

                    dummyContent[index - 1].markup = totalMarkup;

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

        if (item.type === 'H1') {
          return (
            <Heading
              forceFocus={forceFocus}
              type={type}
              Theme={Theme}
              index={index}
              placeholder="Heading"
              onChangeText={val => {
                let eContent = Array.from(editorContent);
                eContent[index].content = val;

                if (val.length < 2) {
                  setEditorContent(eContent);
                  return;
                }

                let lastCharacter = val[val.length - 1];
                let secondLastCharacter = val[val.length - 2];
                if (
                  lastCharacter.match(/\n/g) &&
                  secondLastCharacter.match(/\n/g)
                ) {
                  // eContent.splice(index + 1, 0, {
                  //   aspectRatio: null,
                  //   content: '',
                  //   markup: [],
                  //   type: 'P',
                  //   url: null,
                  //   imgName: undefined,
                  //   imgType: undefined,
                  // });
                  // // On Double enter
                  // setForceFocus(index + 1);
                }

                setEditorContent(eContent);
              }}
              key={'textInput-' + index}
              value={editorContent[index]}
              onFocus={() => {
                setCurrentFocusedInput(index);
              }}
              onSelectionChange={val => {
                setSelection(val);
              }}
              onEnter={() => {
                let eContent = Array.from(editorContent);
                // let c = eContent[index].content;
                // eContent.splice(index, 1, {
                //   aspectRatio: null,
                //   content: c?.replace('\n', '') as string,
                //   markup: null,
                //   type: 'H1',
                //   url: null,
                //   imgName: undefined,
                //   imgType: undefined,
                // });

                eContent.splice(index + 1, 0, {
                  aspectRatio: null,
                  content: '',
                  markup: [],
                  type: 'P',
                  url: null,
                  imgName: undefined,
                  imgType: undefined,
                });

                setEditorContent(eContent);

                // On Single Enter
                setForceFocus(index + 1);
              }}
              onBackspaceWithNoText={() => {
                const {data: newData} = handleSection(editorContent, {
                  sectionType: 'H1',
                  focusedInput: currentFocusedInput,
                  selection,
                });

                setEditorContent(newData);
              }}
            />
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

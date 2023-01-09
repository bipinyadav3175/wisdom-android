import React from 'react';
import {Dimensions} from 'react-native';
import Toast, {
  BaseToast,
  ErrorToast,
  ToastProps,
} from 'react-native-toast-message';
//
import {Spacing} from '../theme';
// Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

const deviceWidth = Dimensions.get('window').width;

const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderWidth: 0,
        borderRadius: 7,
        borderLeftWidth: 0,
        width: deviceWidth - Spacing.Margin.Small * 2,
        backgroundColor: '#000000',
      }}
      text1Style={{
        color: 'rgb(250, 250, 250)',
        fontSize: 15,
        fontWeight: 'normal',
      }}
      text2Style={{
        color: 'rgba(250, 250, 250, 0.5)',
        fontSize: 13,
      }}
      renderLeadingIcon={() => (
        <AntDesign
          name="checkcircleo"
          size={24}
          color="rgb(250, 250, 250)"
          style={{
            alignSelf: 'center',
            marginLeft: Spacing.Margin.Large,
            marginRight: 0,
          }}
        />
      )}
    />
  ),

  error: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderWidth: 0,
        borderRadius: 7,
        borderLeftWidth: 0,
        width: deviceWidth - Spacing.Margin.Small * 2,
        backgroundColor: '#000000',
      }}
      text1Style={{
        color: 'rgb(250, 250, 250)',
        fontSize: 15,
        fontWeight: 'normal',
      }}
      text2Style={{
        color: 'rgba(250, 250, 250, 0.5)',
        fontSize: 13,
      }}
      renderLeadingIcon={() => (
        <AntDesign
          name="closecircleo"
          size={24}
          color="rgb(250, 250, 250)"
          style={{
            alignSelf: 'center',
            marginLeft: Spacing.Margin.Large,
            marginRight: 0,
          }}
        />
      )}
    />
  ),

  info: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderWidth: 0,
        borderRadius: 7,
        borderLeftWidth: 0,
        width: deviceWidth - Spacing.Margin.Small * 2,
        backgroundColor: '#000000',
      }}
      text1Style={{
        color: 'rgb(250, 250, 250)',
        fontSize: 15,
        fontWeight: 'normal',
      }}
      text2Style={{
        color: 'rgba(250, 250, 250, 0.5)',
        fontSize: 13,
      }}
      renderLeadingIcon={() => (
        <AntDesign
          name="infocirlceo"
          size={24}
          color="rgb(250, 250, 250)"
          style={{
            alignSelf: 'center',
            marginLeft: Spacing.Margin.Large,
            marginRight: 0,
          }}
        />
      )}
    />
  ),
};

export default toastConfig;

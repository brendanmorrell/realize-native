import React from 'react'
import Toast, { ToastShowParams } from 'react-native-toast-message'

export function useToasts() {
  return React.useRef({
    setSuccessToast: (text1: ToastShowParams['text1'] = 'Success', params?: ToastShowParams) =>
      Toast.show({
        type: 'success',
        text1,
        ...params,
      }),
    setErrorToast: (text1: ToastShowParams['text1'] = 'Error', params?: ToastShowParams) =>
      Toast.show({
        type: 'error',
        text1,
        ...params,
      }),
  }).current
}

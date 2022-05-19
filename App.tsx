/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

const TEST_WEB_URL = 'https://rnw.vercel.app';

const createBridgeMessage = (type: string, data: any) => {
  const message = {
    type,
    data,
  };
  return JSON.stringify(message);
};

const App = () => {
  const webViewRef = useRef<WebView>(null);
  const [text, setText] = useState('Hello, world!');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleChangeText = (value: string) => {
    setText(value);
  };

  const handleOnMessage = (event: WebViewMessageEvent) => {
    const {data} = event.nativeEvent;
    Alert.alert('Received', '' + data);
  };

  const handlePressButton = () => {
    // App -> Web
    webViewRef.current?.injectJavaScript(`
      void (function () {
        if (!(window.client && typeof window.client.postMessage === 'function')) {
          alert('No bridge module found');
          return;
        };
        window.client.postMessage(${createBridgeMessage('onMessage', text)});
        window.injected = (window.injected || 0) + 1;
      })();
    `);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <WebView
        ref={webViewRef}
        onMessage={handleOnMessage}
        source={{
          uri: TEST_WEB_URL,
        }}
      />
      <View style={styles.bottomBar}>
        <View>
          <TextInput onChangeText={handleChangeText} />
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={handlePressButton}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textInput: {
    color: 'white',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 10,
    backgroundColor: 'gray',
  },
});

export default App;

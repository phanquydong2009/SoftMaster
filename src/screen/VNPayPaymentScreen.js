import React from 'react';
import {Text, View} from 'react-native';
import {WebView} from 'react-native-webview';

const VNPayPaymentScreen = () => {
  return (
    <View style={{flex: 1}}>
      <Text>Hmmm</Text>

      <WebView
        source={{
          uri: 'https://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder',
        }}
        style={{flex: 1, height: 300, borderWidth: 1, borderColor: 'red'}}
      />
    </View>
  );
};

export default VNPayPaymentScreen;

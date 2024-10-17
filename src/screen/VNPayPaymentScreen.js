import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Alert, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';

const VNPayPaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {paymentUrl} = route.params;

  const handleUpdateStatus = async ({paymentId, status}) => {
    try {
      await fetch('http://localhost:3001/payment/update-payment-status', {
        method: 'POST',
        body: JSON.stringify({
          paymentId,
          status,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      Alert.alert('Không thể cập nhật trạng thái thanh toán');
    }
  };

  const onNavigationStateChange = async data => {
    if (data.loading) {
      return;
    }

    const url = data.url;
    const regex = /(?<=&vnp_TransactionStatus=)\d+(?=&vnp_TxnRef)/;
    const match = url.match(regex);

    if (!match) {
      return;
    }

    const paymentIdReg =
      /(?<=vnp_TxnRef=SOFTMASTER_)[a-f0-9]+(?=&vnp_SecureHash)/;
    const matchPaymentId = url.match(paymentIdReg);
    const paymentId = matchPaymentId[0];

    const responseCode = match[0];
    if (responseCode === '00') {
      Alert.alert('Thanh toán thành công');
      await handleUpdateStatus({paymentId, status: 'SUCCESS'});
    } else {
      Alert.alert('Thanh toán thất bại');
      await handleUpdateStatus({paymentId, status: 'FAILED'});
    }

    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        source={{
          uri: paymentUrl,
        }}
        style={{flex: 1, height: 300, borderWidth: 1, borderColor: 'red'}}
        onNavigationStateChange={onNavigationStateChange}
      />
    </View>
  );
};

export default VNPayPaymentScreen;

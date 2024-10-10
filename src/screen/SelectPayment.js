import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
const SelectPayment = () => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={myStyles.container}>
      {/* View Header */}
      <View style={myStyles.viewHeader}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={require('../design/image/ic_back.png')} />
        </TouchableOpacity>
        <Text style={myStyles.viewTextHeader}>Phương thức thanh toán</Text>
      </View>
      {/* Content */}
      <View style={myStyles.contentContainer}>
        <Text style={myStyles.contentText}>Chọn phương thức thanh toán</Text>
      </View>
      {/* Chọn phương thức thanh toán */}
      <View style={myStyles.paymentContainer}>
        <TouchableOpacity style={myStyles.paymentButton}>
          <Image
            source={require('../design/image/icon_visa.png')}
            style={myStyles.paymentImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={myStyles.paymentButton}>
          <Image
            source={require('../design/image/icon_paypal.png')}
            style={myStyles.paymentImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={myStyles.paymentButton}>
          <Image
            source={require('../design/image/icon_momo.png')}
            style={myStyles.paymentImage}
          />
        </TouchableOpacity>
      </View>
      {/* Bank trực tiêps */}
      <View style={myStyles.contentContainer2}>
        <Text style={myStyles.contentText2}>Chuyển khoản trực tiếp</Text>
      </View>
      {/* Qr CODE */}
      <View style={myStyles.qrCodeContainer}>
        <View style={myStyles.qrInfo}>
          <Image source={require('../design/image/qr.png')} style={myStyles.qrImage} />
          <Text style={myStyles.qrText}>SoftMaster SoftWare</Text>
        </View>
        <View style={myStyles.accountInfo}>
          <Text style={myStyles.infoLabel}>Số tài khoản</Text>
          <Text style={myStyles.infoValue}>7979797904</Text>
        </View>
        <View style={myStyles.contentInfo}>
          <Text style={myStyles.infoLabel}>Nội dung CK</Text>
          <Text style={myStyles.infoValue}>customerID</Text>
        </View>
        <View style={myStyles.paymentInfo}>
          <View style={myStyles.paymentRow}>
            <Text style={myStyles.infoLabel1}>Tổng thanh toán</Text>
            <Text style={myStyles.totalAmount}>689.000 VNĐ</Text>
          </View>
          <Text style={myStyles.period}>3 Tháng</Text>
        </View>
      </View>
      {/* Button Tiếp Tục Thanh Toán */}
      <View style={myStyles.containerButton}>
        <View style={myStyles.buttonContainer}>
          <TouchableOpacity style={myStyles.button}>
            <Text style={myStyles.buttonText}>Xác nhận thanh toán</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectPayment;

const myStyles = StyleSheet.create({
  containerButton: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  buttonContainer: {
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#0961F5',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 4,
  },

  buttonText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontFamily: 'Mulish-ExtraBold',
    textAlign: 'center',
    lineHeight: 24,
  },
  qrCodeContainer: {
    marginTop: 53,
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrImage: {
    width: 150,
    height: 150,
  },
  qrText: {
    fontSize: 20,
    fontFamily: 'Mulish-ExtraBold',
    color: '#0961F5',
    marginTop: 12,
  },
  accountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentInfo: {
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel1: {
    fontSize: 16,
    fontFamily: 'Mulish-ExtraBold',
    color: '#0B1875',
  },
  infoLabel: {
    fontSize: 18,
    fontFamily: 'Mulish-ExtraBold',
    color: '#0961F5',
  },
  infoValue: {
    fontSize: 18,
    fontFamily: 'Mulish-ExtraBold',
    color: '#0961F5',
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'Mulish-ExtraBold',
    color: '#0B1875',
    textAlign: 'right',
  },
  period: {
    fontSize: 14,
    fontFamily: 'Mulish-ExtraBold',
    color: '#13248D',
    textAlign: 'right',

    right: 30,
  },
  contentContainer2: {
    marginTop: 37,
  },
  contentText2: {
    fontSize: 20,
    fontFamily: 'Mulish-ExtraBold',
    color: '#0B1875',
    lineHeight: 26,
  },
  contentContainer: {
    marginTop: 28,
  },
  contentText: {
    fontSize: 20,
    fontFamily: 'Mulish-ExtraBold',
    color: '#0B1875',
    lineHeight: 26,
  },
  paymentContainer: {
    marginTop: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(37, 37, 28, 0.30)',
    width: 96,
    height: 60,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTextHeader: {
    color: '#191B28',
    fontSize: 20,
    fontFamily: 'Mulish-ExtraBold',
    textAlign: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
   padding : 25,
    backgroundColor: '#FFFFFF',
  },
});

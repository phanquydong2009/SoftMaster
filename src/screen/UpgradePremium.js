import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
const UpgradePremium = () => {
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
        <Text style={myStyles.viewTextHeader}>Nâng cấp Premium</Text>
      </View>
      {/* Content */}
      <View style={myStyles.content}>
        <Text style={myStyles.contentText}>
          Bộ dành cho mọi cá nhân và người mới bắt đầu muốn bắt đầu với một
          phương pháp học tập mới.
        </Text>
      </View>
      {/* Gói Premium */}
      <View style={myStyles.premiumContainer}>
        <View style={myStyles.premiumRow}>
          <TouchableOpacity style={myStyles.premiumOption}>
            <Text style={myStyles.premiumText}>30 Ngày</Text>
            <View style={myStyles.priceContainer}>
              <Text style={myStyles.priceText}>249.000</Text>
              <Text style={myStyles.currencyText}>VND</Text>
            </View>
            <View style={myStyles.imageWrapper}>
              <Image
                source={require('../design/image/icon_pre1.png')}
                style={myStyles.premiumImage}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={myStyles.premiumOption}>
            <Text style={myStyles.premiumText}>3 Tháng</Text>
            <View style={myStyles.priceContainer}>
              <Text style={myStyles.priceText}>689.000</Text>
              <Text style={myStyles.currencyText}>VND</Text>
            </View>
            <View style={myStyles.imageWrapper}>
              <Image
                source={require('../design/image/icon_pre2.png')}
                style={myStyles.premiumImage}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={myStyles.premiumRow}>
          <TouchableOpacity style={myStyles.premiumOption}>
            <Text style={myStyles.premiumText}>1 Năm</Text>
            <View style={myStyles.priceContainer}>
              <Text style={myStyles.priceText}>1.290.000 VND</Text>
            </View>
            <View style={myStyles.imageWrapper}>
              <Image
                source={require('../design/image/icon_pre3.png')}
                style={myStyles.premiumImage}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Button Tiếp Tục */}
      <View style={myStyles.buttonContainer}>
        <TouchableOpacity style={myStyles.button} onPress={() => navigation.navigate('SelectPayment')}>
          <Text style={myStyles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpgradePremium;

const myStyles = StyleSheet.create({
  buttonContainer: {
    marginTop: 110,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom : 20
  },
  button: {
    backgroundColor: '#0961F5',
    borderRadius: 16,

   
 width : '100%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
   
    elevation: 4,
  },
  buttonText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontFamily: 'Mulish',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
  premiumContainer: {
    marginTop: 88,
  },
  premiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical :15
  },
  premiumOption: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#A3A4A9',
    width: 175,
    height: 150,
    flexShrink: 0,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'absolute',
    top: -25,
    right: 10,
  },
  premiumImage: {
    width: 50,
    height: 50,
  },
  premiumText: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Mulish',
    color: '#1F36AF',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Mulish',
    color: '#1F36AF',
    textAlign: 'center',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  currencyText: {
    marginLeft: 5,
    fontSize: 18,
    fontFamily:'Mulish-Bold',
    color: '#1F36AF',
    textAlign: 'center',
  },
  content: {
    marginTop: 32,
  },
  contentText: {
    fontSize: 20,
    color: '#000',
    fontFamily:'Mulish-Bold',
    textAlign: 'center',
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent :"center"
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
   padding : 20,
    backgroundColor: '#FFFFFF',
  },
});

// src/screen/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  // Khai báo các giá trị Animated
  const logoAnim = useRef(new Animated.Value(0)).current;
  const txtNameAnim = useRef(new Animated.Value(0)).current;
  const txtTitleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Chạy animation cho logo
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(txtNameAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(txtTitleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Chờ 2 giây sau khi animation kết thúc
      setTimeout(() => {
        navigation.navigate('Welcome');
      }, 2000);
    });
  }, [logoAnim, txtNameAnim, txtTitleAnim, navigation]);

  // Định nghĩa các animated style
  const animatedLogoStyle = {
    transform: [
      {
        scale: logoAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  const animatedTxtNameStyle = {
    opacity: txtNameAnim,
    transform: [
      {
        translateY: txtNameAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const animatedTxtTitleStyle = {
    opacity: txtTitleAnim,
    transform: [
      {
        translateY: txtTitleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.Image source={require('../design/image/robot1.png')} style={[styles.logo, animatedLogoStyle]} />
      <Animated.Text style={[styles.txtname, animatedTxtNameStyle]}>SoftMaster</Animated.Text>
      <Animated.Text style={[styles.txttitle, animatedTxtTitleStyle]}>Kỹ Năng Mềm Toàn Diện</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor :"#FFFFF",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 360,
    height: 370,
  },
  txtname: {
    fontSize: 50,
    color: "#13248D",
    fontFamily: 'Mulish-ExtraBold',
  },
  txttitle: {
    fontSize: 26,
    fontFamily: 'Mulish-Bold',
    color: "#13248D",
  },
});

export default SplashScreen;
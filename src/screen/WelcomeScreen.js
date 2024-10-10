// src/screen/WelcomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const [step, setStep] = useState(0);
  const navigation = useNavigation();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      navigation.navigate('SignUpOrSignIn');
    }
  };
  const handleLogin = ()=>{
    navigation.navigate('SignIn');
  }

  const imageSource = step === 0 ? require('../design/image/welcome1.png') : require('../design/image/welcome2.png');
  const txtHeader = step === 0 ? "Chuẩn bị học tập với sự tự tin" : (step === 1 ? "Học với các bài giảng trực tuyến tốt nhất hiện nay." : "Dễ dàng liên lạc với Giảng viên");
  const txtContent = step === 0 ? "Tham gia các khóa học để không ngừng rèn luyện và phát triển kỹ năng, giúp bạn trở nên tự tin hơn trong mọi lĩnh vực của cuộc sống." : (step === 1 ? "Xem video bài giảng, học tập, làm bài kiểm tra. Đào tạo mỗi ngày và nhận đánh giá từ SoftMaster." : "Gửi tin nhắn trực tiếp cho giảng viên để nhận thông tin chi tiết và cập nhật mới nhất về bài học của bạn.");
  const dotActiveIndex = step === 0 ? 0 : (step === 1 ? 1 : 2);
  const btnText = step === 2 ? "Bắt đầu" : "Tiếp tục";

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.text_container}>
        <Text style={styles.txt_header}>{txtHeader}</Text>
        <Text style={styles.txt}>{txtContent}</Text>
      </View>
      <View style={styles.dot_container}>
        <View style={[styles.dot, dotActiveIndex === 0 && styles.dot_active]}></View>
        <View style={[styles.dot, dotActiveIndex === 1 && styles.dot_active]}></View>
        <View style={[styles.dot, dotActiveIndex === 2 && styles.dot_active]}></View>
      </View>
      <View style={styles.btn_container}>
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.txtbtn}>{btnText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.txtFooter1}> Đã có tài khoản? </Text>
        <Text style={styles.txtFooter2} onPress={handleLogin}> Đăng nhập</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor :"#FFFFF",
    padding: 15,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginTop: 70,
  },
  text_container: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_header: {
    fontSize: 20,
    color: '#191B28',
    fontFamily: "Mulish-ExtraBold",
    alignItems: "center",
    textAlign: "center"
  },
  txt: {
    marginTop: 40,
    fontSize: 16,
    color: '#191B28',
    fontFamily: "Mulish-Regular",
    textAlign: 'center',
  },
  dot_container: {
    flexDirection: 'row',
    marginTop: 80,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#979797',
    marginHorizontal: 5,
  },
  dot_active: {
    backgroundColor: '#41484F',
  },
  btn_container: {
    marginTop: 50,
    width: '100%'
  },
  btn: {
    backgroundColor: "#0961F5",
    width: '100%',
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  txtbtn: {
    color: "#F9FAFB",
    fontFamily: "Mulish-ExtraBold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 20
  },
  txtFooter1: {
    color: "#0A0C2C",
    fontFamily: "Mulish-Regular",
    fontSize: 16
  },
  txtFooter2: {
    color: "#3E63F4",
    fontFamily: "Mulish-Regular",
    fontSize: 16
  }
});

export default WelcomeScreen;

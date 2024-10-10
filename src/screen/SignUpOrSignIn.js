import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUpOrSignIn = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../design/image/robot1.png')} style={styles.imgLogo} />
      <View style={styles.txt_container}>
        <Text style={styles.txt}> Bạn chưa có tài khoản? Đăng kí ngay bây giờ</Text>
        <Text style={styles.txt}> Đã có tài khoản? Đăng nhập để tiếp tục.</Text>
      </View>
      <View style={styles.btn_container}>
        <TouchableOpacity style={styles.btnSignUp} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.txtSignUp}> Đăng Ký</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSignIn} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.txtSignIn}> Đăng Nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpOrSignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor :"#FFFFF",
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  imgLogo: {
    width: 320,
    height: 320,
  },
  txt_container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 80,
  },
  txt: {
    fontSize: 15,
    fontFamily: 'Mulish-ExtraBold',
    color: '#13248D',
    textAlign: 'center',
  },
  btn_container: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  btnSignUp: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 20,
    height: 48,
    borderRadius: 13,
    // Bóng đổ cho Android
    elevation: 5,
  },
  btnSignIn :{
    backgroundColor : "#0961F5",
    alignItems :"center",
    justifyContent :"center",
    flex : 1,
    marginLeft : 20,
    height :48,
    borderRadius : 13,
     // Bóng đổ cho Android
     elevation: 5,
  },
  txtSignUp : {
    color : 'black',
    fontFamily: 'Mulish-ExtraBold',
  },
  txtSignIn : {
    color : 'white',
    fontFamily: 'Mulish-ExtraBold', 
  }
});

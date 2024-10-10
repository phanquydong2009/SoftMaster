import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleSignIn = () => {
        navigation.navigate('SignIn');
    };

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    const handleOtpVerification = async () => {
        if (!email) {
            setError('Vui lòng nhập đủ thông tin');
        } else if (!/\S+@gmail\.com$/.test(email)) {
            setError('Email không đúng định dạng');
        } else {
            try {
                setError('');
                // Gọi API kiểm tra email
                const response = await fetch('http://192.168.1.4:3001/user/getAll', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                const result = await response.json();
                const user = result.find(user => user.email === email);
    
                if (user) {
                    // Gửi mã OTP về email
                    const otpResponse = await fetch('http://192.168.1.4:3001/user/forgot-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });
    
                    if (otpResponse.ok) {
                        const otpData = await otpResponse.json(); // Nhận dữ liệu phản hồi
                        navigation.navigate('OtpForgetPassWord', { email, _id: user._id }); // Chuyển sang màn OtpForgetPassWord
                    } else {
                        const otpError = await otpResponse.json();
                        setError(otpError.message || 'Có lỗi xảy ra khi gửi mã OTP');
                    }
                } else {
                    setError('Email không tồn tại');
                }
            } catch (error) {
                console.error('Lỗi kết nối:', error);
                setError('Không thể kết nối đến máy chủ');
            }
        }
    };
    
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Image source={require("../design/image/ic_back.png")} style={styles.imgBack} />
                </TouchableOpacity>
                <Text style={styles.txtHeader}>Đổi Mật Khẩu</Text>
            </View>
            <View style={styles.imgContainer}>
                <Image source={require('../design/image/robot1.png')} style={styles.img} />
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Địa chỉ Email</Text>
                <View style={[
                    styles.inputContainer,
                    { borderColor: error ? 'red' : isFocused ? 'black' : '#000' }
                ]}>
                    <Image source={require('../design/image/ic_email.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập Email"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : <View style={styles.line}></View>}
            </View>
            <View style={styles.checkContainer}>
                <TouchableOpacity onPress={handleSignIn}>
                    <Text style={styles.txtSignIn}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.txtSignUp}>Đăng kí</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnLogin} onPress={handleOtpVerification}>
                <Text style={styles.txtLogin}>Xác thực OTP</Text>
            </TouchableOpacity>
            <View style={styles.orContainer}>
                <View style={styles.lineOr}></View>
                <Text style={styles.txtOr}>Hoặc</Text>
                <View style={styles.lineOr}></View>
            </View>
            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.googleButton}>
                    <Image source={require('../design/image/ic_google.png')} style={styles.socialIcon} />
                    <Text style={styles.socialTextGG}>GOOGLE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.facebookButton}>
                    <Image source={require('../design/image/ic_facebook.png')} style={styles.socialIcon} />
                    <Text style={styles.socialTextFB}>FACEBOOK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ForgotPassword;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    txtHeader: {
        color: "#0D0D0D",
        fontFamily: "Mulish-ExtraBold",
        fontSize: 20,
        paddingLeft: 20,
    },
    imgBack: {
        width: 30,
        height: 20,
    },
    imgContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    },
    img: {
        width: 220,
        height: 220,
    },
    label: {
        fontFamily: 'Mulish-ExtraBold',
        color: "#0D0D0D",
        marginVertical: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        height: 50,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    inputIcon: {
        width: 30,
        height: 30,
        padding: 2,
        marginRight: 10,
    },
    checkContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    txtSignIn: {
        marginLeft: 10,
        fontSize: 16,
        color: "#000000",
        fontFamily: "Mulish-Bold",
    },
    txtSignUp: {
        marginLeft: 10,
        fontSize: 16,
        color: "#FF0000",
        fontFamily: "Mulish-Bold",
    },
    line: {
        height: 1,
        backgroundColor: '#7E7E7E',
        width: '100%',
        marginVertical: 30,
    },
    error: {
        color: 'red',
        marginVertical: 5,
        fontFamily: 'Mulish-Bold',
        textAlign :'center'
    },
    btnLogin: {
        backgroundColor: "#0961F5",
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderRadius: 10,
        marginTop: 20,
    },
    txtLogin: {
        fontSize: 17,
        color: "#FFFFFF",
        fontFamily: "Mulish-Bold",
    },
    orContainer: {
        alignItems: "center",
        marginVertical: 10,
        marginTop: 20,
        justifyContent: "center",
        flexDirection: "row",
    },
    lineOr: {
        height: 1,
        backgroundColor: '#4CAF50',
        width: '40%',
    },
    txtOr: {
        fontFamily: 'Mulish-Bold',
        paddingHorizontal: 15,
        color: '#000000',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 3,
        borderRadius: 10,
    },
    facebookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#1877F2",
        paddingHorizontal: 20,
        paddingVertical: 3,
        borderRadius: 10,
    },
    socialIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    socialTextFB: {
        fontFamily: 'Mulish-Bold',
        fontSize: 13,
        color: "#FFFFFF",
    },
    socialTextGG: {
        fontSize: 16,
        fontFamily: 'Mulish-Bold',
        color: "#191B28",
    },
});
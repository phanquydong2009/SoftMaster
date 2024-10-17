import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
    const navigation = useNavigation();
    const [isSwitchEnabled, setSwitchEnabled] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailBorderColor, setEmailBorderColor] = useState('#CCCCCC');
    const [passwordBorderColor, setPasswordBorderColor] = useState('#CCCCCC');
    const [errorText, setErrorText] = useState('');

    const handleBack = () => {
        navigation.navigate('SignUpOrSignIn');
    };

    const handleForgetPassWord = () => {
        navigation.navigate('ForgotPassword');
    };

    const toggleSwitch = () => setSwitchEnabled(previousState => !previousState);
    const togglePasswordVisibility = () => setPasswordVisible(prevState => !prevState);

    const handleFocus = (setBorderColor) => {
        setBorderColor('#000000'); // Khi bắt đầu điền, border sẽ là màu đen
    };

    // Hàm kiểm tra định dạng email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@gmail\.com$/; // Kiểm tra email kết thúc bằng @gmail.com
        return emailRegex.test(email);
    };


    const handleLogin = async () => {
        let valid = true;

        if (email === '') {
            setEmailBorderColor('#FF0000'); // Nếu ô email trống, đổi border sang đỏ
            valid = false;
        } else if (!validateEmail(email)) {
            setEmailBorderColor('#FF0000');
            setErrorText('Email không đúng định dạng!');
            valid = false;
        } else {
            setEmailBorderColor('#4CAF50'); // Nếu đã nhập, đổi border sang xanh
        }

        if (password === '') {
            setPasswordBorderColor('#FF0000'); // Nếu ô mật khẩu trống, đổi border sang đỏ
            valid = false;
        } else {
            setPasswordBorderColor('#4CAF50'); // Nếu đã nhập, đổi border sang xanh
        }

        if (!valid) {
            if (!errorText) {
                setErrorText('Vui lòng điền đủ thông tin');
            }
            return;
        }

        setErrorText(''); // Xóa bỏ lỗi trước đó

        // Gọi API getAll để kiểm tra email
        try {
            const response = await fetch('http://localhost:3001/user/getAll');
            const users = await response.json();
            console.log('Users from API:', users); // Log danh sách người dùng từ API

            const user = users.find(user => user.email === email);

            if (user) {
                console.log('User found:', user); // Log thông tin người dùng tìm thấy

                // Nếu tìm thấy email, gọi API login
                const loginResponse = await fetch('http://localhost:3001/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                const loginData = await loginResponse.json();
                console.log('Login response:', loginData); // Log phản hồi đăng nhập

                if (loginResponse.ok) {
                    await AsyncStorage.setItem('USER_INFO', JSON.stringify(user));

                    // Chuyển sang màn hình "Trang chủ" và truyền tên người dùng
                    console.log('Navigating to HomeScreen with name:', user.name); // Log tên người dùng đang chuyển

                    // Sau đó, chuyển đến màn hình Profile với userId
                    navigation.navigate('Tabs', { screen: 'Cá nhân', params: { userId: user._id }});
                    navigation.navigate('Tabs', { screen: 'Trang chủ', params: { userId: user._id, name: user.name } });
                } else {
                    // Kiểm tra lỗi trả về từ API
                    if (loginData.message === 'Incorrect password') {
                        setErrorText('Mật khẩu không đúng!');
                    } else if (loginData.message === 'Email not registered') {
                        setErrorText('Email chưa được đăng kí tài khoản!');
                    } else {
                        setErrorText('Mật khẩu không đúng');
                    }
                }
            } else {
                setErrorText('Email không tồn tại');
            }
        } catch (error) {
            setErrorText('Đã có lỗi xảy ra. Vui lòng thử lại.');
            console.error('Fetch error:', error); // Log lỗi nếu có
        }
    };



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Image source={require('../design/image/ic_back.png')} style={styles.imgBack} />
                </TouchableOpacity>
                <Text style={styles.txtHeader}>Đăng nhập</Text>
            </View>
            <View style={styles.imgContainer}>
                <Image source={require('../design/image/robot1.png')} style={styles.img} />
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Địa chỉ Email</Text>
                <View style={[styles.inputContainer, { borderColor: emailBorderColor }]}>
                    <Image source={require('../design/image/ic_email.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập Email"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => handleFocus(setEmailBorderColor)}
                    />
                </View>
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={[styles.inputContainer, { borderColor: passwordBorderColor }]}>
                    <Image source={require('../design/image/ic_lock.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mật khẩu"
                        secureTextEntry={!passwordVisible}
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => handleFocus(setPasswordBorderColor)}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Image
                            source={passwordVisible ? require('../design/image/ic_eyeHint.png') : require('../design/image/ic_eyeShow.png')}
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                </View>
                {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
                <View style={styles.line} />
            </View>
            <View style={styles.checkContainer}>
                <View style={styles.switchContainer}>
                    <Switch
                        value={isSwitchEnabled}
                        onValueChange={toggleSwitch}
                        trackColor={{ false: '#808080', true: 'rgba(0, 255, 10, 0.7)' }}
                        thumbColor={isSwitchEnabled ? '#FFFFFF' : '#f4f3f4'}
                    />
                    <Text style={styles.switchText}>Nhớ tài khoản</Text>
                </View>
                <TouchableOpacity onPress={handleForgetPassWord}>
                    <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
                <Text style={styles.txtLogin}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={styles.orContainer}>
                <View style={styles.lineOr} />
                <Text style={styles.txtOr}>Hoặc</Text>
                <View style={styles.lineOr} />
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

export default SignInScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    txtHeader: {
        color: '#0D0D0D',
        fontFamily: 'Mulish-ExtraBold',
        fontSize: 20,
        paddingLeft: 20,
    },
    imgBack: {
        width: 30,
        height: 20,
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    img: {
        width: 160,
        height: 160,
    },
    form: {
        marginTop: 20,
    },
    label: {
        fontFamily: 'Mulish-ExtraBold',
        color: '#0D0D0D',
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
    eyeIcon: {
        width: 25,
        height: 25,
    },
    errorText: {
        color: '#FF0000',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'Mulish-Bold',
    },
    checkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Mulish-Bold',
    },
    line: {
        height: 1,
        backgroundColor: '#7E7E7E',
        width: '100%',
        marginVertical: 20,
    },
    forgotPasswordText: {
        color: '#FF0000',
        fontSize: 16,
        fontFamily: 'Mulish-Bold',
    },
    btnLogin: {
        backgroundColor: '#0961F5',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 10,
        marginTop: 20,
    },
    txtLogin: {
        fontSize: 17,
        color: '#FFFFFF',
        fontFamily: 'Mulish-Bold',
    },
    orContainer: {
        alignItems: 'center',
        marginVertical: 10,
        marginTop: 20,
        justifyContent: 'center',
        flexDirection: 'row',
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
        marginTop: 20,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4285F4',
        borderRadius: 10,
        padding: 10,
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    facebookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4267B2',
        borderRadius: 10,
        padding: 10,
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    socialTextGG: {
        color: '#FFFFFF',
        fontFamily: 'Mulish-Bold',
        fontSize: 16,
    },
    socialTextFB: {
        color: '#FFFFFF',
        fontFamily: 'Mulish-Bold',
        fontSize: 16,
    },
});

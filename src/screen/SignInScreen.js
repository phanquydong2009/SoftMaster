import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/SigninStyles';

import BASE_URL from '../component/apiConfig';

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
        setBorderColor('#000000'); 
    };

    // Hàm kiểm tra định dạng email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@gmail\.com$/; 
        return emailRegex.test(email);
    };


    const handleLogin = async () => {
        let valid = true;

        if (email === '') {
            setEmailBorderColor('#FF0000'); 
            valid = false;
        } else if (!validateEmail(email)) {
            setEmailBorderColor('#FF0000');
            setErrorText('Email không đúng định dạng!');
            valid = false;
        } else {
            setEmailBorderColor('#4CAF50');
        }

        if (password === '') {
            setPasswordBorderColor('#FF0000');
        } else {
            setPasswordBorderColor('#4CAF50'); 
        }

        if (!valid) {
            if (!errorText) {
                setErrorText('Vui lòng điền đủ thông tin');
            }
            return;
        }

        setErrorText(''); 

        // Gọi API getAll để kiểm tra email
        try {
            const response = await fetch(`${BASE_URL}/user/getAll`);
            const users = await response.json();
            console.log('Users from API:', users);

            const user = users.find(user => user.email === email);

            if (user) {
                console.log('User found:', user);

                // Nếu tìm thấy email, gọi API login
                const loginResponse = await fetch(`${BASE_URL}/user/login`, {
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
                console.log('Login response:', loginData); 

                if (loginResponse.ok) {
                    await AsyncStorage.setItem('USER_INFO', JSON.stringify(user));

                    console.log('Navigating to HomeScreen with userID:', user._id, 'and name:', user.name);

                   
                    navigation.navigate('Tabs', { screen: 'Cá nhân', params: { userID: user._id } });
                    navigation.navigate('Tabs', { 
                        screen: 'Khóa học', 
                        params: { userID: user._id } 
                      });
                      
                    navigation.navigate('Tabs', { screen: 'Trang chủ', params: { userID: user._id, name: user.name } });
                } else {
               
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
            console.error('Fetch error:', error); 
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


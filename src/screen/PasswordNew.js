import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PasswordNew = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordBorderColor, setPasswordBorderColor] = useState('#CCCCCC');
    const [confirmPasswordBorderColor, setConfirmPasswordBorderColor] = useState('#CCCCCC');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();
    const { _id } = route.params;

    const handleBack = () => {
        navigation.navigate('SignUpOrSignIn');
    };

    const handleInputFocus = (type) => {
        if (type === 'password') {
            setPasswordBorderColor('#000000');
        } else if (type === 'confirmPassword') {
            setConfirmPasswordBorderColor('#000000');
        }
        setErrorText('');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const validateInputs = async () => {
        let valid = true;

        // Reset border colors and error text
        setPasswordBorderColor('#CCCCCC');
        setConfirmPasswordBorderColor('#CCCCCC');
        setErrorText('');

        // Validate password
        if (password === '') {
            setPasswordBorderColor('#FF0000');
            setErrorText('Vui lòng điền mật khẩu');
            valid = false;
        } else if (password.length < 8) {
            setPasswordBorderColor('#FF0000');
            setErrorText('Mật khẩu phải có ít nhất 8 ký tự');
            valid = false;
        } else {
            setPasswordBorderColor(password ? '#4CAF50' : '#CCCCCC');
        }

        // Validate confirm password
        if (confirmPassword === '') {
            setConfirmPasswordBorderColor('#FF0000');
            setErrorText('Vui lòng nhập lại mật khẩu');
            valid = false;
        } else {
            setConfirmPasswordBorderColor(confirmPassword ? '#4CAF50' : '#CCCCCC');
        }

        // Check if passwords match
        if (password && confirmPassword && password !== confirmPassword) {
            setPasswordBorderColor('#FF0000');
            setConfirmPasswordBorderColor('#FF0000');
            setErrorText('Mật khẩu không khớp');
            valid = false;
        }

        // Proceed with API call if valid
        if (valid) {
            try {
                const response = await fetch(`http://localhost:3001/user/reset-password/${_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ newPassword: password }),
                });

                if (!response.ok) {
                    const responseData = await response.json();
                    setErrorText(responseData.message || 'Có lỗi xảy ra khi cập nhật mật khẩu!');
                    console.error('Lỗi từ máy chủ:', responseData);
                    return;
                }

                setModalVisible(true);

                setTimeout(() => {
                    navigation.navigate('SignIn');
                }, 2000);
            } catch (error) {
                console.error('Lỗi kết nối:', error.message);
                setErrorText('Không thể kết nối đến máy chủ');
            }
        }
    };

    // Determine button background color
    const buttonBackgroundColor = password && confirmPassword ? '#0961F5' : 'rgba(117, 118, 126, 0.8)';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Image source={require("../design/image/ic_back.png")} style={styles.imgBack} />
                </TouchableOpacity>
                <Text style={styles.txtHeader}>Mật khẩu mới</Text>
            </View>
            <View style={styles.imgContainer}>
                <Image source={require('../design/image/robot1.png')} style={styles.img} />
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Mật khẩu mới</Text>
                <View style={[styles.inputContainer, { borderColor: passwordBorderColor }]}>
                    <Image source={require('../design/image/ic_lock.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mật khẩu mới"
                        secureTextEntry={!passwordVisible}
                        onFocus={() => handleInputFocus('password')}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Image
                            source={passwordVisible ? require('../design/image/ic_eyeHint.png') : require('../design/image/ic_eyeShow.png')}
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
                <View style={[styles.inputContainer, { borderColor: confirmPasswordBorderColor }]}>
                    <Image source={require('../design/image/ic_lock.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập lại mật khẩu mới"
                        secureTextEntry={!confirmPasswordVisible}
                        onFocus={() => handleInputFocus('confirmPassword')}
                        onChangeText={(text) => setConfirmPassword(text)}
                    />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                        <Image
                            source={confirmPasswordVisible ? require('../design/image/ic_eyeHint.png') : require('../design/image/ic_eyeShow.png')}
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                </View>
                {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
                <View style={styles.line}></View>
            </View>
            <TouchableOpacity style={[styles.btnLogin, { backgroundColor: buttonBackgroundColor }]} onPress={validateInputs}>
                <Text style={styles.txtLogin}>Hoàn tất</Text>
            </TouchableOpacity>

            {/* Custom Success Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Image source={require('../design/image/done.png')} style={styles.modalImage} />
                        <Text style={styles.modalText1}>Đổi mật khẩu thành công</Text>
                        <Text style={styles.modalText}>Từ giờ bạn phải đăng nhập với mật khẩu vừa cập nhật</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 20,
        justifyContent: 'space-between', 
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
    eyeIcon: {
        width: 25,
        height: 25,
    },
    errorText: {
        color: "#FF0000",
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    line: {
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
        marginVertical: 20,
    },
    btnLogin: {
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    txtLogin: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: "Mulish-ExtraBold",
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: 150,
        height: 150,
    },
    modalText1: {
        fontSize: 20,
        fontFamily: 'Mulish-ExtraBold',
        marginVertical: 10,
              color :"#202244"
    },
    modalText: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 18,
        color :"#202244"
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default PasswordNew;

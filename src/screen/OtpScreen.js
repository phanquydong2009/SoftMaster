import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BASE_URL from '../component/apiConfig';

const OtpScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params;
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [isComplete, setIsComplete] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const inputs = useRef([]);

    const handleInputChange = (text, index) => {
        if (!/^[0-9]*$/.test(text)) return;
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        setIsComplete(newOtp.every(item => item.length > 0));

        if (text && index < otp.length - 1) {
            inputs.current[index + 1]?.focus();
        } else if (!text && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleConfirm = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/verify-otp-register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otp.join('') }),
            });

            const data = await response.json();
            if (response.ok) {
                setIsModalVisible(true);
            } else {
                setErrorMessage('Mã OTP không hợp lệ!');
            }
        } catch (error) {
            setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        navigation.navigate('SignIn'); 
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Quay lại">
                    <Image source={require("../design/image/ic_back.png")} style={styles.imgBack} />
                </TouchableOpacity>
                <Text style={styles.txtHeader}>Xác thực OTP</Text>
            </View>
            <View style={styles.body}>
                <Image source={require('../design/image/otp.png')} style={styles.image} />
                <Text style={styles.txt_body}>Vui lòng kiểm tra email của bạn để biết mã xác minh được gửi cho bạn.</Text>
                <View style={styles.input_container}>
                    {otp.map((value, index) => (
                      <TextInput
                      key={index}
                      style={styles.input_number}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={value}
                      onChangeText={(text) => handleInputChange(text, index)}
                      ref={(input) => inputs.current[index] = input}
                      textAlign="center"
                      textAlignVertical="center"
                      underlineColorAndroid="transparent"
                      accessibilityLabel={`Ô nhập mã OTP ${index + 1}`}
                  />
                  
                    ))}
                </View>
                <Text style={styles.txt_resendCode}>Gửi lại mã</Text>
                {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            </View>
            <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: isComplete ? '#0961F5' : '#75767E' }]}
                onPress={isComplete ? handleConfirm : null}
                disabled={!isComplete}
                accessibilityLabel="Xác nhận OTP"
            >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={closeModal}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <Image source={require('../design/image/done.png')} />
                    <Text style={styles.modalTitle}>CHÚC MỪNG</Text>
                    <Text style={styles.modalMessage}>Bạn đã đăng ký thành công</Text>
                    <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                        <Text style={styles.modalButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
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
    body: {
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 30,
    },
    image: {
        marginTop: 20,
        marginBottom: 10,
    },
    txt_resendCode: {
        fontSize: 18,
        color: "#0D0D0D",
        fontFamily: "Mulish-ExtraBold",
        textAlign: 'center',
        marginBottom: 30,
        textDecorationLine: 'underline',
    },
    txt_body: {
        fontSize: 18,
        color: "#0D0D0D",
        fontFamily: "Mulish-ExtraBold",
        textAlign: 'center',
        marginBottom: 30,
    },
    input_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    input_number: {
        width: 50,
        height: 70,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 5,
        fontSize: 30,
        color: '#FFFFFF',
        fontFamily: 'Mulish-ExtraBold',
        backgroundColor: "#191B28",
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    errorMessage: {
        color: '#D32F2F',
        fontFamily: 'Mulish-ExtraBold',
        fontSize: 15,
        marginBottom: 10,
    },
    confirmButton: {
        height: 46,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Mulish-Bold',
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 23,
        fontFamily: 'Mulish-ExtraBold',
        marginVertical: 10,
        color: "#46B25C"
    },
    modalMessage: {
        fontSize: 20,
        fontFamily: 'Mulish-Bold',
        marginBottom: 20,
        color: "#46B25C"
    },
    modalButton: {
        backgroundColor: '#0961F5',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Mulish-Bold',
    },
});

export default OtpScreen;
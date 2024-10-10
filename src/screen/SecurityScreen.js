import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const SecurityScreen = () => {
    const navigation = useNavigation();
    // State for switch
    const [isRememberMeEnabled, setIsRememberMeEnabled] = useState(false);

    const toggleSwitch = () => {
        setIsRememberMeEnabled(prev => !prev);
    };
    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };
  
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={require('../design/image/ic_back.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>Bảo Mật</Text>
            </View>
            {/* Image and Text Content */}
            <View style={styles.content}>
                <ImageBackground
                    style={styles.securityIcon}
                    resizeMode="cover"
                    source={require('../design/image/security.png')}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.securityText}>
                        Để bảo vệ tối đa tài khoản của bạn, chúng tôi khuyến nghị sử dụng mật khẩu có chứa các ký tự đặc biệt nhằm tăng cường tính bảo mật.
                    </Text>
                </View>
                {/* Remember Me Switch */}
                <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>Ghi nhớ tôi</Text>
                    <TouchableOpacity
                        style={[
                            styles.outer,
                            { backgroundColor: isRememberMeEnabled ? '#0961F5' : '#E8F1FF' }
                        ]}
                        onPress={toggleSwitch}
                    >
                        <View
                            style={[
                                styles.inner,
                                { backgroundColor: isRememberMeEnabled ? '#E8F1FF' : '#f4f3f4', transform: [{ translateX: isRememberMeEnabled ? 30 : 0 }] }
                            ]}
                        />
                    </TouchableOpacity>
                </View>
                {/* Action Buttons */}
                <TouchableOpacity style={styles.infoButton}>
                    <Text style={styles.infoButtonText}>Xem thông tin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.passwordButton} onPress={handleForgotPassword} >
                    <Text style={styles.passwordButtonText}>Thay đổi mật khẩu</Text>
                    <Image
                        source={require('../design/image/Circle.png')}
                        style={styles.buttonIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SecurityScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
   
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        width: 30,
        height: 20,
        tintColor: '#202244',
    },
    headerText: {
        fontSize: 21,
        color: '#202244',
        fontFamily: 'Mulish-ExtraBold',
        lineHeight: 24,
        marginLeft: 16,
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      
    },
    securityIcon: {
        width: '100%',
        height: 300,

    },
    textContainer: {
        marginTop: 20,
        width: '90%',
        alignItems: 'center',
    },
    securityText: {
        fontSize: 16,
     
        fontFamily: 'Mulish-Bold',
        color: '#202244',
        textAlign: 'center',
    },
    switchContainer: {
        padding:20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        width: '90%',
    },
    switchText: {
        fontSize: 16,
       
        fontFamily: 'Mulish-Bold',
        color: '#202244',
        flex: 1,
    },
    outer: {
        width: 60,
        height: 30,
        backgroundColor: '#E8F1FF',
        borderRadius: 15,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 2,
        justifyContent: 'flex-start',
    },
    inner: {
        width: 26,
        height: 26,
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 8,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    infoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        width: '90%',
        padding: 15,
        marginTop: 20,
        elevation: 3,
        justifyContent: 'center',
    },
    passwordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0961F5',
        borderRadius: 15,
        width: '90%',
        padding: 15,
        marginTop: 15,
        elevation: 3,
        justifyContent: 'center',
    },
    infoButtonText: {
        fontSize: 16,
    
        fontFamily: 'Mulish-Bold',
        color: '#000000',
    },
    passwordButtonText: {
        fontSize: 16,
       
        fontFamily: 'Mulish-Bold',
        color: '#ffffff',
        flex: 1,
        textAlign: 'center',
    },
    buttonIcon: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
});

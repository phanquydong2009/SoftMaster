import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Notifications = ({ navigation }) => {
    // State for each toggle
    const [isSpecialOffersEnabled, setIsSpecialOffersEnabled] = useState(true);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isGeneralNotificationEnabled, setIsGeneralNotificationEnabled] = useState(true);
    const [isPaymentOptionsEnabled, setIsPaymentOptionsEnabled] = useState(true);
    const [isAppUpdatesEnabled, setIsAppUpdatesEnabled] = useState(true);
    const [isNewServicesEnabled, setIsNewServicesEnabled] = useState(false);
    const [isNewTipsEnabled, setIsNewTipsEnabled] = useState(false);

    const toggleSwitch = (setter) => {
        setter(prev => !prev);
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
                <Text style={styles.headerText}>Thông Báo</Text>
            </View>
            {/* Notifications List */}
            <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>Ưu đãi đặc biệt</Text>
                <TouchableOpacity
                    style={[
                        styles.outer,
                        { backgroundColor: isSpecialOffersEnabled ? '#0961F5' : '#E8F1FF' }
                    ]}
                    onPress={() => toggleSwitch(setIsSpecialOffersEnabled)}
                >
                    <View
                        style={[
                            styles.inner,
                            { backgroundColor: isSpecialOffersEnabled ? '#E8F1FF' : '#f4f3f4', transform: [{ translateX: isSpecialOffersEnabled ? 30 : 0 }] }
                        ]}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>Âm thanh</Text>
                <TouchableOpacity
                    style={[
                        styles.outer,
                        { backgroundColor: isSoundEnabled ? '#0961F5' : '#E8F1FF' }
                    ]}
                    onPress={() => toggleSwitch(setIsSoundEnabled)}
                >
                    <View
                        style={[
                            styles.inner,
                            { backgroundColor: isSoundEnabled ? '#E8F1FF' : '#f4f3f4', transform: [{ translateX: isSoundEnabled ? 30 : 0 }] }
                        ]}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>Thông báo chung</Text>
                <TouchableOpacity
                    style={[
                        styles.outer,
                        { backgroundColor: isGeneralNotificationEnabled ? '#0961F5' : '#E8F1FF' }
                    ]}
                    onPress={() => toggleSwitch(setIsGeneralNotificationEnabled)}
                >
                    <View
                        style={[
                            styles.inner,
                            { backgroundColor: isGeneralNotificationEnabled ? '#E8F1FF' : '#f4f3f4', transform: [{ translateX: isGeneralNotificationEnabled ? 30 : 0 }] }
                        ]}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>Tùy chọn thanh toán</Text>
                <TouchableOpacity
                    style={[
                        styles.outer,
                        { backgroundColor: isPaymentOptionsEnabled ? '#0961F5' : '#E8F1FF' }
                    ]}
                    onPress={() => toggleSwitch(setIsPaymentOptionsEnabled)}
                >
                    <View
                        style={[
                            styles.inner,
                            { backgroundColor: isPaymentOptionsEnabled ? '#E8F1FF' : '#f4f3f4', transform: [{ translateX: isPaymentOptionsEnabled ? 30 : 0 }] }
                        ]}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>Cập nhật ứng dụng</Text>
                <TouchableOpacity
                    style={[
                        styles.outer,
                        { backgroundColor: isAppUpdatesEnabled ? '#0961F5' : '#E8F1FF' }
                    ]}
                    onPress={() => toggleSwitch(setIsAppUpdatesEnabled)}
                >
                    <View
                        style={[
                            styles.inner,
                            { backgroundColor: isAppUpdatesEnabled ? '#E8F1FF' : '#f4f3f4', transform: [{ translateX: isAppUpdatesEnabled ? 30 : 0 }] }
                        ]}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>Dịch vụ mới có sẵn</Text>
                <TouchableOpacity
                    style={[
                        styles.outer,
                        { backgroundColor: isNewServicesEnabled ? '#0961F5' : '#E8F1FF' }
                    ]}
                    onPress={() => toggleSwitch(setIsNewServicesEnabled)}
                >
                    <View
                        style={[
                            styles.inner,
                            { backgroundColor: isNewServicesEnabled ? '#E8F1FF' : '#f4f3f4', transform: [{ translateX: isNewServicesEnabled ? 30 : 0 }] }
                        ]}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>Mẹo mới có sẵn</Text>
                <TouchableOpacity
                    style={[
                        styles.outer,
                        { backgroundColor: isNewTipsEnabled ? '#0961F5' : '#E8F1FF' } // Ensure consistency here
                    ]}
                    onPress={() => toggleSwitch(setIsNewTipsEnabled)}
                >
                    <View
                        style={[
                            styles.inner,
                            { backgroundColor: isNewTipsEnabled ? '#E8F1FF' : '#f4f3f4', transform: [{ translateX: isNewTipsEnabled ? 30 : 0 }] }
                        ]}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
        fontWeight: '700',
        color: '#202244',
        fontFamily: 'Mulish',
        lineHeight: 24,
        marginLeft: 16,
        flex: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 20,
        marginBottom: 10,
    },
    notificationText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    outer: {
        width: 60,
        height: 30,
        backgroundColor: 'gray',
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
});

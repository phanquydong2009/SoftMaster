import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import BASE_URL from '../component/apiConfig';

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userID } = route.params; // Nhận _id từ ProfileScreen
  const [gender, setGender] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator

  // Hàm gọi API để lấy thông tin người dùng
  const fetchUserData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${BASE_URL}/user/getUserByID/${userID}`);
      const data = await response.json();
      
      if (response.ok) {
        setName(data.name || '');
        setPhone(data.phone || '');
        setAvatar(data.avatar ? data.avatar : require('../design/image/noprofile.png'));
        setGender(data.gender || '');

        // Xử lý ngày sinh
        if (data.birthday) {
          const formattedBirthday = data.birthday.split('T')[0];
          setBirthday(formattedBirthday);
        } else {
          setBirthday('');
        }
      } else {
        Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lấy thông tin người dùng.');
    } finally {
      setLoading(false); // End loading
    }
  };

  // Hàm gọi API để cập nhật thông tin người dùng
  const updateUserData = async () => {
    if (!name || !phone || !birthday) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${BASE_URL}/user/update/${userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          avatar,
          birthday,
          gender,
        }),
      });

      if (response.ok) {
        setSuccessPopupVisible(true);
      } else {
        Alert.alert('Lỗi', 'Cập nhật thông tin không thành công. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin.');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userID]);

  const handleSelectGender = (selectedGender) => {
    setGender(selectedGender);
    setModalVisible(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const closeSuccessPopup = () => {
    setSuccessPopupVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={require('../design/image/ic_back.png')} />
        </TouchableOpacity>
        <Text style={styles.txtTitle}>Chỉnh sửa hồ sơ</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity onPress={Keyboard.dismiss}>
            <View style={styles.avatar_container}>
              <View style={styles.circleBorder}>
                <Image
                  source={avatar && typeof avatar === 'string' ? { uri: avatar } : require('../design/image/noprofile.png')}
                  style={styles.avatar}
                />
              </View>
              <TouchableOpacity>
                <Image source={require('../design/image/square.png')} style={styles.overlayImage} />
              </TouchableOpacity>
            </View>

            <View style={styles.body}>
              <View style={styles.inputContainer}>
                <Image source={require('../design/image/ic_name.png')} style={styles.icon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Họ tên"
                  placeholderTextColor="#505050"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Image source={require('../design/image/ic_name.png')} style={styles.icon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Số điện thoại"
                  placeholderTextColor="#505050"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={styles.inputContainer}>
                <Image source={require('../design/image/ic_profile.png')} style={styles.icon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Link ảnh đại diện"
                  placeholderTextColor="#505050"
                  value={avatar}
                  onChangeText={setAvatar}
                />
              </View>

              <View style={styles.inputContainer}>
                <Image source={require('../design/image/ic_birthday.png')} style={styles.icon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Ngày sinh"
                  placeholderTextColor="#505050"
                  value={birthday}
                  onChangeText={setBirthday}
                />
              </View>

              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputContainer}>
                <Image
                  source={gender ? (gender === 'Nam' ? require('../design/image/men.png') : require('../design/image/woman.png')) : require('../design/image/ic-sex.png')}
                  style={styles.icon}
                />
                <Text style={styles.textInput}>{gender || "Giới tính"}</Text>
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                  <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.option} onPress={() => handleSelectGender('Nam')}>
                      <Image source={require('../design/image/men.png')} style={styles.optionIcon} />
                      <Text style={styles.optionText}>Nam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => handleSelectGender('Nữ')}>
                      <Image source={require('../design/image/woman.png')} style={styles.optionIcon} />
                      <Text style={styles.optionText}>Nữ</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>

              <TouchableOpacity style={styles.inputContainer}>
                <Image source={require('../design/image/ic_name.png')} style={styles.icon} />
                <Text style={styles.textInput}>Đổi mật khẩu</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.button} onPress={updateUserData}> 
                <Text style={styles.txtButton}>Cập nhật</Text>
                <Image source={require('../design/image/icon_continue.png')} style={styles.continueIcon} />
              </TouchableOpacity>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={successPopupVisible}
              onRequestClose={closeSuccessPopup}
            >
              <View style={styles.popupOverlay}>
                <View style={styles.popupContainer}>
                  <Image source={require('../design/image/sss.jpg')} style={styles.popupImage} />
                  <Text style={styles.popupTitle}>Cập nhật thành công!</Text>
                  <Text style={styles.popupMessage}>Thông tin của bạn đã được cập nhật mới.</Text>
                  <TouchableOpacity style={styles.popupButton} onPress={closeSuccessPopup}>
                    <Text style={styles.popupButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
export default EditProfile;

const styles = StyleSheet.create({

// Style cho popup
popupOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền tối mờ
},
popupContainer: {
  width: 300,
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  alignItems: 'center',
  elevation: 5, // Đổ bóng
},
popupImage: {
  width: 100,
  height: 100,
  marginBottom: 10,
},
popupTitle: {
  fontSize: 18,
  fontFamily: 'Mulish-ExtraBold',
  marginBottom: 5,
},
popupMessage: {
  fontSize: 14,
  fontFamily: 'Mulish-Bold',
  textAlign: 'center',
  marginBottom: 15,
},
popupButton: {
  backgroundColor: '#007bff',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
},
popupButtonText: {
  color: 'white',
  fontSize: 16,
},

  txtButton: {
    fontFamily: 'Mulish-ExtraBold',
    color: '#FFFFFF',
    fontSize: 19,
    flex: 1,
    textAlign: 'center',
    marginLeft: 50,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    backgroundColor: "#0961F5",
    width: '100%',
    height: 60,
    borderRadius: 30,
    marginTop: 50,
    paddingHorizontal: 15,
  },
  continueIcon: {
    width: 50,
    height: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 60,
    borderRadius: 15,
    marginTop: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Mulish-Bold',
    color: '#505050',
  },
  icon: {
    width: 32,
    height: 32,
    marginHorizontal: 10,
  },
  body: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar_container: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBorder: {
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#167F71',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  overlayImage: {
    position: 'absolute',
    bottom: -8,
  },
  txtTitle: {
    fontSize: 23,
    fontFamily: 'Mulish-ExtraBold',
    color: '#202244',
    paddingLeft: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  optionIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'Mulish-Bold',
  },
  footer: {
    marginTop: 20,
  },
});

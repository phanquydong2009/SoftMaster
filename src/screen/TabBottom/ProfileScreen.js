import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ToolBar from '../../component/ToolBar';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId; 

  const [userData, setUserData] = useState({ _id: '', name: '', email: '', avatar: '' }); 

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not defined');
      return;
    }

    const fetchUserData = async () => {
      try {
     
        const response = await fetch(`http://localhost:3001/user/getUserByID/${userId}`);
        const user = await response.json(); 

        if (user) {
          setUserData({ 
            _id: user._id, 
            name: user.name, 
            email: user.email,
            avatar: user.avatar || 'https://cdn-icons-png.flaticon.com/512/1829/1829589.png'
          });
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEditProfile = () => {
    console.log("ID truyền qua là:", userData._id);
    navigation.navigate('EditProfile', { userId: userData._id }); 
};

  const profileItems = [
    { title: 'Nâng cấp lên Premium', icon: require('../../design/image/vip.png'), onPress: () => navigation.navigate('Premium') },
    { title: 'Chỉnh sửa hồ sơ', icon: require('../../design/image/edit_profile.png'), onPress: handleEditProfile },
    { title: 'Tùy chọn thanh toán', icon: require('../../design/image/payment.png'), onPress: () => navigation.navigate('CardPayment') },
    { title: 'Bảo mật', icon: require('../../design/image/ic_security.png'), onPress: () => navigation.navigate('Security') },
    { title: 'Ngôn ngữ', icon: require('../../design/image/language.png'), value: 'Vietnam(VN)', onPress: () => navigation.navigate('Language') },
    { title: 'Chế độ tối', icon: require('../../design/image/dark_mode.png') },
    { title: 'Điều khoản & Điều kiện', icon: require('../../design/image/terms.png'), onPress: () => navigation.navigate('TermsPolicy') },
    { title: 'Mời bạn bè', icon: require('../../design/image/invite_friends.png'), onPress: () => navigation.navigate('ShareFriend') },
    { title: 'Đăng xuất', icon: require('../../design/image/logout.png'), onPress: () =>navigation.navigate('SignIn') },
  ];

  const ProfileItem = ({ icon, title, value, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        {icon && <Image source={icon} style={styles.itemIcon} resizeMode="contain" />}
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <View style={styles.itemRight}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        <Image source={require('../../design/image/ic_backRight.png')} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <ToolBar title={'Trang cá nhân'} />
      <View style={styles.boxContainer}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <View>
              <Image
                source={userData.avatar ? { uri: userData.avatar } : require('../../design/image/noprofile.png')}
                style={styles.profileImage}
              />
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/1829/1829589.png',
                }}
                style={styles.updateImage}
              />
            </View>
          </View>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
        {profileItems.map((item, index) => (
          <ProfileItem
            key={index}
            icon={item.icon}
            title={item.title}
            value={item.value}
            onPress={item.onPress}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  boxContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 25,
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 70,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202244',
    marginTop: 20,
  },
  email: {
    fontSize: 14,
    color: '#545454',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 16,
    color: '#202244',
    fontWeight: 'bold',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    marginRight: 10,
    color: '#0961F5',
    fontWeight: 'bold',
    fontSize: 15,
  },
  updateImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
    position: 'absolute',
    bottom: 10,
    right: 0,
  },
});

export default ProfileScreen;

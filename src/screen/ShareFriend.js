import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import ToolBar from '../component/ToolBar';

const contacts = [
  { id: '1', name: 'Rani Thomas', phone: '(+91) 702-897-7965', active: true },
  { id: '2', name: 'Anastasia', phone: '(+91) 702-897-7965', active: true },
  { id: '3', name: 'Vaibhav', phone: '(+91)b727-688-4052', active: false },
  { id: '4', name: 'Rahul Juman', phone: '(+91) 601-897-1714', active: true },
  { id: '5', name: 'Abby', phone: '(+91) 802-312-320', active: false },
];

const ContactItem = ({ item, index }) => (
  <View
    style={[
      styles.itemContainer,
      index === 0 && styles.firstItem,
      index === contacts.length - 1 && styles.lastItem,
    ]}
  >
    <View style={styles.avatarContainer}>
      <View style={styles.avatar} />
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.phone}>{item.phone}</Text>
    </View>
    <TouchableOpacity
      style={[styles.button, item.active && styles.activeButton]}
    >
      <Text style={[styles.buttonText, item.active && styles.activeButtonText]}>
        Mời
      </Text>
    </TouchableOpacity>
  </View>
);

const FooterList = () => {
  const socialIcons = [
    { name: 'Facebook', icon: 'https://img.icons8.com/color/48/000000/facebook-new.png' },
    { name: 'X', icon: 'https://img.icons8.com/color/48/000000/twitter--v1.png' },
    { name: 'Google', icon: 'https://img.icons8.com/color/48/000000/google-logo.png' },
    { name: 'Line', icon: 'https://img.icons8.com/color/48/000000/line-me.png' },
  ];

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTitle}>Chia sẻ mời qua</Text>
      <View style={styles.iconContainer}>
        {socialIcons.map((item) => (
          <TouchableOpacity key={item.name} style={styles.iconButton}>
            <Image
              source={{ uri: item.icon }}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const ShareFriend = () => (
  <View style={styles.container}>
    <ToolBar title={'Mời bạn bè'} />
    {contacts.map((item, index) => (
      <ContactItem key={item.id} index={index} item={item} />
    ))}
    <FooterList />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F9FF',
    flex: 1,
    padding : 15,
  },
  listContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginHorizontal: 16,
    backgroundColor: 'white',
  },
  firstItem: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  lastItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: '#E8F1FF',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202244',
  },
  phone: {
    fontSize: 14,
    color: '#202244',
    fontWeight: 'medium',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#E8F1FF',
    width: 80,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    fontSize: 14,
    color: '#202244',
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: 'white',
  },
  footerContainer: {
    padding: 16,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202244',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent:'start',
   
  },
  iconButton: {
    backgroundColor: '#E8F1FF',
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  iconImage: {
    width: 30,
    height: 39,
  },
});

export default ShareFriend;

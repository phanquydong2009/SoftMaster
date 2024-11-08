import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import ToolBar from '../../component/ToolBar';
import { useNavigation } from '@react-navigation/native';
import styles from '../../stylesTabBottom/CertificationScreenStyles';
const CertificationScreen = () => {
  const navigation = useNavigation();
  const handleCert = () => {
    navigation.navigate('Cert');
  };
  const courses = [
    {
      name: 'Build Personal Branding',
      subname: 'Phát triển Web',
      image: 'https://vtiacademy.edu.vn/upload/images/cau-lac-bo/thiet-ke-ui-ux-la-gi-tai-sao-nghe-ux-ui-ngay-cang-hot.jpg',
    },
    {
      name: 'Mastering Blender 3D',
      subname: 'Thiết kế UI/Ux',
      image: 'https://vtiacademy.edu.vn/upload/images/cau-lac-bo/thiet-ke-ui-ux-la-gi-tai-sao-nghe-ux-ui-ngay-cang-hot.jpg',
    },
    {
      name: 'Full Stack Web Development',
      subname: 'Phát triển Web',
      image: 'https://vtiacademy.edu.vn/upload/images/cau-lac-bo/thiet-ke-ui-ux-la-gi-tai-sao-nghe-ux-ui-ngay-cang-hot.jpg',
    },
    {
      name: 'Complete UI Designer',
      subname: 'Quản lý nhân sự',
      image: 'https://vtiacademy.edu.vn/upload/images/cau-lac-bo/thiet-ke-ui-ux-la-gi-tai-sao-nghe-ux-ui-ngay-cang-hot.jpg',
    },
    {
      name: 'Sharing Work with Team',
      subname: 'Tài chính & Kế toán',
      image: 'https://vtiacademy.edu.vn/upload/images/cau-lac-bo/thiet-ke-ui-ux-la-gi-tai-sao-nghe-ux-ui-ngay-cang-hot.jpg',
    },
  ];

  const PersonalBrandingCard = ({ name, sub, image }) => {
    return (
      <View style={styles.container2}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{sub}</Text>
          <TouchableOpacity style={styles.button} onPress={handleCert}>
            <Text style={styles.buttonText}>Xem</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <PersonalBrandingCard name={item.name} sub={item.subname} image={item.image} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ToolBar title={'Chứng chỉ'} />
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};


export default CertificationScreen;

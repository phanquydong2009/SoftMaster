import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

// Sample data
const categories = [
  { id: '1', name: 'Thiết kế 3D', image: require('../design/image/ic_3d.png') },
  { id: '2', name: 'Thiết kế đồ họa', image: require('../design/image/ic_design.png') },
  { id: '3', name: 'Phát triển Web', image: require('../design/image/ic_web.png') },
  { id: '4', name: 'SEO & Tiếp thị', image: require('../design/image/ic_sale.png') },
  { id: '5', name: 'Tài chính & Kế toán', image: require('../design/image/ic_bank.png') },
  { id: '6', name: 'Phát triển bản thân', image: require('../design/image/icon_pro.png') },
  { id: '7', name: 'Năng suất văn phòng', image: require('../design/image/ic_settingoffice.png') },
  { id: '7', name: 'Quản lý nhân sự', image: require('../design/image/ic_office.png') },
];

const AllCategory = () => {
  const navigation = useNavigation();
  
  const handleBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Image source={require("../design/image/ic_back.png")} style={styles.imgBack} />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Tất cả danh mục</Text>
      </View>
      <View style={styles.searchContainer}>
        <Image source={require('../design/image/ic_search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="#545454"
        />
      </View>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}  
        columnWrapperStyle={styles.row} 
      />
    </View>
  );
};

export default AllCategory;

const styles = StyleSheet.create({
  category_container: {
    flexDirection: "row"
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#202244',
    fontFamily: 'Mulish-Bold',
    padding: 0,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5F9FF",
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
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    paddingVertical:30
  },
  itemImage: {
    width:60,
    height: 60,
    borderRadius: 10,
  },
  itemName: {
    fontFamily : 'Mulish-ExtraBold',
    marginTop: 5,
    fontSize: 18,
    color: 'rgba(32, 34, 68, 0.8)',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
});

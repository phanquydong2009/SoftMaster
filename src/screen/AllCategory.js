import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../component/apiConfig';

const AllCategory = () => {
  const navigation = useNavigation();
  const [subjects, setSubjects] = useState([]);

  // Hàm gọi API để lấy dữ liệu từ API subject/getAll
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}/subject/getAll`);
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {/* Sử dụng đúng thuộc tính `img` để hiển thị hình ảnh từ API */}
      {item.img ? (
        <Image source={{ uri: item.img }} style={styles.itemImage} />
      ) : (
        <Text>Image not available</Text>
      )}
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
        data={subjects}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} 
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
    paddingVertical: 30
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemName: {
    fontFamily: 'Mulish-ExtraBold',
    marginTop: 5,
    fontSize: 18,
    color: 'rgba(32, 34, 68, 0.8)',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
});

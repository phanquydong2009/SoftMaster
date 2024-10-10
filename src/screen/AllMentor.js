import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const AllMentor = () => {
  const navigation = useNavigation();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);  // Thêm state để lưu danh sách sau khi lọc
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');  // Thêm state để lưu từ khóa tìm kiếm

  useEffect(() => {

    const fetchMentors = async () => {
      try {
        const response = await axios.get('http://192.168.1.4:3000/teacher/getAll');
        setMentors(response.data);
        setFilteredMentors(response.data);  
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleViewProfileMentor = (mentor) => {
    // Truyền _id của giảng viên vào navigation
    navigation.navigate('ProfileMentor', { _id: mentor._id });
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleViewProfileMentor(item)}>
      {/* Hiển thị avatar */}
      <Image source={{ uri: item.avatar }} style={styles.itemImage} />
      <View style={styles.textContainer}>
        {/* Hiển thị tên và chuyên ngành */}
        <Text style={styles.nameMentor}>{item.name}</Text>
        <Text style={styles.nameCategory}>{item.major}</Text>
      </View>
    </TouchableOpacity>
  );
  

  const handleSearch = (text) => {
    setSearchKeyword(text);

    // Lọc danh sách giảng viên dựa trên từ khóa tìm kiếm
    const filteredData = mentors.filter((mentor) =>
      mentor.name.toLowerCase().includes(text.toLowerCase()) ||
      mentor.major.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMentors(filteredData);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Image source={require("../design/image/ic_back.png")} style={styles.imgBack} />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Tất cả giảng viên</Text>
      </View>
      <View style={styles.searchContainer}>
        <Image source={require('../design/image/ic_search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Tìm kiếm"
          placeholderTextColor="#545454"
          value={searchKeyword}  // Hiển thị từ khóa hiện tại
          onChangeText={handleSearch}  // Gọi hàm handleSearch khi người dùng nhập
        />
      </View>
      <FlatList
        data={filteredMentors}  // Sử dụng danh sách đã lọc
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}  // Sử dụng index làm key nếu id không tồn tại
      />
    </View>
  );
};

export default AllMentor;

const styles = StyleSheet.create({
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
    width: 30,
    height: 30,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F1FF',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  nameMentor: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 18,
    color: '#202244',
  },
  nameCategory: {
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
    color: '#545454',
  },
});

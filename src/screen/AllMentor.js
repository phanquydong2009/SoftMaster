import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../component/apiConfig';
import styles
 from '../styles/AllMentorStyles';
const AllMentor = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { userID } = route.params || {};
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState(''); 

  useEffect(() => {

    const fetchMentors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/teacher/getAll`);

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
    // Log để kiểm tra _id của giảng viên và userID
    console.log('Mentor ID:', mentor._id);
    console.log('User ID:', userID);
    
    // Truyền _id của giảng viên và userID vào navigation
    navigation.navigate('ProfileMentor', { _id: mentor._id, userID });
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
          value={searchKeyword} 
          onChangeText={handleSearch} 
        />
      </View>
      <FlatList
        data={filteredMentors} 
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}  
      />
    </View>
  );
};

export default AllMentor;

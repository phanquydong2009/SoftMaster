import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../component/apiConfig';

const MyCourseDetail = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/test/getAll`);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

// Chuyển trang 
const handleGoToQuizzCourse = (_id) => {
  console.log("Navigating to QuizzCourse with ID:", _id); 
  navigation.navigate('QuizzCourse', { _id });
};


  const renderItem = ({ item, index }) => (
    <View style={styles.columnItem}>
      <View style={styles.courseSection}>
        <View style={styles.number_container}>
          <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
        <View style={styles.column_text}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <Text style={styles.sectionDay}>{item.updatedAt.split('T')[0]}</Text>
        </View>
        {/* Cập nhật hình ảnh để xử lý bấm vào */}
        <TouchableOpacity onPress={() => handleGoToQuizzCourse(item._id)}>
          <Image source={require('../design/image/ic_quiz.png')} style={styles.icon_quizz} />
        </TouchableOpacity>
      </View>
      {/* Dòng phân cách */}
      <View style={styles.separator} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={require('../design/image/ic_back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khóa học của tôi</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput style={styles.input} placeholder="Tìm kiếm..." />
        <TouchableOpacity>
          <Image
            source={require('../design/image/ic_search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        style={styles.container_list}
      />
    </View>
  );
};

export default MyCourseDetail;

const styles = StyleSheet.create({
  container_list: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    borderRadius: 20,
  },
  number: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 20,
    color: "#202244"
  },
  number_container: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E8F1FF',
    backgroundColor: "#F5F9FF",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 15,
    color: '#202244',
    fontSize: 21,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    height: 55,
    marginVertical: 10
  },
  input: {
    flex: 1,
    paddingLeft: 10,
  },
  searchIcon: {
    width: 38,
    height: 38,
  },
  icon_quizz: {
    height: 40,
    width: 40,
  },
  sectionDay: {
    fontFamily: 'Mulish-Bold',
    fontSize: 13,
    color: "#545454",
    marginTop: 10
  },
  sectionTitle: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 17,
    color: "#202244"
  },
  column_text: {
    flexDirection: 'column',
    justifyContent: "space-between",
    width: 200
  },
  columnItem: {
    flexDirection: "column"
  },
  courseSection: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  noLessons: {
    textAlign: 'center',
    color: '#545454',
  },
});

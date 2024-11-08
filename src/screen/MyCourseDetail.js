import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../component/apiConfig';
import styles from '../styles/MyCourseDetailScreenStyles';

const MyCourseDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { courseID, userID } = route.params;


  // Log giá trị courseID để kiểm tra
  useEffect(() => {
    console.log("courseID nhận được từ params:", courseID);
  }, [courseID]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/lesson/getLessonByCourseID/${courseID}`);
        // Gán dữ liệu từ API vào state
        const lessonsWithID = response.data.map(lesson => ({
          ...lesson,
          _id: lesson._id || "default_id",
        }));
        setData(lessonsWithID);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài học:", error);
      }
    };

    fetchData();
  }, [courseID]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoToDetailLesson = (_id) => {
    console.log("Truyền ID và userID:", _id, userID);
    navigation.navigate('DetailLesson', { _id, userID });
  };
  

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.columnItem} onPress={() => handleGoToDetailLesson(item._id)}>
      <View style={styles.courseSection}>
        <View style={styles.number_container}>
          <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
        <View style={styles.column_text}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          <Text style={styles.sectionDay}>{item.updatedAt.split('T')[0]}</Text>
        </View>
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
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

      {data.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Chưa có khóa học nào ! Giảng viên sẽ cập nhật sau!</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          style={styles.container_list}
        />
      )}
    </View>
  );
};

export default MyCourseDetail;

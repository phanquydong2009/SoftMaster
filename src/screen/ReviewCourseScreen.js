import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import BASE_URL from '../component/apiConfig';

const ReviewCourseScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {courseId} = route.params;
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      // Gọi API để lấy feedbacks theo courseId
      const response = await fetch(
        `${BASE_URL}/feedbackCourse/getFeedbackByCourseID/${courseId}`
      );
      
      const feedbackData = await response.json();

      if (!Array.isArray(feedbackData)) {
        setReviews([]);
        return;
      }

      // Tạo mảng chứa thông tin của feedbacks và người dùng
      const feedbacksWithUser = await Promise.all(
        feedbackData.map(async feedback => {
          // Gọi API lấy thông tin người dùng theo userID
          const userResponse = await fetch(
            `${BASE_URL}/user/getUserByID/${feedback.userID}`
          );
          
          const userData = await userResponse.json();
          return {...feedback, userName: userData.name};
        }),
      );

      setReviews(feedbacksWithUser);
    } catch (error) {
      console.error('Lỗi khi lấy feedbacks:', error);
      setReviews([]);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const renderItem = ({item}) => {
    const stars = '⭐'.repeat(item.feedbackDetail.rating);

    return (
      <View style={styles.itemReview}>
        <View style={styles.row}>
          <Text style={styles.txtRate}>{stars}</Text>
          <Text style={styles.txtUser}>{item.userName}</Text>
        </View>

        <Text style={styles.txtContent}>{item.feedbackDetail.content}</Text>

        <Text style={styles.txtTime}>
          {formatDate(item.feedbackDetail.updatedAt)}
        </Text>
      </View>
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={require('../design/image/ic_back.png')} />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Đánh giá</Text>
      </View>

      <View style={styles.countReview}>
        <Text style={styles.count_txt}>Tổng đánh giá</Text>
        <View style={styles.count_number}>
          <Text style={styles.count_numberText}>{reviews.length}</Text>
        </View>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />

      <View style={styles.ViewAll}>
        <TouchableOpacity style={styles.btnViewAllReview}>
          <Text style={styles.txtViewAllReview}>Viết đánh giá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewCourseScreen;

const styles = StyleSheet.create({
  countReview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  count_number: {
    width: 30,
    height: 30,
    backgroundColor: '#A3A4A9',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  count_numberText: {
    color: '#191B28',
    fontSize: 20,
    fontFamily: 'Mulish-ExtraBold',
  },
  count_txt: {
    color: '#191B28',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
  },
  txtContent: {
    color: '#242424',
    fontSize: 15,
    fontFamily: 'Mulish-Regular',
    marginTop: 5,
  },
  txtTime: {
    color: '#808080',
    fontSize: 15,
    fontFamily: 'Mulish-Bold',
    marginTop: 15,
  },

  txtRate: {
    fontSize: 20,
  },
  txtUser: {
    color: '#242424',
    fontSize: 14,
    fontFamily: 'Mulish-Bold',
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    flexWrap: 'wrap',
  },
  itemReview: {
    width: '100%',
    // minHeight: 130,
    borderRadius: 25,
    borderWidth: 1,
    marginTop: 10,
    borderColor: '#99A1CE',
    paddingVertical: 10,
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  ViewAll: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  btnViewAllReview: {
    width: '100%',
    borderRadius: 25,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#99A1CE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtViewAllReview: {
    color: '#0A0C2C',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 20,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  txtHeader: {
    color: '#0D0D0D',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 20,
    paddingLeft: 20,
  },
});

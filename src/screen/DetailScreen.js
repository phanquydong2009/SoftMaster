import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react'; 
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import BASE_URL from '../component/apiConfig';
import styles from '../styles/DetailScreenStyles';

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { courseId, userID } = route.params; 

  console.log("ID khóa học nhận được là:", courseId);
  console.log("ID người dùng nhận được là:", userID);

  const [courseData, setCourseData] = useState(null); 
  const [averageRating, setAverageRating] = useState(null); 
  const [countFeedback, setCountFeedback] = useState(null); 
  
  const handleNavigateToReview = () => {
    navigation.navigate('ReviewCourse', { courseId, userID });
  };

  const isJoinedCourse = courseData?.isJoinedCourse;

  const fetchCourseDetail = useCallback(async () => {
    if (!userID) {
      Alert.alert('Lỗi', 'Không tìm thấy ID người dùng');
      return;
    }

    try {
      // Gọi API để lấy thông tin chi tiết khóa học
      const courseResponse = await fetch(
        `${BASE_URL}/course/getDetailByCourseID/${courseId}/?userID=${userID}`,
      );

      if (!courseResponse.ok) {
        throw new Error('Lỗi khi lấy thông tin chi tiết khóa học');
      }
      
      const courseData = await courseResponse.json();
      setCourseData(courseData);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết khóa học:', error);
      Alert.alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  }, [courseId, userID]);

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchCourseDetail();
  }, [isFocused, fetchCourseDetail]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const ratingResponse = await fetch(
          `${BASE_URL}/feedbackCourse/averageRatingByCourseID/${courseId}`,
        );

        if (!ratingResponse.ok) {
          throw new Error('Lỗi khi lấy đánh giá trung bình');
        }
        const ratingData = await ratingResponse.json();
        setAverageRating(ratingData.averageRating);

        const feedbackResponse = await fetch(
          `${BASE_URL}/feedbackCourse/countFeedbackByCourseID/${courseId}`,
        );

        if (!feedbackResponse.ok) {
          throw new Error('Lỗi khi lấy số lượng phản hồi');
        }
        const feedbackData = await feedbackResponse.json();
        setCountFeedback(feedbackData.count);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin khóa học hoặc phản hồi:', error);
      }
    };
  
    fetchCourseDetails();
  }, [courseId]);

  const createPaymentUrl = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/payment/create-payment-url`, 
        {
          method: 'POST',
          body: JSON.stringify({
            userID: userID,
            courseId,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await res.json();
      return data;
    } catch (error) {
      Alert.alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  if (!courseData) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  const { name, img, describe, teacherID } = courseData;
  const teacherName = teacherID ? teacherID.name : 'Giảng viên không xác định';

  const onJoinCoursePress = async () => {
    if (isJoinedCourse) {
      return;
    }

    const url = await createPaymentUrl();
    navigation.navigate('CoursePayment', {
      paymentUrl: url,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../design/image/ic_back.png')}
            style={styles.imgBack}
          />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Thông tin khóa học</Text>
      </View>
      <View style={styles.top}>
        <View style={styles.banner}>
          <Image source={{ uri: img }} style={styles.imgBanner} />
          <Text style={styles.nameCourse}>{name}</Text>
        </View>
        <View style={styles.infoTeacher}>
          <Image
            source={{ uri: teacherID?.avatar }}
            style={styles.avatarTeacher}
          />
          <Text style={styles.nameTeacher}>{teacherName}</Text>
        </View>
        <View style={styles.infoCourse}>
          <Text style={styles.txtInfo}>Số bài học 7 quiz & 2 Video</Text>
          <Text style={styles.txtInfo}>Giá: {courseData.price} VND</Text>
        </View>
        <View style={styles.data_container}>
          <TouchableOpacity>
            <View style={styles.column}>
              <Text style={styles.txt_number}>99 học sinh</Text>
              <Text style={styles.title}>Đã tham gia</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.column}>
            <Text style={styles.txt_number}>
              {averageRating
                ? `${parseFloat(averageRating).toFixed(1)} ⭐`
                : '0 ⭐'}
            </Text>
            <Text style={styles.title}>Đánh giá</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.txt_number}>
              {countFeedback ? countFeedback : '0'}
            </Text>
            <Text style={styles.title}>Nhận xét</Text>

            <TouchableOpacity onPress={handleNavigateToReview}>
              <Text style={styles.viewReviewsButton}>Xem đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line} />
        {/* Mô tả cuộn được */}
        <View style={styles.describe}>
          <ScrollView nestedScrollEnabled={true} style={styles.scrollDescribe}>
            <Text style={styles.txt_describe}>{describe}</Text>
          </ScrollView>
        </View>
      </View>

      {/* Nút Tham gia ngay */}
      <View style={styles.button}>
        <TouchableOpacity
          style={styles.btn_container}
          onPress={onJoinCoursePress}>
          <Text style={styles.txtBtn}>
            {isJoinedCourse ? 'Bắt đầu' : 'Tham gia ngay'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailScreen;


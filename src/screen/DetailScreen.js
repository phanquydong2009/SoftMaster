import {
  StyleSheet,
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

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { courseId, userID } = route.params; 

  console.log("Course ID nhận được là:", courseId);
  console.log("User ID nhận được là:", userID);

  const [courseData, setCourseData] = useState(null); 
  const [averageRating, setAverageRating] = useState(null); 
  const [countFeedback, setCountFeedback] = useState(null); 
  
  const handleNavigateToReview = () => {
    navigation.navigate('ReviewCourse', { courseId, userID });
  };

  const isJoinedCourse = courseData?.isJoinedCourse;

  const fetchCourseDetail = useCallback(async () => {
    if (!userID) {
      Alert.alert('Lỗi', 'Không tìm thấy User ID');
      return;
    }

    try {
      // Gọi API lấy thông tin chi tiết khóa học
      const courseResponse = await fetch(
        `${BASE_URL}/course/getDetailByCourseID/${courseId}/?userID=${userID}`,
      );

      if (!courseResponse.ok) {
        throw new Error('Error fetching course detail');
      }
      
      const courseData = await courseResponse.json();
      setCourseData(courseData);
    } catch (error) {
      console.error('Error fetching course detail:', error);
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
          throw new Error('Error fetching average rating');
        }
        const ratingData = await ratingResponse.json();
        setAverageRating(ratingData.averageRating);

        const feedbackResponse = await fetch(
          `${BASE_URL}/feedbackCourse/countFeedbackByCourseID/${courseId}`,
        );

        if (!feedbackResponse.ok) {
          throw new Error('Error fetching feedback count');
        }
        const feedbackData = await feedbackResponse.json();
        setCountFeedback(feedbackData.count);
      } catch (error) {
        console.error('Error fetching course details or feedback:', error);
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
        <Text>Loading...</Text>
      </View>
    );
  }

  const { name, img, describe, teacherID } = courseData;
  const teacherName = teacherID ? teacherID.name : 'Unknown Teacher';

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
        {/* Scrollable description */}
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

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
    marginTop: 10,
  },
  txtBtn: {
    color: '#FFFFFF',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
  },
  btn_container: {
    backgroundColor: '#0961F5',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 20,
  },
  line: {
    width: '90%',
    height: 2,
    backgroundColor: '#C5DAFB',
    marginHorizontal: 20,
  },
  describe: {
    height: 180,
    marginHorizontal: 10,
    marginTop: 10,
  },
  scrollDescribe: {
    paddingHorizontal: 10,
  },
  txt_describe: {
    color: '#202244',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
    textAlign: 'justify',
  },
  txt_number: {
    color: '#202244',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 18,
  },
  title: {
    color: '#545454',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 17,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  data_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },
  txtInfo: {
    fontSize: 19,
    color: '#0961F5',
    fontFamily: 'Mulish-ExtraBold',
    marginVertical: 5,
  },
  infoCourse: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginTop: 10,
    justifyContent: 'flex-start',
  },
  nameTeacher: {
    fontSize: 19,
    color: '#202244',
    fontFamily: 'Mulish-Bold',
    marginHorizontal: 20,
  },
  avatarTeacher: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoTeacher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
  },
  nameCourse: {
    fontSize: 20,
    color: '#202244',
    fontFamily: 'Mulish-ExtraBold',
    marginVertical: 10,
    textAlign: 'center',
  },
  imgBanner: {
    width: '100%',
    height: 180,
    borderRadius: 20,
  },
  banner: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  txtHeader: {
    color: '#0D0D0D',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 20,
    paddingLeft: 20,
  },
  imgBack: {
    width: 30,
    height: 20,
  },
  top: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F9FF',
  },
});

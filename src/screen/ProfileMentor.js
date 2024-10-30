import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import BASE_URL from '../component/apiConfig';

const ProfileMentor = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { _id } = route.params; // Teacher ID
  const userId = route.params.userId; // User ID from SignInScreen

  const [mentor, setMentor] = useState(null);
  const [followerCount, setFollowerCount] = useState(null);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [isCourses, setIsCourses] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseCount, setCourseCount] = useState(0);
  const [noCoursesMessage, setNoCoursesMessage] = useState("");

  // Hàm theo dõi giảng viên
  const handleFollow = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/followTeacher/follow/${userId}`, {
        teacherID: _id,
      });
      if (response.data.success) {
        Alert.alert("Thành công", "Bạn đã theo dõi giảng viên thành công!");
        setFollowerCount(prevCount => prevCount + 1); // Tăng số người theo dõi
      } else {
        Alert.alert("Thất bại", "Không thể theo dõi giảng viên.");
      }
    } catch (error) {
      console.error('Error following mentor:', error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi theo dõi.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorResponse, followerResponse, courseCountResponse] = await Promise.all([
          axios.get(`${BASE_URL}/teacher/getTeacherByID/${_id}`),
          axios.get(`${BASE_URL}/followTeacher/getFollowerCount/${_id}`),
          axios.get(`${BASE_URL}/course/getCourseCountByTeacher/${_id}`)
        ]);

        setMentor(mentorResponse.data);
        setFollowerCount(followerResponse.data.followerCount);
        setCourseCount(courseCountResponse.data.courseCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [_id]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setNoCoursesMessage("");
      try {
        if (isCourses) {
          const response = await axios.get(`${BASE_URL}/course/getCourseByTeacherID/${_id}`);

          if (Array.isArray(response.data) && response.data.length > 0) {
            const courseData = response.data.map(course => ({
              id: course._id,
              image: { uri: course.img },
              nameCourse: course.name,
              nameLesson: course.describe,
              quiz: `${course.price} VNĐ`,
              rate: '0 đánh giá',
              student: '0 học viên',
            }));
            setData(courseData);
          } else {
            setData([]); // Không có khóa học
            setNoCoursesMessage("Chưa có khóa học nào");
          }
        } else {
          const response = await axios.get(`${BASE_URL}/feedbackCourse/getAll`);
          if (Array.isArray(response.data)) {
            const feedbackData = response.data.flatMap(course =>
              course.feedbacks.map(feedback => ({
                id: feedback._id,
                name: feedback.user ? feedback.user.name : 'Unknown User',
                img: feedback.user && feedback.user.avatar ? { uri: feedback.user.avatar } : require('../design/image/noprofile.png'),
                rating: feedback.feedbackDetail ? feedback.feedbackDetail.rating : 0,
                comment: feedback.feedbackDetail ? feedback.feedbackDetail.content : 'No comment',
                love: '0',
                createdAt: feedback.feedbackDetail ? new Date(feedback.feedbackDetail.createdAt).toLocaleDateString() : 'Unknown date',
              }))
            );
            setData(feedbackData);
            setFeedbackCount(feedbackData.length);
          } else {
            console.error('Expected array but got:', response.data);
            setData([]);
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [isCourses, _id]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddReview = () => {
    navigation.navigate('ReviewScreen');
  };

  const handleButtonPress = isCoursesButton => {
    setIsCourses(isCoursesButton);
  };

  const renderItem = ({ item }) => (
    <View style={styles.detailItem}>
      {isCourses ? (
        <>
          <Image source={item.image} style={styles.detailImage} />
          <View style={styles.detailContent}>
            <Text style={styles.detailNameCourse}>{item.nameCourse}</Text>
            <Text style={styles.detailNameLesson} numberOfLines={1} ellipsizeMode="tail">
              {item.nameLesson}
            </Text>
            <Text style={styles.detailQuiz}>{item.quiz}</Text>
            <View style={styles.rate_container}>
              <Text style={styles.detailRate}>{item.rate}</Text>
              <Text style={styles.detailRate}>|</Text>
              <Text style={styles.detailStudent}>{item.student}</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <Image
            source={item.img ? item.img : require('../design/image/noprofile.png')}
            style={styles.avatarUser}
          />
          <View style={styles.voteContent}>
            <View style={styles.user}>
              <Text
                style={styles.nameUser}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.name}
              </Text>
              <View style={styles.viewrate}>
                <Text style={styles.voteRate}>⭐</Text>
                <Text style={styles.voteRate}>{item.rating}</Text>
              </View>
            </View>
            <Text style={styles.voteComment}>{item.comment}</Text>
            <View style={styles.voteInfo}>
              <Text style={styles.voteLove}>❤️ {item.love}</Text>
              <Text style={styles.voteDay}>{item.createdAt}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!mentor) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy thông tin giảng viên.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.btnBack}>
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={require('../design/image/ic_back.png')}
            style={styles.imgBack}
          />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>{mentor.name}</Text>
      </View>
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: mentor.avatar }} style={styles.avatarMentor} />
        </View>
      </View>
      <View style={styles.name_container}>
        <Text style={styles.txtName}>{mentor.name}</Text>
        <Text style={styles.txtCourse}>{mentor.major}</Text>
      </View>
      <View style={styles.follow_container}>
        <View style={styles.column_item}>
          <Text style={styles.item_numberCourse}>{courseCount}</Text>
          <Text style={styles.item_title}>Khóa học</Text>
        </View>
        <View style={styles.column_item}>
          <Text style={styles.item_numberFL}>
            {followerCount !== null ? followerCount : 'Đang tải...'}
          </Text>
       
            <Text style={styles.txt_follow}>Theo dõi</Text>
       
        </View>
        <View style={styles.column_item}>
          <Text style={styles.item_numberFeedback}>{feedbackCount}</Text>
          <Text style={styles.item_title}>Đánh giá</Text>
        </View>
      </View>
      <View style={styles.bio}>
        <Text style={styles.txtbio}>{mentor.slogan}</Text>
      </View>
      <View style={styles.btnFollow_container}>
      <TouchableOpacity style={styles.btn_follow} onPress={handleFollow}>
          <Text style={styles.txt_follow}>Theo dõi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn_mess}>
          <Text style={styles.txt_mess}>Nhắn tin</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.btnrate_container}>
          <TouchableOpacity
            onPress={() => handleButtonPress(true)}
            style={[styles.btn, isCourses && styles.btnActive]}>
            <Text style={[styles.txtActive, !isCourses && styles.txtInactive]}>
              Khóa học
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleButtonPress(false)}
            style={[styles.btn, !isCourses && styles.btnActive]}>
            <Text style={[styles.txtActive, isCourses && styles.txtInactive]}>
              Đánh giá
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.flatList}
          style={{ width: '99%', margin: 10 }}
          ListEmptyComponent={<Text style={styles.emptyMessage}>{noCoursesMessage}</Text>}
        />
      </View>
      {/* Floating Button */}
      {!isCourses && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleAddReview}>
          <Image
            source={require('../design/image/ic_add.png')}
            style={styles.floatingIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileMentor;


const styles = StyleSheet.create({
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0961F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
  flatListContent: {
    paddingBottom: 50,
  },
  voteContent: {
    flex: 1,
    paddingVertical: 20,

  },
  voteRate: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
    color: '#202244',
  },
  user: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 15,
  },
  viewrate: {
    flexDirection: 'row',
    width: 70,
    height: 30,
    borderRadius: 50,
    borderColor: '#4D81E5',
    borderWidth: 2,
    backgroundColor: '#E8F1FF',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  nameUser: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 20,
    color: 'black',
    width: '70%',
  },
  voteComment: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
    color: '#545454',
    marginVertical: 10,
  },
  voteInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  voteLove: {
    fontFamily: 'Mulish-Bold',
    fontSize: 14,
    color: '#202244',
    marginRight: 10,
  },
  voteDay: {
    fontFamily: 'Mulish-Bold',
    fontSize: 14,
    color: 'black',
  },

  btnrate_container: {
    flexDirection: 'row',
  },
  rate_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  list: {
    marginTop: 10,
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailImage: {
    width: 140,
    height: 140,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 15,
  },
  detailContent: {
    flex: 1,
  },
  detailNameCourse: {
    fontFamily: 'Mulish-Bold',
    fontSize: 13,
    color: '#FF6B00',
    marginBottom: 5,
  },
  detailNameLesson: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
    color: '#202244',
    marginBottom: 5,
    width: '90%',
  },
  detailQuiz: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 17,
    color: '#0961F5',
    marginBottom: 5,
  },
  detailRate: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
    color: '#202244',
    marginBottom: 5,
    marginLeft: 10,
  },
  detailStudent: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
    color: '#202244',
    marginBottom: 5,
    marginLeft: 10,
  },
  txtCourses: {
    color: '#FFFFFF',
    fontFamily: 'Mulish-Bold',
    fontSize: 15,
  },
  txtVote: {
    color: '#000000',
    fontFamily: 'Mulish-Bold',
    fontSize: 15,
  },
  txt_follow: {
    color: '#202244',
    fontSize: 17,
    fontFamily: 'Mulish-Bold',
  },
  txt_mess: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Mulish-Bold',
  },

  btn_follow: {
    width: 130,
    height: 50,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderColor: '#B4BDC4',
    borderWidth: 1,
  },
  btn_mess: {
    width: 130,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#0961F5',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFollow_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 20,
  },
  btnActive: {
    backgroundColor: '#0961F5',
  },
  btnInactive: {
    backgroundColor: '#E8F1FF',
  },
  txtActive: {
    color: '#FFFFFF',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
  },
  txtInactive: {
    color: '#000000',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
  },
  btnBack: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 15,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  body: {
    flex: 2,
    backgroundColor: '#E8F1FF',
    alignItems: 'center',
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
    marginRight: 10,
  },
  name_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtName: {
    color: '#202244',
    fontSize: 23,
    fontFamily: 'Mulish-ExtraBold',
  },
  txtCourse: {
    color: '#202244',
    fontSize: 15,
    fontFamily: 'Mulish-ExtraBold',
  },
  follow_container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 15,
  },
  column_item: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  txtbio: {
    color: '#black',
    fontSize: 13,
    fontFamily: 'Mulish-Bold',
  },
  item_numberFeedback: {
    color: '#202244',
    fontSize: 16,
    fontFamily: 'Mulish-ExtraBold',
  },
  item_numberCourse: {
    color: '#202244',
    fontSize: 16,
    fontFamily: 'Mulish-ExtraBold',
  },
  item_numberFL: {
    color: '#202244',
    fontSize: 16,
    fontFamily: 'Mulish-ExtraBold',
  },
  item_title: {
    color: '#202244',
    fontSize: 13,
    fontFamily: 'Mulish-ExtraBold',
  },
  avatarWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMentor: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarUser: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
  },
});

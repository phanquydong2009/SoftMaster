import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

// data khóa học
const courseDetails = [
  {
    id: '1',
    image: require("../design/image/course5.jpg"),
    nameCourse: 'Thiết kế đồ họa',
    nameLesson: 'Graphic Design Advanced',
    quiz: '10 quiz & 1 Video',
    rate: '4.5',
    student: '1000 học viên'
  },

  {
    id: '2',
    image: require("../design/image/course6.jpg"),
    nameCourse: 'Thiết kế đồ họa',
    nameLesson: 'Advertisement Design',
    quiz: '8 quiz & 2 Video',
    rate: '4.0',
    student: '850 học viên'
  },
  {
    id: '3',
    image: require("../design/image/course5.jpg"),
    nameCourse: 'Phát triển Web',
    nameLesson: 'Web development concepts',
    quiz: '12 quiz & 1 Video',
    rate: '4.7',
    student: '1200 học viên'
  },
];

const ProfileMentor = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { _id } = route.params;

  const [mentor, setMentor] = useState(null);
  const [followerCount, setFollowerCount] = useState(null);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [isCourses, setIsCourses] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [courseCount, setCourseCount] = useState(0); // Thêm state cho courseCount
  // Lấy dữ liệu giảng viên từ API
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/teacher/getTeacherByID/${_id}`);
        setMentor(response.data);
        setData(isCourses ? courseDetails : []);
      } catch (error) {
        console.error('Error fetching mentor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [_id, isCourses]);

  // Gọi API để lấy followerCount
  useEffect(() => {
    const fetchFollowerCount = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/followTeacher/getFollowerCount/${_id}`);
        setFollowerCount(response.data.followerCount);
      } catch (error) {
        console.error('Error fetching follower count:', error);
      }
    };
    fetchFollowerCount();
  }, [_id]);

  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/getAll`);
        setUsers(response.data); // Lưu danh sách người dùng
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Gọi API để lấy đánh giá khóa học
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/feedbackCourse/getAll`);
        const feedbackData = response.data.flatMap(course => 
          course.feedbacks.map(feedback => {
            const user = users.find(user => user._id === feedback.userID); // Tìm thông tin người dùng

            return {
              id: feedback._id,
              name: user ? user.name : 'Unknown User', 
              img: user && user.avatar ? { uri: user.avatar } : require('../design/image/noprofile.png'), 
              rating: feedback.feedbackDetail ? feedback.feedbackDetail.rating : 0,
              comment: feedback.feedbackDetail ? feedback.feedbackDetail.content : 'No comment',
              love: '0', // giả sử bạn không có dữ liệu về số lượt thích
              createdAt: feedback.feedbackDetail ? new Date(feedback.feedbackDetail.createdAt).toLocaleDateString() : 'Unknown date', 
              updatedAt: feedback.feedbackDetail ? new Date(feedback.feedbackDetail.updatedAt).toLocaleDateString() : 'Unknown date', 
            };
          })
        );

        setData(feedbackData); // Cập nhật data với feedbackData đã xử lý
        setFeedbackCount(feedbackData.length); // Cập nhật số lượng feedback
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    if (!isCourses) {
      fetchFeedback();
    }
  }, [_id, isCourses, users]);

    // Gọi API để lấy số lượng khóa học của giảng viên
    useEffect(() => {
      const fetchCourseCount = async () => {
        try {
          const response = await axios.get(`http://192.168.1.4:3001/course/getCourseCountByTeacher/${_id}`);
          setCourseCount(response.data.courseCount); // Cập nhật courseCount
        } catch (error) {
          console.error('Error fetching course count:', error);
        }
      };
      fetchCourseCount();
    }, [_id]);
//chuyển trang 
  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddReview = () => {
    navigation.navigate('ReviewScreen');
  };

  const handleButtonPress = (isCoursesButton) => {
    setIsCourses(isCoursesButton);
    setData(isCoursesButton ? courseDetails : data); 
  };

  const renderItem = ({ item }) => (
    <View style={styles.detailItem}>
      {isCourses ? (
        <>
          <Image source={item.image} style={styles.detailImage} />
          <View style={styles.detailContent}>
            <Text style={styles.detailNameCourse}>{item.nameCourse}</Text>
            <Text style={styles.detailNameLesson} numberOfLines={1} ellipsizeMode='tail'>
              {item.nameLesson}
            </Text>
            <Text style={styles.detailQuiz}>{item.quiz}</Text>
            <View style={styles.rate_container}>
              <Text style={styles.detailRate}>⭐ {item.rate}</Text>
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
              <Text style={styles.nameUser} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
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
          <Image source={require('../design/image/ic_back.png')} style={styles.imgBack} />
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
          <Text style={styles.item_numberFL}>{followerCount !== null ? followerCount : 'Đang tải...'}</Text>
          <Text style={styles.item_title}>Theo dõi</Text>
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
        <TouchableOpacity style={styles.btn_follow}>
          <Text style={styles.txt_follow}>Theo dõi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn_mess}>
          <Text style={styles.txt_mess}>Nhắn tin</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.btnrate_container}>
          <TouchableOpacity onPress={() => handleButtonPress(true)} style={[styles.btn, isCourses && styles.btnActive]}>
            <Text style={[ styles.txtActive, !isCourses && styles.txtInactive]}>Khóa học</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonPress(false)} style={[styles.btn, !isCourses && styles.btnActive]}>
            <Text style={[styles.txtInactive, !isCourses && styles.txtActive]}>Đánh giá</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style = {{width : '100%', marginVertical : 10}}
        />
      </View>
      {/* Floating Button */}
      {!isCourses && (
        <TouchableOpacity style={styles.floatingButton} onPress={handleAddReview}>
          <Image source={require('../design/image/ic_add.png')} style={styles.floatingIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileMentor;


const styles = StyleSheet.create({
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
    paddingBottom: 50
  },
  voteContent: {
    flex: 1,
    paddingVertical: 20
  },
  voteRate: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
    color: '#202244',

  },
  user: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 15

  },
  viewrate: {
    flexDirection: "row",
    width: 70,
    height: 30,
    borderRadius: 50,
    borderColor: '#4D81E5',
    borderWidth: 2,
    backgroundColor: "#E8F1FF",
    alignItems :"center",
    justifyContent:'space-evenly'


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
    marginVertical: 10

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
    flexDirection: "row"
  },
  rate_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: "center",
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
    color: "#FFFFFF",
    fontFamily: "Mulish-Bold",
    fontSize: 15,
  },
  txtVote: {
    color: "#000000",
    fontFamily: "Mulish-Bold",
    fontSize: 15,
  },
  txt_follow: {
    color: "#202244",
    fontSize: 17,
    fontFamily: 'Mulish-Bold'
  },
  txt_mess: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: 'Mulish-Bold'
  },

  btn_follow: {
    width: 130,
    height: 50,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: "center",
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
    alignItems: "center",

  },
  btnFollow_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 10

  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    height: 48,
    borderRadius: 20,
  },
  btnActive: {
    backgroundColor: "#0961F5",
  },
  btnInactive: {
    backgroundColor: "#E8F1FF",
  },
  txtActive: {
    color: "#FFFFFF",
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
  },
  txtInactive: {
    color: "#000000",
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
  },
  btnBack: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center'
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
    flexDirection: "row",
    justifyContent: 'space-evenly',
    alignItems: "center",
    marginVertical: 15,
  },
  column_item: {
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: 'space-between',
  },
  bio: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  item_numberCourse : {
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
    marginHorizontal: 10
  },

});


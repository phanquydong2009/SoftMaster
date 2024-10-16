import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { useNavigation, useRoute } from '@react-navigation/native';

const DetailScreen = () => {
  const navigation = useNavigation(); // Hook điều hướng
  const route = useRoute(); // Hook để lấy thông tin từ route
  const { courseId } = route.params; // Lấy courseId từ params

  const [courseData, setCourseData] = useState(null); // State để lưu dữ liệu khóa học
  const [averageRating, setAverageRating] = useState(null); // State để lưu đánh giá trung bình
  const [countFeedback, setCountFeedback] = useState(null); // State để lưu số lượng feedback
  const handleNavigateToReview = () => {
    navigation.navigate('ReviewCourse', { courseId });
  };
  // Gọi API 
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Gọi API lấy thông tin chi tiết khóa học
        const courseResponse = await fetch(`http://192.168.1.4:3001/course/getDetailByCourseID/${courseId}`);
        const courseData = await courseResponse.json();
        setCourseData(courseData);

        // Gọi API lấy đánh giá trung bình của khóa học
        const ratingResponse = await fetch(`http://192.168.1.4:3001/feedbackCourse/averageRatingByCourseID/${courseId}`);
        const ratingData = await ratingResponse.json();
        setAverageRating(ratingData.averageRating); // Lưu dữ liệu đánh giá trung bình

        // Gọi API lấy số lượng feedback của khóa học
        const feedbackResponse = await fetch(`http://192.168.1.4:3001/feedbackCourse/countFeedbackByCourseID/${courseId}`);
        const feedbackData = await feedbackResponse.json();
        setCountFeedback(feedbackData.count); // Lưu dữ liệu số lượng feedback
      } catch (error) {
        console.error("Error fetching course details or feedback:", error);
      }
    };

    fetchCourseDetails(); // Gọi hàm lấy dữ liệu
  }, [courseId]); // Chỉ gọi lại khi courseId thay đổi

  // Nếu dữ liệu khóa học chưa được tải, hiển thị Loading
  if (!courseData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Destructure dữ liệu để sử dụng
  const { name, img, describe, teacherID } = courseData;
  const teacherName = teacherID ? teacherID.name : "Unknown Teacher";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../design/image/ic_back.png")} style={styles.imgBack} />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Thông tin khóa học</Text>
      </View>
      <View style={styles.top}>
        <View style={styles.banner}>
          <Image source={{ uri: img }} style={styles.imgBanner} />
          <Text style={styles.nameCourse}>{name}</Text>
        </View>
        <View style={styles.infoTeacher}>
          <Image source={{ uri: teacherID?.avatar }} style={styles.avatarTeacher} />
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
              {averageRating ? `${parseFloat(averageRating).toFixed(1)} ⭐` : '0 ⭐'}
            </Text>
            <Text style={styles.title}>Đánh giá</Text>
          </View>

          <View style={styles.column}>

            <Text style={styles.txt_number}>{countFeedback ? countFeedback : '0'}</Text>
            <Text style={styles.title}>Nhận xét</Text>


            <TouchableOpacity onPress={handleNavigateToReview}>
              <Text style={styles.viewReviewsButton}>Xem đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line}></View>
        {/* Scrollable description */}
        <View style={styles.describe}>
          <ScrollView nestedScrollEnabled={true} style={styles.scrollDescribe}>
            <Text style={styles.txt_describe}>
              {describe}
            </Text>
          </ScrollView>
        </View>
      </View>

      {/* Nút Tham gia ngay */}
      <View style={styles.button}>
        <TouchableOpacity style={styles.btn_container}>
          <Text style={styles.txtBtn}>Tham gia ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
    marginTop: 10
  },
  txtBtn: {
    color: "#FFFFFF",
    fontFamily: "Mulish-ExtraBold",
    fontSize: 16,
  },
  btn_container: {
    backgroundColor: "#0961F5",
    justifyContent: "center",
    alignItems: 'center',
    height: 50,
    borderRadius: 20
  },
  line: {
    width: '90%',
    height: 2,
    backgroundColor: '#C5DAFB',
    marginHorizontal: 20
  },
  describe: {
    height: 180,
    marginHorizontal: 10,
    marginTop: 10
  },
  scrollDescribe: {
    paddingHorizontal: 10,
  },
  txt_describe: {
    color: "#202244",
    fontFamily: "Mulish-ExtraBold",
    fontSize: 16,
    textAlign: "justify",

  },
  txt_number: {
    color: "#202244",
    fontFamily: "Mulish-ExtraBold",
    fontSize: 18,
  },
  title: {
    color: "#545454",
    fontFamily: "Mulish-ExtraBold",
    fontSize: 17,
  },
  column: {
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: 'center'
  },
  data_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15
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
    justifyContent: "flex-start"
  },
  nameTeacher: {
    fontSize: 19,
    color: '#202244',
    fontFamily: 'Mulish-Bold',
    marginHorizontal: 20
  },
  avatarTeacher: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoTeacher: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 20
  },
  nameCourse: {
    fontSize: 20,
    color: '#202244',
    fontFamily: 'Mulish-ExtraBold',
    marginVertical: 10,
    textAlign: "center"
  },
  imgBanner: {
    width: '100%',
    height: 180,
    borderRadius: 20
  },
  banner: {
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
  top: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5F9FF",
  },
});

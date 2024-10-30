import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import BASE_URL from '../component/apiConfig';

const ReviewCourseScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseId, userID } = route.params;
  const [reviews, setReviews] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/feedbackCourse/getFeedbackByCourseID/${courseId}`);
      const feedbackData = await response.json();

      if (!Array.isArray(feedbackData)) {
        setReviews([]);
        return;
      }

      const feedbacksWithUser = await Promise.all(
        feedbackData.map(async feedback => {
          const userResponse = await fetch(`${BASE_URL}/user/getUserByID/${feedback.userID}`);
          const userData = await userResponse.json();
          return { ...feedback, userName: userData.name };
        })
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
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => {
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

  const handleStarPress = index => {
    setSelectedStars(index + 1);
  };

  const handleSubmitReview = async () => {
    // Kiểm tra xem userID và courseId có hợp lệ không
    if (!userID || !courseId) {
        console.error('User ID hoặc Course ID không hợp lệ', { userID, courseId });
        return; // Thoát nếu không hợp lệ
    }

    // Tạo URL với userID và courseId
    const feedbackUrl = `http://192.168.1.3:3001/feedbackCourse/feedback/${userID}/${courseId}`;

    console.log(`Calling API: ${feedbackUrl}`); // Log URL để kiểm tra

    try {
        const response = await fetch(feedbackUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rating: selectedStars || 5, // Sử dụng số sao đã chọn, nếu không có thì mặc định là 5
                content: comment || "Bài học hấp dẫn.", // Sử dụng nội dung đã nhập, nếu không có thì sử dụng nội dung mẫu
            }),
        });

        if (response.ok) {
            console.log('Feedback submitted successfully'); // Xác nhận gửi feedback thành công
            setModalVisible(false); // Đóng modal sau khi gửi đánh giá thành công
            setComment(''); // Reset nội dung đánh giá
            setSelectedStars(0); // Reset số sao đã chọn
            fetchFeedbacks(); // Tải lại các đánh giá
        } else {
            console.error('Failed to submit feedback', await response.text()); // Log lỗi từ response
        }
    } catch (error) {
        console.error('Error submitting feedback:', error); // Log lỗi nếu có
    }
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
        <TouchableOpacity style={styles.btnViewAllReview} onPress={() => setModalVisible(true)}>
          <Text style={styles.txtViewAllReview}>Viết đánh giá</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.formReview}>
            <Text style={styles.txt_titleReview}>Thêm đánh giá của bạn!</Text>
            <View style={styles.rate_container}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                  <Image
                    source={
                      selectedStars > index
                        ? require('../design/image/ic_star_filled.png')
                        : require('../design/image/ic_star_outline.png')
                    }
                    style={[styles.star, { tintColor: selectedStars > index ? '#F2CA3D' : '#474953' }]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              placeholder="Viết đánh giá của bạn"
              style={styles.input}
              multiline={true}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
              <Text style={styles.submitText}>Gửi đánh giá</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewCourseScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formReview: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  txt_titleReview: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rate_container: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  star: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'red',
    marginTop: 10,
    fontWeight: 'bold',
  },



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
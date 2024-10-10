import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList } from 'react-native'; 
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const ReviewScreen = () => {
  const navigation = useNavigation();
  const [selectedStars, setSelectedStars] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isErrorModalVisible, setErrorModalVisible] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStarPress = (index) => {
    setSelectedStars(index + 1);
  };

  const handleSubmitReview = () => {
    if (selectedStars === 0 || comment.trim() === '') {
      setErrorModalVisible(true);
      return;
    }

    const newReview = {
      stars: selectedStars,
      comment,
      timestamp: new Date(),
    };

    setReviews([...reviews, newReview]);
    setSelectedStars(0);
    setComment('');
    setModalVisible(true);
  };

  const getElapsedTime = (timestamp) => {
    const now = new Date();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 60) return `${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
  };

  const handleHome = () => {
    closeModal();
  };

  const handleViewAllReviews = () => {
    setShowAllReviews(true);
  };

  const reviewsToShow = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Image source={require('../design/image/ic_back.png')} />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Đánh giá</Text>
      </View>

      {!showAllReviews && (
        <View style={styles.formReview}>
          <Text style={styles.txt_titleReview}>Thêm đánh giá của bạn !</Text>
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
        </View>
      )}

      <View style={styles.countReview}>
        <Text style={styles.count_txt}>Đánh giá</Text>
        <View style={styles.count_number}>
          <Text style={styles.count_numberText}>{reviews.length}</Text>
        </View>
      </View>

      <FlatList
        data={reviewsToShow}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewText}>
              {`⭐`.repeat(item.stars)} Người đánh giá
            </Text>
            <Text style={styles.reviewComment}>{item.comment}</Text>
            <Text style={styles.reviewTime}>{getElapsedTime(item.timestamp)}</Text>
          </View>
        )}
        ListFooterComponent={
          !showAllReviews && reviews.length > 2 ? (
            <View style={styles.ViewAll}>
              <TouchableOpacity style={styles.btnViewAllReview} onPress={handleViewAllReviews}>
                <Text style={styles.txtViewAllReview}>Xem thêm đánh giá</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      <Modal 
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Image source={require('../design/image/done.png')} />
          <Text style={styles.modalTitle}>Xin cảm ơn bạn !</Text>
          <Text style={styles.modalMessage}>Bạn đã gửi đánh giá thành công !</Text> 
          <TouchableOpacity onPress={handleHome} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal 
        isVisible={isErrorModalVisible}
        onBackdropPress={closeErrorModal}
        style={styles.errorModal}
      >
        <View style={styles.modalContent}>
          <Image source={require('../design/image/error.png')} />
          <Text style={styles.modalTitle}>Đánh giá thất bại</Text>
          <Text style={styles.modalMessage}>Vui lòng chọn sao và nhập đánh giá của bạn!</Text> 
          <TouchableOpacity onPress={closeErrorModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  ViewAll: {  
    paddingBottom: 20, 
    alignItems: 'center', 
  },
  btnViewAllReview: {
    width: '100%',
    borderRadius: 25,
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: '#99A1CE',
    justifyContent: "center",
    alignItems: "center",
  },
  txtViewAllReview: {
    color: '#0A0C2C',
    fontFamily: "Mulish-ExtraBold",
    fontSize: 20,
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
  countReview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  input: {
    height: 120,
    width: '100%',
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
  },
  star: {
    width: 40,
    height: 40,
    margin: 5,
  },
  txt_titleReview: {
    fontFamily: 'Mulish-ExtraBold',
    color: '#242424',
    fontSize: 16,
    marginBottom: 10,
  },
  rate_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  formReview: {
    padding: 20,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 10,
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
    justifyContent: 'flex-start',
    alignItems :"center",
    marginBottom: 20,
  },
  txtHeader: {
    color: "#0D0D0D",
    fontFamily: "Mulish-ExtraBold",
    fontSize: 20,
    paddingLeft: 20,
},
  review_container: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  reviewItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    borderWidth : 1,
    borderColor :'#99A1CE',
    marginTop : 5
  },
  reviewText: {
    fontSize: 18,
    fontFamily: 'Mulish-Bold',
    color: '#808080',
  },
  reviewComment: {
    fontFamily: 'Mulish-Regular',
    fontSize: 16,
    color: '#242424',
    marginVertical: 20,
  },
  reviewTime: {
    fontSize: 15,
    color: '#808080',
    fontFamily: 'Mulish-Regular',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    alignContent :"center"
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Mulish-ExtraBold',
    color: '#46B25C',
    marginVertical: 10,
  },
  modalMessage: {
    textAlign :"center",
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    fontFamily: 'Mulish-Bold',
  },
  modalButton: {
    backgroundColor: '#000000',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Mulish-ExtraBold',
  },
});

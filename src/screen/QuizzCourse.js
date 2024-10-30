import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const CustomAlert = ({ visible, onClose, message, scoreType }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Image
            source={require('../design/image/chucmung.png')}
            style={styles.modalImage}
          />
          <Text style={styles.modalHeaderText}>Xin chúc mừng</Text>
          <Text style={styles.modalSubText}>
            Chúc mừng bạn đã hoàn thành bài kiểm tra
          </Text>
          <Text style={styles.modalText}>{message} điểm</Text>
          <Text style={styles.modalFooterText}>{scoreType}</Text>

          <TouchableOpacity
            onPress={onClose}
            style={styles.continueButtonDone}>
            <Text style={styles.continueButtonTextDone}>Tiếp theo</Text>
            <Image
              source={require('../design/image/icon_continue.png')}
              style={styles.continueButtonImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const QuizzCourse = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [scoreType, setScoreType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answerCheck, setAnswerCheck] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // Thêm thông báo lỗi
  const navigation = useNavigation();
  const route = useRoute();
  const { _id } = route.params;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://192.168.1.3:3001/question/getRandomQuestions/${_id}`);
        const formattedQuestions = response.data.map((item) => ({
          questionID: item.questionID,
          title: item.title,
          options: item.options.map(option => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [_id]);

  const handlePress = (value) => {
    setSelectedOption(value);
    setErrorMessage('');
  };

  const handleContinue = () => {
    // Kiểm tra nếu không chọn câu trả lời
    if (!selectedOption) {
      setErrorMessage('Vui lòng chọn câu trả lời');
      return;
    }

    const correctOption = questions[currentQuestionIndex].options.find(
      (option) => option.isCorrect
    );

    // Kiểm tra đáp án
    if (selectedOption === correctOption.text) {
      setScore(score + 1);
      setAnswerCheck([...answerCheck, true]);
    } else {
      setAnswerCheck([...answerCheck, false]);
    }

    // Hiện trạng thái đúng/sai cho các lựa chọn
    const isCorrectAnswer = selectedOption === correctOption.text;

    setTimeout(() => {
      // Chuyển sang câu hỏi tiếp theo
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setErrorMessage(''); // Reset error message
      } else {
        // Tính loại điểm
        const averageScore = (score / questions.length) * 10;
        let scoreType;

        // Phân loại điểm
        if (averageScore >= 0 && averageScore < 5) {
          scoreType = 'Yếu';
        } else if (averageScore >= 5 && averageScore < 7) {
          scoreType = 'Trung bình';
        } else if (averageScore >= 7 && averageScore < 8) {
          scoreType = 'Khá';
        } else if (averageScore >= 8 && averageScore <= 10) {
          scoreType = 'Giỏi';
        }

        setModalMessage(`Bạn đã hoàn thành bài tập: ${score}/${questions.length}`);
        setScoreType(scoreType);
        setModalVisible(true);
      }
    }, 1000);
  };


  if (questions.length === 0) return <Text>Đang tải...</Text>;

  const { title, options } = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      {/* View Header */}
      <View style={styles.viewHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../design/image/ic_back.png')} />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Câu hỏi bài tập</Text>
      </View>

      {/* Quizz */}
      <View style={styles.viewQuizz}>
        <View style={styles.lessonNumberContainer}>
          <Text style={styles.lessonNumber}>{currentQuestionIndex + 1}</Text>
        </View>
        <Text style={styles.txtTitle}>{title}</Text>
      </View>

      {/* Quizz Ask */}
      <View style={styles.viewQuizzAsk}>
        {options.map((option) => (
          <TouchableOpacity
            onPress={() => handlePress(option.text)}
            key={option.text}
            style={[styles.innerContainer, {
              borderColor: selectedOption === option.text
                ? '#000000'
                : (answerCheck[currentQuestionIndex] !== undefined
                  ? (answerCheck[currentQuestionIndex] && option.isCorrect ? '#167F71' : !option.isCorrect && selectedOption === option.text ? '#EC2222' : '#e5e5e5')
                  : 'transparent'),
              borderWidth: 1,
            }]}>
            <Image
              source={selectedOption === option.text
                ? require('../design/image/icon_oval2.png')
                : require('../design/image/icon_oval1.png')}
              style={styles.image}
            />
            <Text style={styles.text}>{option.text}</Text>
          </TouchableOpacity>
        ))}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      </View>

      {/* Custom Modal */}
      <CustomAlert
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
        scoreType={scoreType}
      />

      {/* Continue Button */}
      <TouchableOpacity
        onPress={handleContinue}
        style={styles.continueButton}
      >
        <Text style={styles.continueButtonText}>Câu hỏi tiếp theo</Text>
        <Image
          source={require('../design/image/icon_continue.png')}
          style={styles.continueButtonImage}
        />
      </TouchableOpacity>
    </View>
  );
};


export default QuizzCourse;

const styles = StyleSheet.create({


  errorText: {
    color: '#EC2222',
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  txtHeader: {
    marginLeft: 15,
    color: '#202244',
    fontSize: 21,
    fontWeight: '700',
  },
  modalContainer: {
    width: 360,
    height: 490,
    padding: 20,
    backgroundColor: '#F5F9FF',
    borderRadius: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexShrink: 0,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalImage: {
    width: 214,
    height: 192,
    marginBottom: 3,
  },
  modalHeaderText: {
    fontFamily: 'Jost',
    fontSize: 24,
    fontWeight: '600',
    color: '#202244',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubText: {
    fontFamily: 'Mulish',
    fontSize: 14,
    fontWeight: '700',
    color: '#545454',
    textAlign: 'center',
    marginBottom: 10,
    width: 301,
    height: 22,
  },
  modalText: {
    marginTop: 10,
    color: '#EC2222',
    fontFamily: 'Mulish',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalFooterText: {
    color: '#167F71',
    fontFamily: 'Mulish',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
  image: {
    width: 26,
    height: 26,
    marginRight: 20, // Giảm bớt khoảng cách bên phải
  },
  viewQuizzAsk: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#F5F9FF',
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20, // Tăng padding cho các ô câu trả lời
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontFamily: 'Mulish',
    fontSize: 16,
    fontWeight: '700',
  },
  viewQuizz: {
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    height: 120,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  lessonNumber: {
    fontFamily: 'Mulish',
    fontSize: 30,
    fontWeight: '800',
    color: '#000000',
  },
  lessonNumberContainer: {
    marginRight: 10,
    backgroundColor: '#e5e5e5',
    width: 50, height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  txtTitle: {
    fontFamily: 'Mulish-Bold',
    fontSize: 20,
    color: '#202244',
    textAlign: 'center',
    flex: 1,
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  continueButton: {
    backgroundColor: '#3D9CE6',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  continueButtonImage: {
    width: 40,
    height: 40,

  },
  continueButtonDone: {
    backgroundColor: '#3D9CE6',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  continueButtonTextDone: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
});

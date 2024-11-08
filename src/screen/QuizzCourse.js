import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../component/apiConfig';
import CustomAlert from '../component/CustomAlert';
import styles from '../styles/QuizzCourseStyles';

const QuizzCourse = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [scoreType, setScoreType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answerCheck, setAnswerCheck] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  // Lấy testId từ tham số route
  const { testId, userID } = route.params;


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/question/getRandomQuestions/${testId}`);

        const formattedQuestions = response.data.map((item) => ({
          questionID: item.questionID,
          title: item.title,
          options: shuffleArray(item.options.map(option => ({
            text: option.text,
            isCorrect: option.isCorrect,
          }))),
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Lỗi khi lấy câu hỏi:', error);
      }
    };

    fetchQuestions();
  }, [testId]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

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

    setTimeout(() => {
      // Chuyển sang câu hỏi tiếp theo
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setErrorMessage(''); // Reset thông báo lỗi
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

        setScoreType(scoreType);
        setModalVisible(true);
      }
    }, 1000);
  };

  if (questions.length === 0) return <Text>Đang tải...</Text>;

  const { title, options } = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
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
            }]} >
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
        score={score}
        scoreType={scoreType}
        userID={userID}
        testId={testId}
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

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
  } from 'react-native';
  import React, {useState} from 'react';
  import { useNavigation } from '@react-navigation/native';
  const CustomAlert = ({visible, onClose, message}) => {
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}>
        <View style={myStyles.modalBackground}>
          <View style={myStyles.modalContainer}>
            <Image
              source={require('../design/image/chucmung.png')}
              style={myStyles.modalImage}
            />
            <Text style={myStyles.modalHeaderText}>Xin chúc mừng</Text>
            <Text style={myStyles.modalSubText}>
              Chúc mừng bạn đã hoàn thành bài kiểm tra
            </Text>
            <Text style={myStyles.modalText}>{message}</Text>
            <Text style={myStyles.modalFooterText}>Rất tuyệt vời !</Text>
  
            <TouchableOpacity
              onPress={onClose}
              style={myStyles.continueButtonDone}>
              <Text style={myStyles.continueButtonTextDone}>Tiếp theo</Text>
              <Image
                source={require('../design/image/icon_continue.png')}
                style={myStyles.continueButtonImage}
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
    const navigation = useNavigation();
    const handlePress = value => {
      setSelectedOption(value);
    };
  
    const handleContinue = () => {
      const correctOption = questions[currentQuestionIndex].options.find(
        option => option.isCorrect,
      );
      if (selectedOption === correctOption.value) {
        setScore(score + 1);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
        } else {
          setModalMessage(`${score + 1}/${questions.length}`);
          setModalVisible(true);
        }
      } else {
        setModalMessage('Vui lòng chọn đáp án đúng để tiếp tục.');
        setModalVisible(true);
      }
    };
  
    const {question, options} = questions[currentQuestionIndex];
  
    return (
      <View style={myStyles.container}>
        {/* View Header */}
        <View style={myStyles.viewHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../design/image/ic_back.png')} />
          </TouchableOpacity>
          <Text style={myStyles.viewTextHeader}>Phần 1 - Giới thiệu</Text>
        </View>
        {/* Quizz */}
        <View style={myStyles.viewQuizz}>
          <View style={myStyles.lessonNumberContainer}>
            <Text style={myStyles.lessonNumber}>{currentQuestionIndex + 1}</Text>
          </View>
          <Text style={myStyles.txtTitle}>{question}</Text>
        </View>
        {/* Quizz Ask */}
        <View style={myStyles.viewQuizzAsk}>
          {options.map(option => (
            <TouchableOpacity
              onPress={() => handlePress(option.value)}
              key={option.value}
              style={myStyles.innerContainer}>
              <Image
                source={
                  selectedOption === option.value
                    ? require('../design/image/icon_oval2.png')
                    : require('../design/image/icon_oval1.png')
                }
                style={myStyles.image}
              />
              <Text style={myStyles.text}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          style={myStyles.continueButton}>
          <Text style={myStyles.continueButtonText}>Câu hỏi tiếp theo</Text>
          <Image
            source={require('../design/image/icon_continue.png')}
            style={myStyles.continueButtonImage}
          />
        </TouchableOpacity>
  
        {/* Custom Modal */}
        <CustomAlert
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
        />
      </View>
    );
  };
  
  export default QuizzCourse;
  
  const myStyles = StyleSheet.create({
    modalContainer: {
      width: 360,
      height: 490,
      padding: 20,
      backgroundColor: '#F5F9FF',
      borderRadius: 40,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
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
      marginRight: 30,
    },
    viewQuizzAsk: {
      marginTop: 114,
      flex: 1,
      backgroundColor: '#F5F9FF',
    },
    innerContainer: {
      flexDirection: 'row',
      backgroundColor: '#FFF',
      borderRadius: 15,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      width: '100%',
      marginBottom: 10,
    },
    text: {
      color: '#545454',
      fontFamily: 'Mulish',
      fontSize: 16,
      fontWeight: '700',
    },
    viewQuizz: {
      marginTop: 30,
      flexDirection: 'row',
      backgroundColor: '#FFF',
      borderRadius: 15,
      boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.08)',
      height: 111,
      flexShrink: 0,
      alignItems: 'center',
      padding: 10,
    },
    lessonNumberContainer: {
      backgroundColor: '#F5F9FF',
      borderRadius: 23,
      width: 46,
      height: 46,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#E8F1FF',
      marginRight: 10,
    },
    lessonNumber: {
      fontFamily: 'Mulish',
      fontSize: 14,
      fontWeight: '800',
      color: '#000',
    },
    txtTitle: {
      color: '#545454',
      fontFamily: 'Mulish',
      fontSize: 19,
      fontStyle: 'normal',
      fontWeight: '700',
      flex: 1,
    },
    viewTextHeader: {
      marginLeft: 15,
      color: '#202244',
      fontFamily: 'Mulish',
      fontSize: 21,
      fontStyle: 'normal',
      fontWeight: '700',
    },
    viewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 25,
    },
    continueButtonDone: {
      backgroundColor: '#0961F5',
      borderRadius: 30,
      padding: 15,
      marginTop: 20,
      marginBottom: 20,
      width: 286,
      height: 60,
      shadowColor: '#000',
      shadowOffset: {width: 1, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
      flexShrink: 0,
      flexDirection: 'row',
      alignItems: 'center',
    },
    continueButtonTextDone: {
      color: '#FFF',
      fontFamily: 'Mulish',
      fontSize: 16,
      fontWeight: '700',
      flex: 1,
      textAlign: 'center',
    },
    continueButton: {
      backgroundColor: '#0961F5',
      borderRadius: 30,
      padding: 15,
      marginTop: 20,
      marginBottom: 20,
      width: 350,
      height: 60,
      shadowColor: '#000',
      shadowOffset: {width: 1, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
      flexShrink: 0,
      flexDirection: 'row',
      alignItems: 'center',
    },
    continueButtonText: {
      color: '#FFF',
      fontFamily: 'Mulish',
      fontSize: 16,
      fontWeight: '700',
      flex: 1,
      textAlign: 'center',
    },
    continueButtonImage: {
      marginRight: -8,
      width: 48,
      height: 48,
    },
  });
  
  const questions = [
    {
      question:
        'Tại sao bạn nên tùy chỉnh không gian làm việc thiết kế đồ họa của mình?',
      options: [
        {label: 'Để thay đổi màu sắc', value: 'color', isCorrect: false},
        {label: 'Để tiết kiệm thời gian', value: 'time', isCorrect: true},
        {label: 'Để phóng to thanh công cụ', value: 'zoom', isCorrect: false},
        {label: 'Để ẩn công cụ', value: 'hide', isCorrect: false},
      ],
    },
    {
      question: 'Công cụ nào giúp bạn tạo kiểu chữ trong thiết kế đồ họa?',
      options: [
        {label: 'Adobe Photoshop', value: 'photoshop', isCorrect: false},
        {label: 'Adobe Illustrator', value: 'illustrator', isCorrect: true},
        {label: 'CorelDRAW', value: 'coreldraw', isCorrect: false},
        {label: 'Sketch', value: 'sketch', isCorrect: false},
      ],
    },
    {
      question: 'Điều gì làm cho hình ảnh có chất lượng tốt?',
      options: [
        {label: 'Sử dụng định dạng JPEG', value: 'jpeg', isCorrect: false},
        {label: 'Sử dụng độ phân giải cao', value: 'high-res', isCorrect: true},
        {label: 'Giảm kích thước ảnh', value: 'resize', isCorrect: false},
        {label: 'Thay đổi màu sắc', value: 'color-change', isCorrect: false},
      ],
    },
    {
      question: 'Để thiết kế logo, công cụ nào là lựa chọn tốt nhất?',
      options: [
        {label: 'Adobe InDesign', value: 'indesign', isCorrect: false},
        {label: 'Adobe Illustrator', value: 'illustrator', isCorrect: true},
        {label: 'Microsoft Word', value: 'word', isCorrect: false},
        {label: 'GIMP', value: 'gimp', isCorrect: false},
      ],
    },
    {
      question: 'Để tạo một tài liệu PDF, công cụ nào là hữu ích?',
      options: [
        {label: 'Microsoft Excel', value: 'excel', isCorrect: false},
        {label: 'Adobe Acrobat', value: 'acrobat', isCorrect: true},
        {label: 'Google Slides', value: 'slides', isCorrect: false},
        {label: 'Notepad', value: 'notepad', isCorrect: false},
      ],
    },
  ];
  
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import YouTubeIframe from 'react-native-youtube-iframe';
import { useNavigation } from '@react-navigation/native';

const MyCourseDetail = () => {
  const [videoId, setVideoId] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePlay = videoId => {
    setVideoId(videoId);
    setFullScreen(true); // Mở chế độ toàn màn hình khi phát video
  };

  const handleClose = () => {
    setVideoId(null);
    setFullScreen(false); // Đóng chế độ toàn màn hình khi video kết thúc
  };

  const handlePressLesson = (image, videoId) => {
    if (image === require('../design/image/ic_quiz.png')) {
      navigation.navigate('QuizzCourse'); // Điều hướng đến màn hình QuizzCourse
    } else {
      handlePlay(videoId); // Phát video nếu không phải là hình quiz
    }
  };

  const renderItem = ({ item }) => (
    <View style={myStyles.courseSection}>
      <View style={myStyles.headerRow}>
        <View style={myStyles.headerLeft}>
          <Text style={myStyles.sectionNumber}>{item.sectionNumber}</Text>
          <Text style={myStyles.separator}>-</Text>
          <Text style={myStyles.sectionTitle}>{item.sectionTitle}</Text>
        </View>
        <View style={myStyles.headerRight}>
          <Text style={myStyles.duration}>{item.duration}</Text>
        </View>
      </View>
      {item.lessons.map(lesson => (
        <View key={lesson.number} style={myStyles.lessonRow}>
          <View style={myStyles.lessonNumberContainer}>
            <Text style={myStyles.lessonNumber}>{lesson.number}</Text>
          </View>
          <View style={myStyles.lessonContent}>
            <Text
              style={myStyles.lessonTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {lesson.title}
            </Text>
            <Text style={myStyles.lessonDuration}>{lesson.duration}</Text>
          </View>
          <TouchableOpacity
            style={myStyles.playIconContainer}
            onPress={() => handlePressLesson(lesson.image, lesson.videoId)}
          >
            <Image source={lesson.image} style={myStyles.playIcon} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View style={myStyles.container}>
      {/* View Header */}
      <View style={myStyles.viewHeader}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={require('../design/image/ic_back.png')} />
        </TouchableOpacity>
        <Text style={myStyles.viewTextHeader}>Khóa học của tôi</Text>
      </View>
      {/* Button Input */}
      <View style={myStyles.viewInput}>
        <TextInput style={myStyles.input} placeholder="Tìm kiếm..." />
        <TouchableOpacity>
          <Image
            source={require('../design/image/ic_search.png')}
            style={myStyles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      {/* Phần khóa học */}
      <View style={myStyles.flatListContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => `${item.sectionNumber}-${item.number}`}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Video Player */}
      {videoId && (
        <View
          style={[myStyles.videoContainer, fullScreen && myStyles.fullScreen]}>
          <YouTubeIframe
            videoId={videoId}
            height={fullScreen ? Dimensions.get('window').height : 200}
            play={true}
            onChangeState={event => {
              if (event === 'ended') {
                handleClose();
              }
            }}
          />
          <TouchableOpacity style={myStyles.closeButton} onPress={handleClose}>
            <Text style={myStyles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MyCourseDetail;
const myStyles = StyleSheet.create({
  videoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    zIndex: 10,
  },
  fullScreen: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 10,
    zIndex: 11,
  },
  closeText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatListContainer: {
    flex: 1,
    borderRadius  :20,
    backgroundColor: '#F5F9FF',
  },
  courseSection: {
  
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.08)',
    flexShrink: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionNumber: {
    color: '#202244',
    fontFamily: 'Mulish',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '800',
  },
  separator: {
    marginHorizontal: 4,
    fontFamily: 'Mulish',
    fontSize: 14,
    color: '#000',
  },
  sectionTitle: {
    color: '#0961F5',
    fontFamily: 'Mulish',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '800',
  },
  headerRight: {
    justifyContent: 'center',
  },
  duration: {
    color: '#0961F5',
    textAlign: 'right',
    fontFamily: 'Mulish',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '800',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
   
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  lessonNumberContainer: {
    backgroundColor: '#F5F9FF',
    borderRadius: 23,
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderWidth: 2,
    borderColor: '#E8F1FF',
  },
  lessonNumber: {
    fontFamily: 'Mulish',
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
  },
  lessonContent: {
    flex: 1,
    marginLeft: 12,
  },
  lessonTitle: {
    color: '#202244',
    fontFamily: 'Mulish',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '700',
  },
  lessonDuration: {
    color: '#545454',
    fontFamily: 'Mulish',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    marginTop: 4,
  },
  playIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 24,
    height: 24,
  },
  viewInput: {
    marginVertical : 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    height: 55,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
  },
  searchIcon: {
    width: 38,
    height: 38,
  },
  viewTextHeader: {
    marginLeft: 15,
    color: '#202244',
    fontSize: 21,
    fontFamily: 'Mulish',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 21,
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding  :20, 
    backgroundColor: '#F5F9FF',
  },
});

const data = [
  {
    sectionNumber: 'Phần 01',
    sectionTitle: 'Giới thiệu',
    duration: '30 phút',
    lessons: [
      {
        number: '01',
        title: 'Tổng quan về thiết bị',
        duration: '10 Phút',
        image: require('../design/image/ic_quiz.png'),
        videoId: 'dQw4w9WgXcQ', // VideoID ví dụ
      },
      {
        number: '02',
        title: 'Lợi ích của thiết bị',
        duration: '15 Phút',
        image: require('../design/image/icon_play.png'),
        videoId: 'kJQP7kiw5Fk', // VideoID ví dụ
      },
      {
        number: '03',
        title: 'Hướng dẫn sử dụng cơ bản',
        duration: '20 Phút',
        image: require('../design/image/ic_quiz.png'),
        videoId: '3JZ_D3ELwOQ', // VideoID ví dụ
      },
    ],
  },
  {
    sectionNumber: 'Phần 02',
    sectionTitle: 'Khám Phá Cơ Bản',
    duration: '45 phút',
    lessons: [
      {
        number: '01',
        title: 'Khái niệm cơ bản và chức năng',
        duration: '20 Phút',
        image: require('../design/image/icon_play.png'),
        videoId: 'l9I70Wm0Iz8', // VideoID ví dụ
      },
      {
        number: '02',
        title: 'Cài đặt và cấu hình',
        duration: '25 Phút',
        image: require('../design/image/ic_quiz.png'),
        videoId: 'wC1fYl9zTfg', // VideoID ví dụ
      },
    ],
  },
  {
    sectionNumber: 'Phần 03',
    sectionTitle: 'Kỹ Thuật Nâng Cao',
    duration: '60 phút',
    lessons: [
      {
        number: '01',
        title: 'Chiến lược tối ưu hóa',
        duration: '30 Phút',
        image: require('../design/image/icon_play.png'),
        videoId: 'tV5yD98n8DI', // VideoID ví dụ
      },
      {
        number: '02',
        title: 'Tạo ứng dụng nâng cao',
        duration: '30 Phút',
        image: require('../design/image/icon_play.png'),
        videoId: '4GQJ4m6srr4', // VideoID ví dụ
      },
    ],
  },
  {
    sectionNumber: 'Phần 04',
    sectionTitle: 'Ứng Dụng Thực Tế',
    duration: '50 phút',
    lessons: [
      {
        number: '01',
        title: 'Nghiên cứu và phân tích trường hợp',
        duration: '30 Phút',
        image: require('../design/image/icon_play.png'),
        videoId: 'rEEQY0yOObQ', // VideoID ví dụ
      },
      {
        number: '02',
        title: 'Chiến lược triển khai thực tế',
        duration: '20 Phút',
        image: require('../design/image/ic_quiz.png'),
        videoId: 'nPo5x6Hh2Oo', // VideoID ví dụ
      },
    ],
  },
  {
    sectionNumber: 'Phần 05',
    sectionTitle: 'Kết Luận và Đánh Giá',
    duration: '25 phút',
    lessons: [
      {
        number: '01',
        title: 'Tổng kết khóa học và các điểm chính',
        duration: '15 Phút',
        image: require('../design/image/icon_play.png'),
        videoId: 'dxp-hF4XY6Y', // VideoID ví dụ
      },
      {
        number: '02',
        title: 'Đánh giá và phản hồi',
        duration: '10 Phút',
        image: require('../design/image/icon_play.png'),
        videoId: '6hR8cYgkym0', // VideoID ví dụ
      },
    ],
  },
];

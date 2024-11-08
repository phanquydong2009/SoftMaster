import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import YouTubeIframe from 'react-native-youtube-iframe';
import styles from '../styles/DetailLessonStyles';
import BASE_URL from '../component/apiConfig';

const DetailLesson = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { _id, userID } = route.params;
  const [videoData, setVideoData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [videoLink, setVideoLink] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (_id) {
      fetch(`${BASE_URL}/lessonVideo/getLessonVideoByLessonID/${_id}`)
        .then((response) => response.json())
        .then((json) => setVideoData(json))
        .catch((error) => console.error('Lỗi khi lấy dữ liệu video:', error));

      fetch(`${BASE_URL}/test/getTestByLessonID/${_id}`)
        .then((response) => response.json())
        .then((json) => setTestData(json))
        .catch((error) => console.error('Lỗi khi lấy dữ liệu bài kiểm tra:', error));
    }
  }, [_id]);

  const handlePlayVideo = (videoUrl) => {
    const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    setVideoLink(videoId);
    setIsPlaying(true);
  };

  const handleGoToQuiz = (testId) => {
    // Log testId để xác minh
    console.log('Đi tới QuizzCourse với testId:', testId, userID);
  
    // Điều hướng tới QuizzCourse và truyền testId và userID
    navigation.navigate('QuizzCourse', { testId, userID });
  };
  

  const renderVideoItem = ({ item, index }) => {
    const updatedAt = item.updatedAt.split('T')[0];
    return (
      <View style={styles.columnItem}>
        <View style={styles.courseSection}>
          <View style={styles.number_container}>
            <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
          </View>
          <View style={styles.column_text}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <Text style={styles.sectionDay}>{updatedAt}</Text>
          </View>
          <TouchableOpacity onPress={() => handlePlayVideo(item.video)}>
            <Image source={require('../design/image/icon_play.png')} style={styles.icon_quizz} />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  const renderTestItem = ({ item, index }) => {
    const updatedAt = item.updatedAt.split('T')[0];
    return (
      <View style={styles.columnItem}>
        <View style={styles.courseSection}>
          <View style={styles.number_container}>
            <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
          </View>
          <View style={styles.column_text}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <Text style={styles.sectionDay}>{updatedAt}</Text>
          </View>
          <TouchableOpacity onPress={() => handleGoToQuiz(item._id)}>
            <Image source={require('../design/image/ic_quiz.png')} style={styles.icon_quizz} />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Image source={require('../design/image/ic_back.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khóa học của tôi</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput style={styles.input} placeholder="Tìm kiếm..." />
        <TouchableOpacity>
          <Image source={require('../design/image/ic_search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {isPlaying && videoLink ? (
        <View style={{ flex: 1 }}>
          <YouTubeIframe height={300} videoId={videoLink} play={true} />
        </View>
      ) : (
        <>
          {videoData.length === 0 && testData.length === 0 ? (
            <Text style={styles.noLessons}>Bài học chưa được cập nhật từ giáo viên.</Text>
          ) : (
            <>
              {/* Phần Video Bài Học */}
              <Text style={styles.sectionHeader}>Phần Video Bài Học</Text>
              {videoData.length === 0 ? (
                <Text style={styles.noLessons}>Chưa có video bài giảng! Đợi cập nhật từ giảng viên.</Text>
              ) : (
                <View style={[styles.container_list]}>
                  <FlatList
                    data={videoData}
                    renderItem={renderVideoItem}
                    keyExtractor={(item, index) => `${item._id}-video-${index}`}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  />
                </View>
              )}

              {/* Phần Bài Kiểm Tra */}
              <Text style={styles.sectionHeader}>Phần Bài Kiểm Tra</Text>
              {testData.length === 0 ? (
                <Text style={styles.noLessons}>Chưa có bài kiểm tra nào! Đợi cập nhật từ giảng viên.</Text>
              ) : (
                <View style={[styles.container_list]}>
                  <FlatList
                    data={testData}
                    renderItem={renderTestItem}
                    keyExtractor={(item, index) => `${item._id}-test-${index}`}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                  />
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

export default DetailLesson;

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CourseScreen = () => {
  const [selected, setSelected] = useState(1);
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };
  const handlePress = (buttonId) => {
    setSelected(buttonId);
  };
 
  // Chuyển trang đến màn hình chứng chỉ
  const handleViewCert = () => {
    navigation.navigate('Cert');
  };

  // Chuyển trang đến chi tiết khóa học
  const handleViewCourseDetail = () => {
    navigation.navigate('MyCourseDetail');
  };

  const renderItem = ({ item }) => {
    const getProgressBarColor = (width) => {
      const progress = parseFloat(width);
      if (progress < 50) {
        return '#FCCB40'; // Màu vàng
      } else if (progress >= 50 && progress <= 80) {
        return '#FF6B00'; // Màu cam
      } else {
        return '#167F71'; // Màu xanh
      }
    };

    // Kiểm tra trạng thái và áp dụng TouchableOpacity nếu là 'in-progress'
    const Wrapper = item.status === 'in-progress' ? TouchableOpacity : View;

    return (
      <Wrapper
        style={myStyles.viewFlatlist}
        onPress={item.status === 'in-progress' ? handleViewCourseDetail : undefined}
      >
        <Image source={item.image} style={myStyles.image} />
        {item.status === 'complete' && (
          <Image
            source={require('../../design/image/complete_icon.png')}
            style={myStyles.completeIcon}
          />
        )}
        <View style={myStyles.content}>
          <Text style={myStyles.title}>{item.title}</Text>
          {/* Truncate description with ellipsis */}
          <Text style={myStyles.description} numberOfLines={1} ellipsizeMode="tail">
            {item.description}
          </Text>
          <View style={myStyles.info}>
            <View style={myStyles.rating}>
              <Image
                source={require('../../design/image/icon_star.png')}
                style={myStyles.star}
              />
              <Text style={myStyles.ratingText}>{item.rating}</Text>
            </View>
            <Text style={myStyles.separator}>|</Text>
            <View style={myStyles.duration}>
              <Text style={myStyles.durationText}>{item.duration}</Text>
            </View>
          </View>
          {item.status === 'complete' ? (
            <TouchableOpacity style={myStyles.certificateButton} onPress={handleViewCert}>
              <Text style={myStyles.certificateButtonText}>XEM CHỨNG CHỈ</Text>
            </TouchableOpacity>
          ) : (
            <View style={myStyles.progressContainer}>
              <View style={myStyles.progressBarBackground}>
                <View
                  style={[
                    myStyles.progressBar,
                    {
                      width: item.progressWidth,
                      backgroundColor: getProgressBarColor(item.progressWidth),
                    },
                  ]}
                />
              </View>
              <Text style={myStyles.progressText}>{item.progress}</Text>
            </View>
          )}
        </View>
      </Wrapper>
    );
  };

  const filteredData = data.filter(
    (item) => item.status === (selected === 1 ? 'complete' : 'in-progress')
  );

  return (
    <View style={myStyles.container}>
      {/* Header */}
      <View style={myStyles.viewHeader}>
        <TouchableOpacity onPress={handleGoBack} >
          <Image source={require('../../design/image/ic_back.png')} />
        </TouchableOpacity>
        <Text style={myStyles.viewTextHeader}>Khóa học của tôi</Text>
      </View>
      {/* Button Input */}
      <View style={myStyles.viewInput}>
        <TextInput style={myStyles.input} placeholder="Tìm kiếm..." />
        <TouchableOpacity>
          <Image
            source={require('../../design/image/icon_search.png')}
            style={myStyles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      {/* Button Hoàn Thành - Đang Thực Hiện */}
      <View style={myStyles.viewDonePending}>
        <TouchableOpacity
          style={[
            myStyles.button,
            { backgroundColor: selected === 1 ? '#167F71' : '#E8F1FF' },
          ]}
          onPress={() => handlePress(1)}
        >
          <Text
            style={[
              myStyles.buttonText,
              { color: selected === 1 ? '#FFF' : '#202244' },
            ]}
          >
            Hoàn thành
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            myStyles.button,
            { backgroundColor: selected === 2 ? '#167F71' : '#E8F1FF' },
          ]}
          onPress={() => handlePress(2)}
        >
          <Text
            style={[
              myStyles.buttonText,
              { color: selected === 2 ? '#FFF' : '#202244' },
            ]}
          >
            Đang thực hiện
          </Text>
        </TouchableOpacity>
      </View>
      {/* Flatlist Khóa Học */}
      <View style={myStyles.flatListContainer}>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default CourseScreen;

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15,
    backgroundColor: '#F5F9FF',
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent :'flex-start',
    marginVertical: 10,
  },
  viewTextHeader: {
    marginLeft: 15,
    color: '#202244',
    fontSize: 20,
    fontFamily: 'Mulish-ExtraBold',  
  },
  viewInput: {
    marginTop: 10,
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
  viewDonePending: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  flatListContainer: {
    flex: 1,
  },
  viewFlatlist: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  completeIcon: {
    position: 'absolute',
    top: -10,
    right: 10,
    width: 35,
    height: 35,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#FF6B00',
    fontSize: 12,
    fontFamily: 'Mulish-ExtraBold',
    fontStyle: 'normal',
    lineHeight: 20,
  },
  description: {
    color: '#202244',
    fontSize: 16,
    fontFamily: 'Mulish',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 16,
    marginVertical: 5,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    width: 13,
    height: 13,
    marginRight: 5,
  },
  ratingText: {
    fontSize: 15,
    color: '#202244',
    fontFamily: 'Mulish-Bold',
    fontWeight: '400',
    lineHeight: 20,
  },
  separator: {
    color: '#6D7588',
    fontSize: 15,
    marginHorizontal: 8,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 15,
    color: '#202244',
    fontFamily: 'Mulish-Bold',
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:  5,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E8EF',
    marginRight: 30,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,

  },
  progressText: {
    color: '#202244',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight  :10
  },
  certificateButton: {
    flexDirection :"row",
    alignItems :"center",
    justifyContent :"flex-end",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  certificateButtonText: {
    color: '#167F71',
    fontSize: 14,
    fontWeight: 'bold',
  fontStyle :"italic"
  },
});
const data = [
  {
    id: '1',
    image: require('../../design/image/course1.png'),
    title: 'Thiết kế UI/UX',
    description: 'Giới thiệu về Thiết kế UI/UX',
    rating: '4.4',
    duration: '3 giờ 06 phút',
    progress: '93/125',
    progressWidth: '74%',
    status: 'complete', // Chưa hoàn thành
  },
  {
    id: '2',
    image: require('../../design/image/course2.png'),
    title: 'Lập trình React Native',
    description: 'Khóa học về lập trình React Native cơ bản và nâng cao',
    rating: '4.8',
    duration: '2 giờ 45 phút',
    progress: '85/100',
    progressWidth: '85%',
    status: 'in-progress', // Chưa hoàn thành
  },
  {
    id: '3',
    image: require('../../design/image/course3.png'),
    title: 'Xây dựng Website',
    description: 'Khóa học về phát triển và thiết kế website',
    rating: '4.2',
    duration: '4 giờ 30 phút',
    progress: '35/100',
    progressWidth: '35%',
    status: 'in-progress', // Đang thực hiện
  },
  {
    id: '4',
    image: require('../../design/image/course4.png'),
    title: 'Quản lý dự án',
    description: 'Khóa học về quản lý và tổ chức dự án hiệu quả',
    rating: '4.5',
    duration: '3 giờ 15 phút',
    progress: '50/70',
    progressWidth: '71%',
    status: 'in-progress', // Đang thực hiện
  },
  {
    id: '5',
    image: require('../../design/image/course5.png'),
    title: 'Marketing Digital',
    description: 'Khóa học về chiến lược và kỹ thuật marketing trên internet',
    rating: '4.7',
    duration: '2 giờ 30 phút',
    progress: '80/100',
    progressWidth: '80%',
    status: 'in-progress', // Hoàn thành
  },
];
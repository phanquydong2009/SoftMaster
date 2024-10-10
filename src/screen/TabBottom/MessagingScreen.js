import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment'; 

const initialDataMess = [
  {
    avatarUser: require('../../design/image/user3.png'),
    nameUser: 'Lê Văn C',
    numberOfMessages: 5,
    content: 'Chúc mừng bạn đã hoàn thành khóa học. Vui lòng đánh giá chúng tôi và cho chúng tôi biết ý kiến của bạn.',
    time: '20 phút trước',
    status: 'notwatch',
  },
  {
    avatarUser: require('../../design/image/user7.png'),
    nameUser: 'Nguyễn Văn G',
    numberOfMessages: 3,
    content: 'Kế hoạch dự án đã được phê duyệt. Vui lòng chuẩn bị các tài liệu cần thiết và báo cáo tiến độ hàng tuần.',
    time: '3 giờ trước',
    status: 'notwatch',
  },
  {
    avatarUser: require('../../design/image/user1.png'),
    nameUser: 'Nguyễn Văn A',
    numberOfMessages: 2,
    content: 'Chào bạn, có thông tin gì mới không? Hãy cho tôi biết nếu bạn có bất kỳ câu hỏi nào nhé.',
    time: '05/09/2024',
    status: 'notwatch',
  },
  {
    avatarUser: require('../../design/image/user5.png'),
    nameUser: 'Phạm Văn E',
    numberOfMessages: 1,
    content: 'Có một số tài liệu mới được cập nhật trong hệ thống, vui lòng kiểm tra.',
    time: '08/09/2024',
    status: 'notwatch',
  },
  {
    avatarUser: require('../../design/image/user2.png'),
    nameUser: 'Trần Thị B',
    numberOfMessages: 0,
    content: 'Hẹn gặp bạn lúc 3 giờ chiều. Đừng quên mang tài liệu nhé.',
    time: '10 phút trước',
    status: 'watched',
  },
  {
    avatarUser: require('../../design/image/user4.png'),
    nameUser: 'Ngô Thị D',
    numberOfMessages: 0,
    content: 'Thông báo: Cuộc họp đã được chuyển sang ngày mai.',
    time: '30 phút trước',
    status: 'watched',
  },
  {
    avatarUser: require('../../design/image/user6.png'),
    nameUser: 'Vũ Thị F',
    numberOfMessages: 0,
    content: 'Chúng tôi đã nhận được yêu cầu của bạn và sẽ xử lý trong thời gian sớm nhất.',
    time: '2 giờ trước',
    status: 'watched',
  },
];

const parseTime = (timeStr) => {
  const now = moment();

  if (timeStr.includes('phút trước')) {
    const minutes = parseInt(timeStr, 10);
    return now.subtract(minutes, 'minutes');
  }

  if (timeStr.includes('giờ trước')) {
    const hours = parseInt(timeStr, 10);
    return now.subtract(hours, 'hours');
  }

  if (timeStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return moment(timeStr, 'DD/MM/YYYY');
  }

  return now;
};

const MessagingScreen = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(initialDataMess);
  const navigation = useNavigation();

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

 // quay lại
 const handleBack = () => {
  navigation.goBack();
};
  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = initialDataMess.filter(item =>
      item.nameUser.toLowerCase().includes(text.toLowerCase()) ||
      item.content.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);
    return timeB - timeA;
  });

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.avatarContainer}>
        <Image source={item.avatarUser} style={styles.avatar} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.nameUser}>{item.nameUser}</Text>
        <Text
          style={[
            styles.content,
            item.status === 'notwatch' && styles.contentNotWatched,
          ]}
        >
          {item.content.length > 50
            ? `${item.content.substring(0, 50)}...`
            : item.content}
        </Text>
      </View>
      <View style={styles.numberMessagesContainer}>
        {item.numberOfMessages > 0 && item.status === 'notwatch' ? (
          <>
            <Text style={styles.numberMessages}>{item.numberOfMessages}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </>
        ) : (
          <Text style={styles.time}>{item.time}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Image source={require('../../design/image/ic_back.png')} />
        </TouchableOpacity>

        {!isSearchVisible && (
          <View style={styles.txtHeaderContainer}>
            <Text style={styles.txtHeader}>Nhắn tin</Text>
          </View>
        )}
        {isSearchVisible && (
          <View style={[styles.searchContainer, styles.searchContainerExpanded]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#A0A4AB"
              value={searchTerm}
              onChangeText={handleSearch}
            />
          </View>
        )}
        <TouchableOpacity onPress={toggleSearch}>
          <Image source={require('../../design/image/ic_search.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <FlatList
          data={sortedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.nameUser}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  txtHeaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txtHeader: {
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 25,
    color: '#202244',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0961F5',
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    right: 40,
    opacity: 0,
  },
  searchContainerExpanded: {
    width: '77%',
    opacity: 1,
  },
  searchInput: {
    height: '100%',
    fontSize: 16,
    borderWidth: 0,
    flex: 1,
    paddingHorizontal: 5,
  },
  body: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 5,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F9FF',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  nameUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202244',
    marginVertical: 5,
  },
  content: {
    fontSize: 14,
    color: '#000000',
  },
  contentNotWatched: {
    fontWeight: 'bold',
  },
  numberMessagesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width:80, 
  },
  numberMessages: {
    backgroundColor: '#0961F5',
    color: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center', // Đảm bảo văn bản căn giữa theo chiều dọc
  },
  time: {
    fontSize: 12,
    color: '#A0A4AB',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E8F1FF',
    marginVertical: 5,
  },
});

export default MessagingScreen;

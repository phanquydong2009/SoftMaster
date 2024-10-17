import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const DetailScreen = () => {
  const navigation = useNavigation(); // Hook điều hướng

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../design/image/ic_back.png')}
            style={styles.imgBack}
          />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Thông tin khóa học</Text>
      </View>
      <View style={styles.top}>
        <View style={styles.banner}>
          <Image
            source={require('../design/image/webDetail.png')}
            style={styles.imgBanner}
          />
          <Text style={styles.nameCourse}>
            The main web development concepts you should know
          </Text>
        </View>
        <View style={styles.infoTeacher}>
          <Image
            source={require('../design/image/mentor1.png')}
            style={styles.avatarTeacher}
          />
          <Text style={styles.nameTeacher}>Phan Quy Dong</Text>
        </View>
        <View style={styles.infoCourse}>
          <Text style={styles.txtInfo}>Số bài học 7 quiz & 2 Video</Text>
          <Text style={styles.txtInfo}>Giá : 999.999 VND</Text>
        </View>
        <View style={styles.data_container}>
          <View style={styles.column}>
            <Text style={styles.txt_number}>99 học sinh</Text>
            <Text style={styles.title}>Đã tham gia</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.txt_number}>4.5 ⭐</Text>
            <Text style={styles.title}>Đánh giá</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.txt_number}>999</Text>
            <Text style={styles.title}>Nhận xét</Text>
          </View>
        </View>
        <View style={styles.line} />
        {/* Scrollable description */}
        <View style={styles.describe}>
          <ScrollView nestedScrollEnabled={true} style={styles.scrollDescribe}>
            <Text style={styles.txt_describe}>
              Phát triển web là quá trình xây dựng và duy trì các trang web hoặc
              ứng dụng web nhằm phục vụ cho Internet (World Wide Web) hoặc mạng
              nội bộ (mạng riêng). Công việc này liên quan đến nhiều lĩnh vực
              khác nhau, từ thiết kế và phát triển giao diện người dùng (UI/UX),
              xây dựng cấu trúc cơ sở dữ liệu, đến quản lý nội dung và tích hợp
              các tính năng phức tạp như thanh toán trực tuyến, bảo mật, và tối
              ưu hóa tốc độ tải trang. Phát triển web có thể bao gồm nhiều cấp
              độ khác nhau, từ việc xây dựng các trang web đơn giản với văn bản
              thuần túy (HTML, CSS), ....(Xem thêm)
            </Text>
          </ScrollView>
        </View>
      </View>

      {/* Button */}
      <View style={styles.button}>
        <TouchableOpacity
          style={styles.btn_container}
          onPress={() => navigation.navigate('CoursePayment')}>
          <Text style={styles.txtBtn}>Tham gia ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  button: {
    marginVertical: 20,
  },
  txtBtn: {
    color: '#FFFFFF',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
  },
  btn_container: {
    backgroundColor: '#0961F5',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 20,
  },
  line: {
    width: '90%',
    height: 2,
    backgroundColor: '#C5DAFB',
    marginHorizontal: 20,
  },
  describe: {
    height: 180,
    marginHorizontal: 10,
    marginTop: 10,
  },
  scrollDescribe: {
    paddingHorizontal: 10,
  },
  txt_describe: {
    color: '#202244',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 16,
    textAlign: 'justify',
  },
  txt_number: {
    color: '#202244',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 18,
  },
  title: {
    color: '#545454',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 17,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  data_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
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
    justifyContent: 'flex-start',
  },
  nameTeacher: {
    fontSize: 19,
    color: '#202244',
    fontFamily: 'Mulish-Bold',
    marginHorizontal: 20,
  },
  avatarTeacher: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoTeacher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
  },
  nameCourse: {
    fontSize: 20,
    color: '#202244',
    fontFamily: 'Mulish-ExtraBold',
    marginVertical: 10,
    textAlign: 'center',
  },
  imgBanner: {
    width: '100%',
    height: 180,
    borderRadius: 20,
  },
  banner: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  txtHeader: {
    color: '#0D0D0D',
    fontFamily: 'Mulish-ExtraBold',
    fontSize: 20,
    paddingLeft: 20,
  },
  imgBack: {
    width: 30,
    height: 20,
  },
  top: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F9FF',
  },
});

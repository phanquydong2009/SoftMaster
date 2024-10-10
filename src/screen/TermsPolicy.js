import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const TermsPolicy = () => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            source={require('../design/image/ic_back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Điều khoản và điều kiện</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Điều kiện & Tham dự</Text>
        <Text style={styles.text}>
          Chấp nhận: Khi sử dụng ứng dụng, bạn đồng ý tuân thủ các điều khoản
          này. Nếu không đồng ý, vui lòng ngừng sử dụng.
        </Text>
        <Text style={styles.text}>
          Đăng ký: Một số tính năng yêu cầu đăng ký tài khoản với thông tin
          chính xác và bảo mật.
        </Text>
        <Text style={styles.text}>
          Quyền riêng tư: Thông tin cá nhân của bạn sẽ được xử lý theo Chính
          sách Bảo mật và không chia sẻ trái phép.
        </Text>
        <Text style={styles.text}>
          Sử dụng hợp pháp: Bạn chỉ được phép sử dụng ứng dụng cho mục đích hợp
          pháp, không vi phạm quyền của bên thứ ba.
        </Text>
        <Text style={styles.text}>
          Thay đổi: Chúng tôi có quyền thay đổi hoặc ngừng ứng dụng mà không cần
          thông báo trước.
        </Text>

        <Text style={styles.title}>Điều khoản & Sử dụng</Text>
        <Text style={styles.text}>
          Khi sử dụng ứng dụng này, bạn đồng ý tuân thủ tất cả các điều khoản
          sau: Ứng dụng này cung cấp nội dung và dịch vụ cho mục đích cá nhân.
          Bạn không được sao chép, phân phối hoặc sử dụng trái phép bất kỳ nội
          dung nào. Ứng dụng không chịu trách nhiệm cho bất kỳ tổn thất nào phát
          sinh từ việc sử dụng hoặc không thể sử dụng ứng dụng. Chúng tôi có
          quyền thay đổi hoặc cập nhật các điều khoản mà không cần thông báo
          trước. Người dùng có trách nhiệm kiểm tra điều khoản này thường xuyên.
        </Text>

        <Text style={styles.text}>
          ĐIỀU KHOẢN ĐƯỢC THÔNG QUA VÀ BAN HÀNH VÀO NGÀY 9/9/2024 BỞI TEAM SKY
          DREAM
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   padding : 15,
    backgroundColor: '#F5F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 30,
    height: 20,
    tintColor: '#202244',
  },
  headerText: {
    fontSize: 21,
    fontWeight: '700',
    color: '#202244',
    fontFamily: 'Mulish',
    fontStyle: 'normal',
    marginLeft: 16,
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,

  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202244',
    fontFamily: 'Mulish',
    fontStyle: 'normal',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: '#545454',
    fontFamily: 'Mulish',
    fontStyle: 'normal',
    lineHeight: 23,
    flexShrink: 0,
  },
});

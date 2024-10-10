import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

const  LanguageScreen= ({ navigation }) => {
  const [isVietnamese, setIsVietnamese] = useState(true);

  const toggleLanguage = (language) => {
    if (language === 'vietnamese') {
      setIsVietnamese(true);
    } else {
      setIsVietnamese(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={require('../design/image/ic_back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Ngôn Ngữ</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Tất cả ngôn ngữ</Text>

        <View style={styles.languageOption}>
          <Text style={styles.languageText}>Tiếng Việt</Text>
          <TouchableOpacity onPress={() => toggleLanguage('vietnamese')} style={styles.checkBoxWrapper}>
            <Image
              source={isVietnamese ? require('../design/image/check_on.png') : require('../design/image/check_off.png')}
              style={styles.checkBox}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.languageOption}>
          <Text style={styles.languageText}>English</Text>
          <TouchableOpacity onPress={() => toggleLanguage('english')} style={styles.checkBoxWrapper}>
            <Image
              source={!isVietnamese ? require('../design/image/check_on.png') : require('../design/image/check_off.png')}
              style={styles.checkBox}
            />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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

    color: '#202244',
    fontFamily: 'Mulish-ExtraBold',
    lineHeight: 24,
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: '#202244',
    fontFamily: 'Mulish-ExtraBold',
    marginTop: 20,
    marginBottom: 10,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 20,
    marginLeft : 20
  },
  checkBoxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    width: 24,
    height: 24,
  },
  languageText: {
    fontSize: 15,
  
    color: '#202244',
    fontFamily: 'Mulish-Bold',
  },
});

import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AppNavigator from './src/component/AppNavigator';
import ForgotPassword from './src/screen/ForgotPassword';
import CertScreen from './src/screen/CertScreen';
import EditProfile from './src/screen/EditProfile';
import DetailScreen from './src/screen/DetailScreen';
function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <AppNavigator />
   {/* <DetailScreen></DetailScreen> */}
   {/* <CertScreen></CertScreen> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

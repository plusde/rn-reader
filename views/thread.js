import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
} from "react-native";
import { IconButton } from 'react-native-paper';
import axios from "axios";

import theme from '../assets/style'

const Thread = ({ route, navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ paddingLeft: 5 }}>
          <IconButton
            icon={"arrow-left"}
            color={theme[global.theme].emphasisedTextColor}
            onPress={() => navigation.goBack()}
            rippleColor="#ffffff40"
          />
        </View>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme[global.theme].backgroundColor,
    flex: 1,
  },
});

export default Thread;

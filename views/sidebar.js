import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  NativeModules,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import { IconButton } from 'react-native-paper';
import { Button } from "../components/button";
import axios from "axios";

import theme from '../assets/style';

const Sidebar = ({ props, navigation }) => {

  const navigate = (page, payload = {}) => {
    navigation.closeDrawer();
    navigation.getParent().navigate(page, payload);
  }

  const getBoards = async () => {
    setRefreshing(true);
    axios.get("https://a.4cdn.org/boards.json")
      .then(response => {
        setBoards(response.data.boards);
        setRefreshing(false);
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        setRefreshing(false);
      }
    );
  };

  useEffect(() => {
    getBoards();
  }, []);

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header.container}>
          <Text style={styles.header.title}>
            Boards
          </Text>
          <IconButton
            icon={'bookmark'}
            color={theme[global.theme].emphasisedTextColor}
            onPress={() => navigate('Saved')}
            rippleColor="#ffffff40"
          />
          <IconButton
            icon={'cog'}
            color={theme[global.theme].emphasisedTextColor}
            onPress={() => navigate('Settings')}
            rippleColor="#ffffff40"
          />
        </View>
      </View>
      <View style={styles.list}>
        <FlatList
          data={boards}
          refreshControl={
            <RefreshControl
              onRefresh={getBoards}
              refreshing={refreshing}
              colors={[theme[global.theme].accentColor]}
            />
          }
          keyExtractor={item => item.board}
          renderItem={({ item }) =>
            <View style={item.board == selectedBoard.board ? [styles.list.item, styles.list.selectedItem] : styles.list.item}>
              <Pressable
                android_ripple={{
                  color: "#ffffff40",
                  borderless: true,
                }}
                onPress={() => (setSelectedBoard(item), navigate('Board', {board: item}))}
              >
                <Text style={styles.list.title}>{item.title}</Text>
                <Text style={styles.list.meta}>{ item.meta_description.replace(/&quot;/g,'"').replace(/&amp;/g,'&')}</Text>
              </Pressable>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme[global.theme].backgroundColor,
    flex: 1,
  },
  header: {
    backgroundColor: theme[global.theme].headerColor,
    height: NativeModules.StatusBarManager.HEIGHT + 56,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    title: {
      paddingLeft: 20,
      flex: 1,
      fontSize: 20,
      fontWeight: '600',
      color: theme[global.theme].emphasisedTextColor,
    },
    container: {
      height: 56,
      paddingRight: 7.5,
      flexDirection: 'row',
      alignItems: 'center',
    }
  },
  list: {
    flex: 1,
    selectedItem: {
      backgroundColor: theme[global.theme].accentColor,
    },
    item: {
      padding: 6,
      paddingLeft: 12,
      paddingRight: 12,
      margin: 10,
      marginTop: 10,
      marginBottom: 5,
      backgroundColor: theme[global.theme].inactiveAccentColor,
      borderRadius: 6,
      elevation: 0,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 14,
      color: theme[global.theme].emphasisedTextColor
    },
    meta: {
      fontSize: 14,
      color: theme[global.theme].textColor
    },
  },
});

export default Sidebar;
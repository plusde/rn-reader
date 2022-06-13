import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  FlatList,
  RefreshControl,
  Pressable,
  Image,
} from "react-native";
import * as Linking from 'expo-linking';
import { IconButton } from 'react-native-paper';
import ListItem from '../components/listItem';
import { Button } from "../components/button";
import axios from "axios";

import { replaceText, splitText } from '../assets/helper';
import theme from '../assets/style';

const Board = ({ route, navigation }) => {
  const board = route.params?.board;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: board?.title,
      headerRight: () => (
        <View style={{ paddingRight: 7.5 }}>
          <IconButton
            icon={"refresh"}
            color={theme[global.theme].emphasisedTextColor}
            onPress={getThreads}
            rippleColor="#ffffff40"
          />
        </View>
      ),
    });
    board ? getThreads() : null;
  }, [route]);

  // only gets called on app load
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ paddingLeft: 5 }}>
          <IconButton
            icon={"menu"}
            color={theme[global.theme].emphasisedTextColor}
            onPress={() => navigation.openDrawer()}
            rippleColor="#ffffff40"
          />
        </View>
      ),
    });
  }, []);

  const getThreads = () => {
    setRefreshing(true);
    axios.get("https://a.4cdn.org/" + board.board + "/catalog.json", {
      headers: {
        'If-Modified-Since': refreshStamp?.toLocaleDateString('en_US', {timeZone: 'UTC'})
      }
    })
      .then(response => {
        setRefreshStamp(new Date(Date.now()))
        setPages(response.data);
        setShownPages(response.data[0].threads);
        setShown(1);
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

  const nextPage = () => {
    setShownPages([...shownPages, ...pages[shown].threads]);
    setShown(shown + 1);
  };
  
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState(0);
  const [shownPages, setShownPages] = useState(pages[shown]?.threads);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStamp, setRefreshStamp] = useState(null);

  return (
    <View style={styles.container}>
      { board ?
        <View style={styles.list}>
          <FlatList
            data={shownPages}
            refreshControl={
              <RefreshControl
                onRefresh={getThreads}
                refreshing={refreshing}
                colors={[theme[global.theme].accentColor]}
              />
            }
            keyExtractor={item => item.no}
            renderItem={({ item, index }) =>
              <View key={index}>
                <ListItem
                  board={board}
                  index={index}
                  item={item}
                  onPress={() => navigation.navigate('Thread', {board: board, thread: item})}
                />
                { index != shownPages.length - 1 ? null :
                  <View style={{margin: 10, marginBottom: 15, alignItems: 'center'}}>
                    { shown == pages.length ? 
                      <View>
                        <Text style={styles.list.notice}>No more posts to load.</Text>
                      </View> 
                    : 
                      <Button 
                        text="Load more threads"
                        onPress={nextPage}
                      />
                    }
                  </View>
                }
              </View>
            }
          />
        </View> 
      : 
        // no board selected
        <Pressable
          style={styles.container}
          onPress={() => navigation.openDrawer()}
        >
          <Text style={styles.notice}>Open the sidebar and select a board to begin browsing.</Text>
        </Pressable>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme[global.theme].backgroundColor,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notice: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: 'center',
    width: 343,
    marginBottom: 10,
    color: theme[global.theme].textColor
  },
  list: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    item: {
      flexGrow: 1,
      padding: 6,
      paddingRight: 12,
      margin: 10,
      marginTop: 10,
      marginBottom: 5,
      backgroundColor: theme[global.theme].inactiveAccentColor,
      borderRadius: 6,
      elevation: 0,
    },
    icon: {
      marginRight: 10,
      marginTop: 2,
      marginBottom: 2,
      borderRadius: 6,
      height: 40,
      width: 40,
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
    greentext: {
      fontSize: 14,
      color: theme[global.theme].greenTextColor
    },
    link: {
      fontSize: 14,
      color: theme[global.theme].linkTextColor,
      textDecorationLine: 'underline',
    },
    detail: {
      fontSize: 14,
      color: theme[global.theme].secondaryTextColor
    },
    notice: {
      fontSize: 14,
      fontStyle: 'italic',
      color: theme[global.theme].textColor
    },
  },
});

export default Board;

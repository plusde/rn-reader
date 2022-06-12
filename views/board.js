import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import { IconButton } from 'react-native-paper';
import { Button } from "../components/button";
import axios from "axios";

import theme from '../assets/style'

global.theme = 'dark';

const Board = ({ route, navigation }) => {
  const board = route.params?.board;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: board?.title,
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
    axios.get("https://a.4cdn.org/" + board.board + "/catalog.json")
      .then(response => {
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

  const replaceText = (text) => {
    text = text
      ?.replace(/&quot;/g,'"')
      .replace(/&#039;/g,'\'')
      .replace(/&amp;/g,'&')
      .replace(/&gt;/g,'>')
      .replace(/<br>/g,'\n')
      .replace(/<wbr>|\[Embed]|\[Open]/g,'')

    return text.substr(0, 250).trim().length < text.length ?
      text.substr(0, 250).trim() + "..." :
      text
  }

  const nextPage = () => {
    setShownPages([...shownPages, ...pages[shown].threads]);
    setShown(shown + 1);
  }
  
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState(0);
  const [shownPages, setShownPages] = useState(pages[shown]?.threads)
  const [refreshing, setRefreshing] = useState(false);

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
              <View>
                <View style={styles.list.item}>
                  <Pressable
                    android_ripple={{
                      color: "#ffffff40",
                      borderless: true,
                    }}
                    onPress={() => navigation.navigate('Thread')}
                  >
                    {item?.sub ? <Text style={styles.list.title}>{replaceText(item?.sub)}</Text> : null}
                    <Text style={styles.list.detail}>{item?.name} {item?.now}</Text>
                    {item?.com ? <Text style={styles.list.meta}>{replaceText(item?.com)}</Text> : null}
                  </Pressable>
                </View>
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

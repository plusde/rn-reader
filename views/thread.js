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
import { IconButton } from 'react-native-paper';
import axios from "axios";

import theme from '../assets/style'

const Thread = ({ route, navigation }) => {
  const { board, thread } = route.params;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: thread?.sub,
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
    getPosts();
  }, []);

  const getPosts = () => {
    axios.get("https://a.4cdn.org/" + board.board + "/thread/" + thread.no + ".json")
      .then(response => {
        setPosts(response.data.posts);
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
  };
  
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        refreshControl={
          <RefreshControl
            onRefresh={getPosts}
            refreshing={refreshing}
            colors={[theme[global.theme].accentColor]}
          />
        }
        keyExtractor={item => item.no}
        renderItem={({ item, index }) =>
          <View>
            { index == 0 ? 
              <View style={[styles.list.item, styles.list.op, item?.filename ? {paddingLeft: 8} : {paddingLeft: 12}]}>
                { item?.filename ? <Image style={styles.list.op.icon} source={{ uri: 'https://i.4cdn.org/' + board.board + '/' + item.tim + 's.jpg' }}/> : null }
                <View style={{flex: 1, flexGrow: 1}}>
                  {item?.sub ? <Text style={styles.list.title}>{replaceText(item?.sub)}</Text> : null}
                  <Text style={styles.list.detail}>{item?.name} {item?.now}</Text>
                  {item?.com ? <Text style={styles.list.meta}>{replaceText(item?.com)}</Text> : null}
                </View>
              </View>
            :
              <View style={[styles.list.item, item?.filename ? {paddingLeft: 8} : {paddingLeft: 12}]}>
                { item?.filename ? <Image style={styles.list.icon} source={{ uri: 'https://i.4cdn.org/' + board.board + '/' + item.tim + 's.jpg' }}/> : null }
                <View style={{flex: 1, flexGrow: 1}}>
                  <Text style={styles.list.detail}>{item?.name} {item?.now}</Text>
                  {item?.com ? <Text style={styles.list.meta}>{replaceText(item?.com)}</Text> : null}
                </View>
              </View>
            }
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme[global.theme].backgroundColor,
    flex: 1,
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
      flexDirection: 'row',
    },
    op: {
      backgroundColor: theme[global.theme].backgroundColor,
      marginBottom: 0,
      icon: {
        marginRight: 10,
        marginTop: 2,
        marginBottom: 2,
        borderRadius: 6,
        height: 80,
        width: 80,
      }
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

export default Thread;

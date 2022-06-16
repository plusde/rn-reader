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
import axios from "axios";

import ListItem from '../components/listItem';
import ImageViewer from "../components/imageViewer";
import ReplyViewer from "../components/replyViewer";

import theme from '../assets/style';

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
      headerRight: () => (
        <View style={{ paddingRight: 7.5 }}>
          <IconButton
            icon={"refresh"}
            color={theme[global.theme].emphasisedTextColor}
            onPress={getPosts}
            rippleColor="#ffffff40"
          />
        </View>
      ),
    });
    getPosts();
  }, []);

  const getPosts = () => {
    axios.get("https://a.4cdn.org/" + board.board + "/thread/" + thread.no + ".json", {
        headers: {
          'If-Modified-Since': refreshStamp?.toLocaleDateString('en_US', {timeZone: 'UTC'})
        }
      })
      .then(response => {
        setRefreshStamp(new Date(Date.now()))
        setPosts(response.data.posts);
        if(response.data.posts[0]?.sub) navigation.setOptions({headerTitle: response.data.posts[0]?.sub})
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
  
  const [post, setPost] = useState(0);
  const [posts, setPosts] = useState([]);
  const [repliesTo, setRepliesTo] = useState(0);
  const [replyViewerVisible, setReplyViewerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStamp, setRefreshStamp] = useState(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewing, setViewing] = useState(false);

  return (
    <View style={styles.container}>
    <ImageViewer
      board={board}
      images={posts.filter(x => x?.filename)}
      initialScrollIndex={posts.filter(x => x?.filename).indexOf(viewing)}
      isVisible={imageViewerVisible}
      onRequestClose={() => setImageViewerVisible(false)}
    />
      <ReplyViewer
        board={board}
        isVisible={replyViewerVisible}
        onRequestClose={() => setReplyViewerVisible(false)}
        posts={posts}
        post={post}
        repliesTo={repliesTo}
      />
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
        renderItem={ ({ item, index }) => 
        <View key={index}>
          <ListItem
            board={board}
            index={index}
            isLast={posts.length - 1 == index}
            isOP={index == 0}
            item={item}
            navigation={navigation}
            onImagePress={() => {setViewing(item); setImageViewerVisible(true)}}
            onQuotePress={post => {setRepliesTo(0); setPost(post); setReplyViewerVisible(true)}}
            onReplyPress={() => {setPost(0); setRepliesTo(item.no); setReplyViewerVisible(true)}}
            replies={posts.filter(x => x?.com?.includes('#p' + item.no)).length}
          />
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
    notice: {
      fontSize: 14,
      fontStyle: 'italic',
      color: theme[global.theme].textColor
    },
  },
});

export default Thread;

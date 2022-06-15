import React, { useState, useEffect } from 'react';
import {
  View,
  Pressable,
  Modal,
  FlatList,
  Text,
} from 'react-native';

import ListItem from '../components/listItem';

import theme from '../assets/style';

export default ReplyViewer = ({ board, isVisible, onRequestClose, posts, repliesTo, post}) => {

  const [commentChain, setCommentChain] = useState([{
    type: repliesTo ? 'reply' : 'post',
    no: repliesTo ? repliesTo : post,
  }]);

  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    setCommentChain([{
      type: repliesTo ? 'reply' : 'post',
      no: repliesTo ? repliesTo : post,
    }]);
  }, [repliesTo, post, isVisible]);

  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={isVisible} statusBarTranslucent={true} onRequestClose={onRequestClose}>
        <Pressable 
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000077',
          }}
          onPress={commentChain.length == 1 ? onRequestClose : () => setCommentChain(commentChain.filter((_, i) => i != commentChain.length - 1))}
        >
          <Pressable 
            style={{
              backgroundColor: theme[global.theme].backgroundColor,
              width: 343,
              margin: 50,
              borderRadius: 6,
              paddingRight: 3, 
              paddingLeft: 3,
            }}>
            <FlatList
              data={ commentChain[commentChain.length - 1].type == 'post' 
                ? posts.filter(x => x?.no == commentChain[commentChain.length - 1].no)
                : posts.filter(x => x?.com?.includes('#p' + commentChain[commentChain.length - 1].no)) // arr.at() not defined ? 
              }
              keyExtractor={item => item.no}
              renderItem={ ({ item, index }) => ( // console.log(posts.filter(x => x?.no == commentChain[commentChain.length - 1].no)),
              <View key={index}>
                <ListItem
                  board={board}
                  index={index}
                  isLast={commentChain[commentChain.length - 1].type == 'post' ? true : posts.filter(x => x?.com?.includes('#p' + commentChain[commentChain.length - 1].no)).length - 1 == index}
                  item={item}
                  onImagePress={() => setImageViewerVisible(true)}
                  onQuotePress={post => setCommentChain([...commentChain, {type: 'post', no: post}])}
                  onReplyPress={() => setCommentChain([...commentChain, {type: 'reply', no: item.no}])}
                  replies={posts.filter(x => x?.com?.includes('#p' + item.no)).length}
                />
              </View>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
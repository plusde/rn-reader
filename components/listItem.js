import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import * as WebBrowser from 'expo-web-browser';

import Spoiler from '../components/spoiler';

import { replaceText, splitText } from '../assets/helper';
import theme from '../assets/style';

global.theme = 'dark'; // this somehow is the first component to load ?

export default ListItem = ({ board, isLast= false, isOP = false, item, navigation, onImagePress, onPress, onQuotePress, onReplyPress, replies}) => {
  return (
    <View style={[styles.item, isOP ? styles.op : null, item?.filename ? {paddingLeft: 8} : {paddingLeft: 12}, isLast ? {marginBottom:10} : null]}>
      <Pressable
        style={{flexDirection: 'row', flex: 1, flexGrow: 1}}
        android_ripple={ onPress ? { 
          color: '#ffffff40',
          borderless: true,
        } : {color: '#00000000'}}
        onPress={onPress}
      >
        { item?.filename ? 
          <View style={styles.iconContainer}>
            <Pressable
              android_ripple={{ 
                color: '#ffffff40',
                borderless: true,
              }}
              onPress={onImagePress}
              hitSlop={6}
            >
              <Image style={isOP ? styles.op.icon : styles.icon} source={{ uri: 'https://i.4cdn.org/' + board.board + '/' + item.tim + 's.jpg' }}/>
            </Pressable>
          </View>
        : null }
        <View style={{flex: 1, flexGrow: 1}}>
          { item?.sub ? <Text style={styles.title}>{ replaceText(item?.sub) }</Text> : null }
          <Text style={styles.detail}>{ item?.name } { item?.now } No.{item?.no}</Text>
          { item?.com ? <View>
            { splitText(onPress ? replaceText(item?.com, 250) : replaceText(item?.com)).map((obj, index) => ( // console.log(obj),
                obj.type == 'text' ? <Text style={styles.meta} key={index}>{ obj.text }</Text> :
                obj.type == 'link' ? 
                  <Pressable hitSlop={6} key={index} onPress={() => {
                    if (obj.href.substr(0,1) == '/') {
                      let [board, _, thread_reply] = obj.href.split('/');
                      let [thread, reply] = thread_reply.split('#p');
                    } else if (obj.href.substr(0,1) == '#') {
                      let post = obj.href.substr(2).split('"')[0];
                      pressedQuote = post;
                      onQuotePress(post);
                    } else
                      WebBrowser.openBrowserAsync(obj.href, 
                        {
                          secondaryToolbarColor: '#000000',
                          toolbarColor: theme[global.theme].headerColor,
                        }
                      )
                  }}>
                    <Text style={styles.link}>{ obj.text }</Text>
                  </Pressable> :
                obj.type == 'custom-text' ? <Text key={index} style={[styles.meta, obj.style]}>{ obj.text }</Text> :
                obj.type == 'green-text' ? <Text key={index} style={styles.greentext}>{ obj.text }</Text> :
                obj.type == 'italic-text' ? <Text key={index} style={[styles.meta, {fontStyle: 'italic'}]}>{ obj.text }</Text> :
                obj.type == 'bold-text' ? <Text key={index} style={[styles.meta, {fontWeight: 'bold'}]}>{ obj.text }</Text> :
                obj.type == 'underline-text' ? <Text key={index} style={[styles.meta, {textDecorationLine: 'underline'}]}>{ obj.text }</Text> :
                obj.type == 'bold-underline-text' ? <Text key={index} style={[styles.meta, {textDecorationLine: 'underline', fontWeight: 'bold'}]}>{ obj.text }</Text> :
                obj.type == 'spoiler-text' ? <Spoiler key={index} text={obj.text} /> :
                obj.type == 'dead-text' ? <Text key={index} style={styles.deadlink}>{ obj.text }</Text> :
                null
            )) }
          </View> : null }
          { onPress ? 
            <View style={styles.detailContainer}>
              { item?.replies ? <Text style={styles.detail}>{ item?.replies } { item?.replies == 1 ? "reply" : "replies"}</Text> : null }
              { item?.replies && item?.images ? <Text style={styles.detail}>, </Text> : null }
              { item?.images ? <Text style={styles.detail}>{ item?.images } {item?.images == 1 ? "image" : "images"}</Text> : null }
            </View>
          :
            <Pressable style={styles.detailContainer} onPress={onReplyPress} hitSlop={6}>
              { replies > 0 ? <Text style={styles.detail}>{ replies } { replies == 1 ? "reply" : "replies"}</Text> : null }
            </Pressable>
          }
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexGrow: 1,
    padding: 6,
    paddingRight: 12,
    margin: 10,
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
      borderRadius: 6,
      height: 80,
      width: 80,
    }
  },
  iconContainer: {
    elevation: 0, 
    alignSelf: 'flex-start', 
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
    marginBottom: 2,
    borderRadius: 6,
  },
  icon: {
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
    color: theme[global.theme].textColor,
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
  deadlink: {
    fontSize: 14,
    color: theme[global.theme].linkTextColor,
    textDecorationLine: 'line-through',
  },
  detail: {
    fontSize: 14,
    color: theme[global.theme].secondaryTextColor
  },
  detailContainer: {
    flexDirection: 'row', 
    marginTop: 3,
  }
});
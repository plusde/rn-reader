import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import * as WebBrowser from 'expo-web-browser';

import { replaceText, splitText } from '../assets/helper';
import theme from '../assets/style';

export default ListItem = ({ board, index, isOP = false, item, onPress}) => {
  return (
    <View style={[styles.item, isOP ? styles.op : null, item?.filename ? {paddingLeft: 8} : {paddingLeft: 12}]} key={index}>
      <Pressable
        style={{flexDirection: 'row', flex: 1, flexGrow: 1}}
        android_ripple={ onPress ? { 
          color: '#ffffff40',
          borderless: true,
        } : {color: '#00000000'}}
        onPress={onPress}
      >
        { item?.filename ? <Image style={isOP ? styles.op.icon : styles.icon} source={{ uri: 'https://i.4cdn.org/' + board.board + '/' + item.tim + 's.jpg' }}/> : null }
        <View style={{flex: 1, flexGrow: 1}}>
          { item?.sub ? <Text style={styles.title}>{ replaceText(item?.sub) }</Text> : null }
          <Text style={styles.detail}>{ item?.name } { item?.now }</Text>
          { item?.com ? <View>
            { splitText(onPress ? replaceText(item?.com, 250) : replaceText(item?.com)).map(obj => ( // console.log(obj),
                obj.type == 'text' ? <Text style={styles.meta}>{ obj.text }</Text> :
                obj.type == 'link' ? 
                  <Pressable onPress={() => 
                    WebBrowser.openBrowserAsync(obj.href, 
                      {
                        secondaryToolbarColor: '#000000',
                        toolbarColor: theme[global.theme].headerColor,
                      }
                    )}
                  >
                    <Text style={styles.link}>{ obj.text }</Text>
                  </Pressable> :
                obj.type == 'custom-text' ? <Text style={[styles.meta, obj.style]}>{ obj.text }</Text> :
                obj.type == 'green-text' ? <Text style={styles.greentext}>{ obj.text }</Text> :
                obj.type == 'italic-text' ? <Text style={[styles.meta, {fontStyle: 'italic'}]}>{ obj.text }</Text> :
                null
            )) }
          </View> : null }
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
  detail: {
    fontSize: 14,
    color: theme[global.theme].secondaryTextColor
  },
});
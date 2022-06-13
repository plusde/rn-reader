import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable
} from 'react-native';

import theme from '../assets/style';

export default Spoiler = ({ text = "Spoiler" }) => {
  const [showText, setShowText] = useState(false);
  return (
    <View style={{ borderRadius: 3, elevation: 0}}>
      <Pressable
        style={{
          backgroundColor: theme[global.theme].accentColor,
          padding: 3,
          paddingLeft: 6,
          paddingRight: 6,
        }}
        android_ripple={{ color: '#ffffff40', borderless: true }}
        onPress={() => setShowText(!showText)}
      >
        <Text style={{
          color: theme[global.theme].emphasisedTextColor,
        }}>
          { showText ? text : ""}
        </Text>
      </Pressable>
    </View>
  )
};
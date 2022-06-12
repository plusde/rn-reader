import React from 'react';
import {
  View,
  Text,
  Pressable
} from 'react-native';

import theme from '../assets/style'

export const Button = ({ text = "Submit", onPress, width = 250 }) => {
  return (
    <View style={{ borderRadius: 3, elevation: 0 }}>
      <Pressable
        style={{
          width: width,
          height: 44,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme[global.theme].accentColor,
          borderRadius: 6,
        }}
        android_ripple={{ color: '#ffffff40', borderless: true }}
        onPress={onPress}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            color: theme[global.theme].emphasisedTextColor
          }}
        >
          {text}
        </Text>
      </Pressable>
    </View>
  )
}
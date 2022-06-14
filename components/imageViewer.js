import React from 'react';
import {
  View,
  Pressable,
  Modal,
} from 'react-native';

export default ImageViewer = ({ isVisible, onRequestClose }) => {
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
          onPress={onRequestClose}
        >
        </Pressable>
      </Modal>
    </View>
  );
};
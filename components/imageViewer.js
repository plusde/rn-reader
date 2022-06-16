import React, {useRef, useState} from 'react';
import {
  View,
  Pressable,
  Modal,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';

import theme from '../assets/style';

export default ImageViewer = ({ board, images, initialScrollIndex, isVisible, onRequestClose }) => {
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setViewing(viewableItems[0].index);
  });
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  
  const [viewing, setViewing] = useState(0);

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
          <FlatList
            data={images}
            horizontal={true}
            initialNumToRender={2}
            initialScrollIndex={initialScrollIndex}
            keyExtractor={item => item.no}
            onViewableItemsChanged={onViewableItemsChanged.current}
            pagingEnabled={true}
            renderItem={({ item, index }) =>
              <Pressable>
                <Image
                  key={index}
                  style={{width: Dimensions.get("window").width, flex:1, resizeMode: 'contain'}}
                  source={{ uri: 'https://i.4cdn.org/' + board.board + '/' + item.tim + item.ext }}
                />
              </Pressable>
            }
            viewabilityConfig={viewabilityConfig.current}
          />
        </Pressable>
      </Modal>
    </View>
  );
};
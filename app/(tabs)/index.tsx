import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Font from 'expo-font';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import tw from 'twrnc';
import { FontAwesome, AntDesign } from '@expo/vector-icons'; // Import ikon Facebook

const Index = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  // State animasi untuk opacity
  const opacity = useSharedValue(0);

  // Load font ketika komponen dimuat
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Rowdies-Bold': require('../../assets/fonts/Rowdies-Bold.ttf'),
      });
      setFontLoaded(true); 
    };

    loadFont();
  }, []);

  useEffect(() => {
    if (fontLoaded) {
      opacity.value = withTiming(1, { duration: 2000 });
    }
  }, [fontLoaded]);

  // Gaya animasi untuk opacity
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!fontLoaded) {
    return null; 
  }

  return (
    <>
      <View style={tw`flex-1 h-full items-center mx-auto justify-center`}>
        <Animated.Text style={[tw`text-3xl`, { fontFamily: 'Rowdies-Bold' }, animatedStyle]}>
          Hello <Text style={tw`text-emerald-500`}>There</Text> 👋
        </Animated.Text>
        <FontAwesome name="cloud" size={24} color="skyblue" style={tw`mt-4 items-center mx-auto flex`} />
      </View>
    </>
  );
};

export default Index;

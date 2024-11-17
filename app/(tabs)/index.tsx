import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

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
      opacity.value = withTiming(1, { duration: 1500 });
    }
  }, [fontLoaded]);

  // Gaya animasi untuk opacity
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!fontLoaded) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
      <Animated.View style={[tw`items-center`, animatedStyle]}>
        <FontAwesome
          name="gears"
          size={64}
          color="#34D399"
          style={tw`mb-6`}
        />
        <Animated.Text
          style={[
            tw`text-4xl text-center text-gray-800`,
            { fontFamily: 'Rowdies-Bold' },
          ]}
        >
          Welcome to <Text style={tw`text-emerald-500`}> MZP-Tools</Text> 
        </Animated.Text>
        <Text style={tw`mt-4 text-gray-600 text-lg`}>
          Let's start your journey with MZP-Tools
        </Text>
      </Animated.View>

      <View style={tw`absolute bottom-10 flex-row items-center space-x-4`}>
        <AntDesign name="facebook-square" size={32} color="#1877F2" />
        <FontAwesome name="twitter" size={32} color="#1DA1F2" />
        <AntDesign name="instagram" size={32} color="#E1306C" />
      </View>
    </View>
  );
};

export default Index;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import tw from 'twrnc';

const ChatScreen = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSend = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Tolong masukkan pertanyaan');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.chiwa.id/api/ai/chatGPT?text=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      setResult(data.result);
      setText(''); // Clear input after sending
    } catch (error) {
      Alert.alert('Error', 'Gagal mendapatkan respons');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw`bg-blue-600  p-4`}>
        <Text style={tw`mt-10 text-white text-xl font-bold text-center`}>
          Chat dengan AI
        </Text>
      </View>
      <View style={tw`p-4 bg-sky-500 border-t border-gray-200`}>
        <View style={tw`flex-row items-center bg-gray-50 rounded-lg p-2`}>
          <TextInput
            style={tw`flex-1 text-base text-gray-800 min-h-[40px]`}
            placeholder="Tulis pertanyaan..."
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={tw`ml-2 bg-blue-500 p-3 rounded-lg ${isLoading ? 'opacity-50' : ''}`}
            onPress={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={tw`text-white font-bold`}>Kirim</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Character counter */}
        <Text style={tw`text-right text-gray-400 text-xs mt-1`}>
          {text.length}/500
        </Text>
      </View>

      {/* Result Area */}
      <ScrollView style={tw`flex-1 p-4`}>
        {result ? (
          <View style={tw`bg-white p-4 rounded-lg shadow-sm`}>
            <Text style={tw`text-gray-800`}>{result}</Text>
          </View>
        ) : (
          <Text style={tw`text-gray-500 text-center mt-4`}>
            Hasil akan muncul di sini
          </Text>
        )}
      </ScrollView>

      {/* Input Area */}
      
    </View>
  );
};

export default ChatScreen;
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import * as Font from 'expo-font';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

interface ToolCardProps {
  title: string;
  icon: string;
  description: string;
  href: string;
  gradient: string[];
}

const ToolCard = ({ title, icon, description, href, gradient }: ToolCardProps) => (
  <Link href={href} asChild>
    <Pressable>
      {({ pressed }) => (
        <View
          style={[
            tw`mb-4 p-6 rounded-2xl shadow-lg`,
            {
              backgroundColor: gradient[0],
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <View style={tw`flex-row items-center mb-3`}>
            <FontAwesome5 name={icon} size={24} color="white" />
            <Text
              style={[
                tw`text-xl text-white ml-3`,
                { fontFamily: 'Rowdies-Bold' },
              ]}
            >
              {title}
            </Text>
          </View>
          <Text
            style={[
              tw`text-white opacity-80`,
              { fontFamily: 'Rowdies-Regular' },
            ]}
          >
            {description}
          </Text>
        </View>
      )}
    </Pressable>
  </Link>
);

const Tools = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const tools: ToolCardProps[] = [
    {
      title: 'Info Gempa',
      icon: 'globe',
      description: 'Informasi gempa terkini di Indonesia',
      href: 'infogempa',
      gradient: ['#4F46E5', '#7C3AED'],
    },
    {
      title: 'Berita',
      icon: 'newspaper',
      description: 'Get the latest news from Indone',
      href: 'berita',
      gradient: ['#2563EB', '#3B82F6'],
    },
    {
      title: 'Jadwal bola',
      icon: 'futbol',
      description: 'Jadwal Bola Dunia',
      href: 'bola',
      gradient: ['#059669', '#10B981'],
    },
   
    {

      title: 'Jadwal Sholat',
      icon: 'mosque',
      description: 'Jadwal Sholat Indonesia',
      href: 'jadwalsholat',
      gradient: ['#057665', '#10B931'],

    },

    {
      title: 'Ai-GPT',
      icon: 'robot',
      description: 'Generate random data, IDs, and more',
      href: 'gpt',
      gradient: ['#DC2626', '#EF4444'],
    },
  ];

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Rowdies-Bold': require('../../assets/fonts/Rowdies-Bold.ttf'),
        'Rowdies-Regular': require('../../assets/fonts/Rowdies-Regular.ttf'),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  if (!fontLoaded) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
        <FontAwesome5 name="tools" size={40} color="#4F46E5" />
        <Text style={tw`mt-4 text-gray-600`}>Loading tools...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-gray-50`}
      contentContainerStyle={tw`p-6`}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={tw`mb-8`}>
        {/* <Text
          style={[
            tw`text-4xl font-bold text-gray-900 mb-2`,
            { fontFamily: 'Rowdies-Bold' },
          ]}
        >
          Tools
        </Text> */}
        <Text
          style={[
            tw`text-gray-600 text-lg mt-20`,
            { fontFamily: 'Rowdies-Regular' },
          ]}
        >
          Select a tool to get started
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={tw`flex-row justify-between mb-8`}>
        <Pressable
          style={tw`bg-blue-100 p-4 rounded-xl flex-1 mr-2 items-center`}
        >
          <FontAwesome5 name="star" size={20} color="#2563EB" />
          <Text
            style={[
              tw`text-blue-700 mt-2`,
              { fontFamily: 'Rowdies-Regular' },
            ]}
          >
            Favorites
          </Text>
        </Pressable>
        <Pressable
          style={tw`bg-purple-100 p-4 rounded-xl flex-1 ml-2 items-center`}
        >
          <FontAwesome5 name="history" size={20} color="#7C3AED" />
          <Text
            style={[
              tw`text-purple-700 mt-2`,
              { fontFamily: 'Rowdies-Regular' },
            ]}
          >
            Recent
          </Text>
        </Pressable>
      </View>

      {/* Tools Grid */}
      <View style={tw`mb-6`}>
        <Text
          style={[
            tw`text-xl text-gray-700 mb-4`,
            { fontFamily: 'Rowdies-Bold' },
          ]}
        >
          Available Tools
        </Text>
        {tools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </View>

      {/* Help Section */}
      <View style={tw`bg-gray-100 p-6 rounded-2xl mb-4`}>
        <Text
          style={[
            tw`text-lg text-gray-700 mb-2`,
            { fontFamily: 'Rowdies-Bold' },
          ]}
        >
          Need Help?
        </Text>
        <Text
          style={[
            tw`text-gray-600`,
            { fontFamily: 'Rowdies-Regular' },
          ]}
        >
          Check out our documentation or contact support for assistance.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Tools;
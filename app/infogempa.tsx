import { View, Text, ScrollView, ActivityIndicator, Image, RefreshControl, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';

interface GempaData {
  tanggal: string;
  magnitudo: string;
  kedalaman: string;
  koordinat: string;
  lokasi: string;
  linkPeta: string;
  waktuPemutakhiran: string;
  potensi?: string;
}

const InfoGempa = () => {
  const [gempaData, setGempaData] = useState<GempaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fetchGempaData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://api.nexoracle.com/details/gempa?apikey=free_key@maher_apis');
      setGempaData(response.data.result);
      setImageError(false);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data gempa');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGempaData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchGempaData().then(() => setRefreshing(false));
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={tw`mt-4 text-gray-600 font-medium`}>Memuat data gempa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50 p-4`}>
        <FontAwesome5 name="exclamation-circle" size={40} color="#DC2626" />
        <Text style={tw`mt-4 text-gray-800 font-medium text-center`}>{error}</Text>
        <Pressable
          onPress={fetchGempaData}
          style={tw`mt-4 bg-blue-600 px-6 py-3 rounded-lg`}
        >
          <Text style={tw`text-white font-medium`}>Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  if (!gempaData) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
        <Text style={tw`text-gray-600 font-medium`}>Tidak ada data gempa</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={tw`flex-1 bg-gray-50`}
      contentContainerStyle={tw`p-4`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={tw`mb-6 mt-16`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>
          Informasi Gempa Terkini
        </Text>
        <Text style={tw`text-gray-600`}>
          Data dari BMKG Indonesia
        </Text>
      </View>

      {/* Peta/Gambar Gempa */}
      <View style={tw`bg-white rounded-xl shadow-sm overflow-hidden mb-6`}>
        {imageError ? (
          <View style={tw`w-full h-72 justify-center items-center bg-gray-100`}>
            <FontAwesome5 name="image" size={40} color="#9CA3AF" />
            <Text style={tw`mt-4 text-gray-600`}>Gagal memuat gambar peta</Text>
          </View>
        ) : (
          <Image
            source={{ uri: gempaData.linkPeta }}
            style={tw`w-full h-72`}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        )}
      </View>

      {/* Info Detail */}
      <View style={tw`bg-white rounded-xl shadow-sm p-4 mb-6`}>
        <View style={tw`mb-4`}>
          <Text style={tw`text-lg font-bold text-gray-900 mb-4`}>Detail Gempa</Text>
          
          <InfoItem 
            icon="calendar" 
            label="Waktu Gempa" 
            value={gempaData.tanggal} 
          />
          
          <InfoItem 
            icon="map-marker-alt" 
            label="Lokasi" 
            value={gempaData.lokasi} 
          />
          
          <InfoItem 
            icon="compass" 
            label="Koordinat" 
            value={gempaData.koordinat} 
          />
          
          <InfoItem 
            icon="ruler-vertical" 
            label="Kedalaman" 
            value={gempaData.kedalaman} 
          />
          
          <InfoItem 
            icon="tachometer-alt" 
            label="Magnitude" 
            value={gempaData.magnitudo} 
          />
        </View>

        {gempaData.potensi && (
          <View style={tw`mt-4 p-4 bg-yellow-50 rounded-lg`}>
            <Text style={tw`text-yellow-800 font-medium mb-2`}>Potensi:</Text>
            <Text style={tw`text-yellow-700`}>{gempaData.potensi}</Text>
          </View>
        )}
      </View>

      {/* Footer Info */}
      <Text style={tw`text-center text-gray-500 text-sm mb-4`}>
        Terakhir diperbarui: {gempaData.waktuPemutakhiran}
      </Text>
    </ScrollView>
  );
};

// Component untuk item informasi
const InfoItem = ({ icon, label, value }) => (
  <View style={tw`flex-row items-center mb-4 border-b border-gray-100 pb-3`}>
    <View style={tw`w-8`}>
      <FontAwesome5 name={icon} size={16} color="#4F46E5" />
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-gray-600 text-sm`}>{label}</Text>
      <Text style={tw`text-gray-900 font-medium`}>{value}</Text>
    </View>
  </View>
);

export default InfoGempa;
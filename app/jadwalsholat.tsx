import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import tw from 'twrnc';
import axios from 'axios';

interface PrayerTime {
  title: string;
  prayer_method_name: string;
  city: string;
  items: {
    date_format: string;
    fajr: string;
    shurooq: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

const PrayerSchedule = () => {
  const [data, setData] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('Jakarta'); // State untuk kota default
  const [inputCity, setInputCity] = useState(''); // State untuk input kota dari pengguna

  const fetchData = async () => {
    const api = `https://api.nexoracle.com/islamic/prayer-times?city=${encodeURIComponent(
      city
    )}&apikey=free_key@maher_apis`;
  
    setLoading(true);
    try {
      const response = await axios.get(api);
      if (response.data && response.data.result) {
        const result = response.data.result;
  
        // Parsing data
        setData({
          title: result.title,
          prayer_method_name: result.prayer_method_name,
          city: result.city,
          items: {
            date_format: result.items[0].date_for,
            fajr: result.items[0].fajr,
            shurooq: result.items[0].shurooq,
            dhuhr: result.items[0].dhuhr,
            asr: result.items[0].asr,
            maghrib: result.items[0].maghrib,
            isha: result.items[0].isha,
          },
        });
        setError(null);
      } else {
        setError('Data tidak valid');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal mengambil data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSearch = () => {
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [city]);

  const PrayerTimeCard = ({ title, time }: { title: string; time: string }) => (
    <View style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm`}>
      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3`}>
            <Text style={tw`text-emerald-600 text-lg font-bold`}>
              {title.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={tw`text-gray-800 font-bold text-lg`}>{title}</Text>
          </View>
        </View>
        <View style={tw`bg-emerald-50 px-3 py-1 rounded-full`}>
          <Text style={tw`text-emerald-600 font-medium`}>{time}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={tw`mt-4 text-gray-600`}>Memuat jadwal sholat...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
        <Text style={tw`text-gray-600 font-medium mb-4`}>{error || 'Tidak ada data tersedia'}</Text>
        <TouchableOpacity onPress={fetchData} style={tw`bg-emerald-600 px-6 py-3 rounded-full`}>
          <Text style={tw`text-white font-bold`}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={tw`flex-1`}
      >
        {/* Header */}
        <View style={tw`bg-emerald-600 px-4 pt-8 pb-16 rounded-b-3xl`}>
          <Text style={tw`text-white text-3xl font-bold text-center mt-10 mb-2`}>Jadwal Sholat</Text>
          <Text style={tw`text-emerald-100 text-center mb-4`}>Wilayah {data.city || city}</Text>
          <Text style={tw`text-white text-center text-lg`}>{data.items.date_format}</Text>
          <Text style={tw`text-emerald-100 text-center text-xl font-bold mt-2`}>
            {currentTime.toLocaleTimeString()}
          </Text>
        </View>

        {/* Input Kota */}
        <View style={tw`px-4 mt-4`}>
          <TextInput
            style={tw`bg-white border border-gray-300 rounded-xl px-4 py-2 mb-4`}
            placeholder="Masukkan nama kota"
            value={inputCity}
            onChangeText={setInputCity}
          />
          <TouchableOpacity onPress={handleSearch} style={tw`bg-emerald-600 px-4 py-2 rounded-full`}>
            <Text style={tw`text-white text-center font-bold`}>Cari Jadwal</Text>
          </TouchableOpacity>
        </View>

        {/* Prayer Times Cards */}
        <View style={tw`px-4 mt-4`}>
          <View style={tw`bg-white rounded-3xl p-4 shadow-lg`}>
            <PrayerTimeCard title="Subuh" time={data.items.fajr} />
            <PrayerTimeCard title="Syuruq" time={data.items.shurooq} />
            <PrayerTimeCard title="Dzuhur" time={data.items.dhuhr} />
            <PrayerTimeCard title="Ashar" time={data.items.asr} />
            <PrayerTimeCard title="Maghrib" time={data.items.maghrib} />
            <PrayerTimeCard title="Isya" time={data.items.isha} />
          </View>
        </View>

        {/* Footer */}
        <View style={tw`p-8 mt-4`}>
          <Text style={tw`text-center text-gray-500 text-sm`}>
            Metode Perhitungan: {data.prayer_method_name}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrayerSchedule;

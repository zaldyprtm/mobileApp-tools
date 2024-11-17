import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { useState, useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

interface BolaData {
    time: string;
    event: string;
    match: string;
    tv: string;
}

const Bola = () => {
    const [bola, setBola] = useState<BolaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetching data dari API
    const fetchBola = async () => {
        try {
            const response = await axios.get(
                'https://api.lolhuman.xyz/api/jadwalbola?apikey=a3b68b54fb5bc0148e674f5c'
            );
            setBola(response.data.result);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bola data:', error);
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBola();
    }, []);

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={tw`mt-4 text-gray-600 font-medium`}>
                    Memuat jadwal pertandingan...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
                <FontAwesome5 name="exclamation-triangle" size={48} color="#E11D48" />
                <Text style={tw`mt-4 text-gray-600 font-medium`}>
                    Gagal memuat data. Silakan coba lagi.
                </Text>
            </View>
        );
    }

    if (!bola || bola.length === 0) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
                <FontAwesome5 name="futbol" size={48} color="#4F46E5" />
                <Text style={tw`mt-4 text-gray-600 font-medium`}>Tidak ada data pertandingan hari ini.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={tw`flex-1 bg-gray-50`}>
            <Text style={tw`text-2xl font-bold text-black p-4 mb-2 mt-3`}>
                Jadwal Pertandingan Bola Hari Ini
            </Text>
            {bola.map((item, index) => (
                <View
                    key={index}
                    style={tw`bg-white rounded-lg shadow-sm mb-4 overflow-hidden mx-4`}
                >
                    <View style={tw`flex-row items-center p-4`}>
                        <FontAwesome5 name="calendar-alt" size={24} color="#3B82F6" />
                        <Text style={tw`ml-2 text-lg font-bold text-gray-900`}>
                            {item.event}
                        </Text>
                    </View>
                    <View style={tw`p-4 border-t border-gray-200`}>
                        <Text style={tw`text-sm text-gray-700`}>
                            <FontAwesome5 name="users" size={16} color="#4B5563" />{' '}
                            {item.match}
                        </Text>
                        <Text style={tw`text-sm text-gray-700 mt-1`}>
                            <FontAwesome5 name="clock" size={16} color="#4B5563" />{' '}
                            {item.time}
                        </Text>
                        <Text style={tw`text-sm text-gray-700 mt-1`}>
                            <FontAwesome5 name="tv" size={16} color="#4B5563" />{' '}
                            {item.tv}
                        </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default Bola;

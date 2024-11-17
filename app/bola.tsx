import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useState, useEffect } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

interface BolaData {
    time: string;
    event: string;
    match: string;
    tv: string;
}


const bola = () => {
    const [bola, setBola] = useState<BolaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetching data dari API
    const fetchBola = async () => {
        try {
            const response = await axios.get('https://api.lolhuman.xyz/api/jadwalbola?apikey=a3b68b54fb5bc0148e674f5c')
            setBola(response.data.result);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bola data:', error);
        }
    }
    useEffect(() => {
        fetchBola();
    }, []);

    if (!bola || bola.length === 0) {
        return <Text>No data</Text>;
    }


    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={tw`mt-4 text-gray-600 font-medium`}>Memuat jadwal pertandingan</Text>
            </View>
        );
    }


    return (
        <>
            <ScrollView style={tw`flex-1 bg-gray-50`}>
                <Text style={tw`text-2xl font-bold text-black p-4 mb-2 mt-3 `}>Jadwal Pertandingan Bola Hari ini</Text>
                {bola.map((item, index) => (
                    <View key={index} style={tw`bg-white rounded-lg shadow-sm mb-4 overflow-hidden`}>
                        <View style={tw`p-4 bg-sky-500 rounded-lg w-80 flex-1 mx-auto justify-center items-center`}>
                            <Text style={tw`text-lg font-bold text-gray-900 mb-1`}>{item.event}</Text>
                            <Text style={tw`text-sm text-white`}>{item.match}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </>
    )
}

export default bola
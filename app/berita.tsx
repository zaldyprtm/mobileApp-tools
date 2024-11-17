import { View, Text, ScrollView, ActivityIndicator, Image, RefreshControl, Pressable, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';

interface BeritaData {
    name: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
}

const ITEMS_PER_PAGE = 10;
const apiUrl = 'https://api.nexoracle.com/news/liputan6-indo?apikey=free_key@maher_apis';

const Berita = () => {
    const [berita, setBerita] = useState<BeritaData[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchBerita = async () => {
        try {
            setLoading(true);
            const response = await axios.get(apiUrl);
            setBerita(response.data.result);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching berita:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBerita();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setCurrentPage(1);
        fetchBerita().then(() => setRefreshing(false));
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Pagination calculations
    const totalPages = Math.ceil(berita.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = berita.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            scrollToTop();
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            scrollToTop();
        }
    };

    const scrollViewRef = React.useRef<ScrollView>(null);
    
    const scrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={tw`mt-4 text-gray-600 font-medium`}>Memuat Berita...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50 p-4`}>
                <FontAwesome5 name="exclamation-circle" size={40} color="#DC2626" />
                <Text style={tw`mt-4 text-gray-800 font-medium text-center`}>{error}</Text>
                <Pressable
                    onPress={fetchBerita}
                    style={tw`mt-4 bg-blue-600 px-6 py-3 rounded-lg`}
                >
                    <Text style={tw`text-white font-medium`}>Coba Lagi</Text>
                </Pressable>
            </View>
        );
    }

    const NewsCard = ({ item }: { item: BeritaData }) => (
        <Pressable
            style={tw`bg-white rounded-xl shadow-sm mb-4 overflow-hidden`}
            onPress={() => Linking.openURL(item.url)}
        >
            <Image
                source={{ uri: item.urlToImage }}
                style={tw`w-full h-48`}
                resizeMode="cover"
            />
            <View style={tw`p-4`}>
                <Text style={tw`text-lg font-bold text-gray-900 mb-2`}>
                    {item.title}
                </Text>
                <Text style={tw`text-gray-600 mb-3 leading-5`} numberOfLines={3}>
                    {item.description}
                </Text>
                <View style={tw`flex-row justify-between items-center mt-2`}>
                    <View style={tw`flex-row items-center`}>
                        <FontAwesome5 name="user" size={12} color="#6B7280" />
                        <Text style={tw`text-gray-500 text-sm ml-2`}>
                            {item.author || 'Anonymous'}
                        </Text>
                    </View>
                    <View style={tw`flex-row items-center`}>
                        <FontAwesome5 name="clock" size={12} color="#6B7280" />
                        <Text style={tw`text-gray-500 text-sm ml-2`}>
                            {formatDate(item.publishedAt)}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    // Pagination Controls component
    const PaginationControls = () => (
        <View style={tw`flex-row justify-between items-center mt-4 mb-8`}>
            <Pressable
                onPress={goToPreviousPage}
                style={tw`${currentPage === 1 ? 'opacity-50' : ''} bg-blue-600 px-4 py-2 rounded-lg flex-row items-center`}
                disabled={currentPage === 1}
            >
                <FontAwesome5 name="chevron-left" size={12} color="white" />
                <Text style={tw`text-white font-medium ml-2`}>Sebelumnya</Text>
            </Pressable>
            
            <View style={tw`flex-row items-center`}>
                <Text style={tw`text-gray-600`}>
                    Halaman {currentPage} dari {totalPages}
                </Text>
            </View>

            <Pressable
                onPress={goToNextPage}
                style={tw`${currentPage === totalPages ? 'opacity-50' : ''} bg-blue-600 px-4 py-2 rounded-lg flex-row items-center`}
                disabled={currentPage === totalPages}
            >
                <Text style={tw`text-white font-medium mr-2`}>Selanjutnya</Text>
                <FontAwesome5 name="chevron-right" size={12} color="white" />
            </Pressable>
        </View>
    );

    return (
        <ScrollView
            ref={scrollViewRef}
            style={tw`flex-1 bg-gray-50`}
            contentContainerStyle={tw`p-4`}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={tw`mb-6 mt-16`}>
                <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>
                    Seputar Berita Indonesia
                </Text>
                <Text style={tw`text-gray-600`}>
                    Berita terkini dari berbagai sumber
                </Text>
                <Text style={tw`text-gray-500 text-sm mt-2`}>
                    Menampilkan {startIndex + 1}-{Math.min(endIndex, berita.length)} dari {berita.length} berita
                </Text>
            </View>

            {currentItems.map((item, index) => (
                <NewsCard key={index} item={item} />
            ))}

            {berita.length > 0 && <PaginationControls />}

            {berita.length === 0 && !loading && !error && (
                <View style={tw`flex-1 justify-center items-center py-20`}>
                    <FontAwesome5 name="newspaper" size={40} color="#9CA3AF" />
                    <Text style={tw`text-gray-600 font-medium mt-4`}>
                        Tidak ada berita untuk ditampilkan
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

export default Berita;
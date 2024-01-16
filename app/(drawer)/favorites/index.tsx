import React, { useState, useEffect } from 'react';
import { TextInput, View, FlatList, ActivityIndicator, Modal, TouchableWithoutFeedback,} from 'react-native';
import { Button, Text, YGroup, useTheme, ListItem } from 'tamagui';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Favorite as ExternalFavorite } from '../../../interfaces/favorites';
import { Main } from '../../../tamagui.config';
import { useMMKVObject } from 'react-native-mmkv';
import { MediaType } from '../../../interfaces/apiresults';
import { getMovieDetails } from '../../../services/api';

type PageProps = {
  id: string;
  mediaType: MediaType;
};
type Favorite = {
  id: string;
  mediaType: MediaType;
  thumb: string;
  name: string;
};

const Page = ({ id, mediaType }: PageProps) => {
  const theme = useTheme();

  const [favorites, setFavorites] = useMMKVObject<ExternalFavorite[]>('favorites');
  const [recentSearches, setRecentSearches] = useMMKVObject<ExternalFavorite[]>('recentSearches');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRecentSearches, setShowRecentSearches] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const toggleRecentSearches = () => {
    setShowRecentSearches(!showRecentSearches);
    setModalVisible(false);
  };

  const movieQuery = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(+id, mediaType),
  }); 

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const toggleFavorite = async (itemId: string, itemMediaType: MediaType) => {
    const isCurrentlyFavorite = favorites?.some(
      (fav) => fav.id === itemId && fav.mediaType === itemMediaType
    );
    const newFavorite: Favorite = {
      id: itemId,
      mediaType: itemMediaType,
      thumb: movieQuery.data?.poster_path || '',
      name: movieQuery.data?.title || movieQuery.data?.name || '',
    };

    if (!isCurrentlyFavorite) {
      setFavorites([...(favorites || []), newFavorite]);

      // Use the current search query as the name for recent searches
      setRecentSearches([...(recentSearches || []), { ...newFavorite, name: searchQuery }]);
    } else {
      setFavorites(
        (favorites || []).filter((fav) => !(fav.id === itemId && fav.mediaType === itemMediaType))
      );
    }
  };

  const renderGridItem = ({ item }: { item: Favorite }) => (
    <Link key={item.id} href={`/(drawer)/favorites/${item.mediaType}/${item.id}`}>
      <YGroup bordered width={148} height={168} size="$4" margin={7} marginBottom={16}>
        <YGroup.Item key={item.id}>
          <Animated.Image
            sharedTransitionTag={`${item.mediaType === 'movie' ? 'movie' : 'tv'}-${item.id}`}
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.thumb}` }}
            style={{ width: 147, height: 130, borderRadius: 4 }}
          />
          <View style={{ marginTop: 6, alignItems: 'center' }}>
            <ListItem theme={'alt2'} title={item.name} size={'$3'} style={{ marginBottom: 8 }} />
            <Button
              unstyled
              onPress={() => toggleFavorite(item.id, item.mediaType)}
              scale={0.95}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.975 }}
              animation={'bouncy'}
              alignSelf='flex-start'
              style={{ marginBottom: 14, marginLeft: 6, position: 'absolute', top: 0, right: 0 }}
            >
              <Ionicons
                name={
                  favorites && favorites.some((fav) => fav.id === item.id)
                    ? 'heart'
                    : 'heart-outline'
                }
                size={22}
                color={theme.blue9?.get()}
              />
            </Button>
          </View>
        </YGroup.Item>
      </YGroup>
    </Link>
  );

  const renderRecentSearchesItem = ({ item }: { item: Favorite }) => (
    <Link key={item.id} href={`/(drawer)/favorites/${item.mediaType}/${item.id}`}>
      <YGroup bordered width={150} height={170} size="$4" margin={7} marginBottom={16}>
        <YGroup.Item key={item.id}>
          <Animated.Image
            sharedTransitionTag={`${item.mediaType === 'movie' ? 'movie' : 'tv'}-${item.id}`}
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.thumb}` }}
            style={{ width: 130, height: 130, borderRadius: 3 }}
          />
          <View style={{ marginTop: 6, alignItems: 'center' }}>
            <ListItem theme={'alt2'} title={item.name} size={'$3'} style={{ marginBottom: 8 }} />
            <Button
              unstyled
              onPress={() => toggleFavorite(item.id, item.mediaType)}
              scale={0.95}
              hoverStyle={{ scale: 0.925 }}
              pressStyle={{ scale: 0.975 }}
              animation={'bouncy'}
              alignSelf='flex-start'
              style={{ marginBottom: 15, marginLeft: 6, position: 'absolute', top: 0, right: 0 }}
            >
              <Ionicons
                name={
                  favorites && favorites.some((fav) => fav.id === item.id)
                    ? 'heart'
                    : 'heart-outline'
                }
                size={22}
                color={theme.blue9?.get()}
              />
            </Button>
          </View>
        </YGroup.Item>
      </YGroup>
    </Link>
  );

  const filteredFavorites = favorites?.filter(
    (fav) => fav.name && fav.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecentSearches = recentSearches?.filter(
    (fav) => fav.name && fav.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRecentSearchesButton = () => (
    <Button
      onPress={() => setModalVisible(true)}
      style={{
        marginBottom: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#325aa8',
        borderRadius: 8,
        width: 280,
        marginLeft: 50,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {showRecentSearches ? 'Hide Recent Searches' : 'Show Recent Searches'}
      </Text>
    </Button>
  );
  console.log({recentSearches})
const renderRecentSearches = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View style={{ width: 300, height: 400, backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <Text style={{ color: 'blue', textAlign: 'right', marginRight: 10, marginTop: 5 }}>Close</Text>
          </TouchableWithoutFeedback>
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item.id}
            renderItem={renderRecentSearchesItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginVertical: 10 }}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </View>
      </View>
    </Modal>
  );
  console.log({Modal})

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const saveRecentSearches = async () => {
    try {
      await AsyncStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const savedRecentSearches = await AsyncStorage.getItem('recentSearches');
      if (savedRecentSearches) {
        setRecentSearches(JSON.parse(savedRecentSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };
  return (
    <Main>
      <View style={{ padding: 10 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#325aa8',
            borderWidth: 2,
            marginLeft: 21,
            marginBottom: 10,
            marginTop: 16,
            borderRadius: 6,
            width: 330,
            paddingLeft: 10,
          }}
          placeholderTextColor={'black'}
          placeholder="Search for favorites, tv, show, person...."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)} />
        {movieQuery.isLoading && <ActivityIndicator size="small" color={theme.blue9.get()} />}
      </View>
      {renderRecentSearchesButton()}
      {renderRecentSearches()}
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        renderItem={renderGridItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginVertical: 10 }}
        contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 10, justifyContent: 'space-around' }}
        style={{ marginTop: 13 }}
      />
      <View style={{ marginTop: 10, marginBottom: 7 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}></Text>
        <FlatList
          data={filteredRecentSearches}
          keyExtractor={(item) => item.id}
          renderItem={renderRecentSearchesItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginVertical: 10 }}
          contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 10, justifyContent: 'space-around' }}
        />
      </View>
    </Main>
  );
};
export default Page;
 


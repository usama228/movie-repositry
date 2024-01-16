import { MediaType } from "@/interfaces/apiresults";
import { getMovieDetails } from '../services/api';
import { Main } from '../tamagui.config';
import { useQuery } from "@tanstack/react-query";
import { View, ImageBackground } from "react-native";
import Animated from "react-native-reanimated";
import { H1, Image,ScrollView, YStack,Text, Paragraph, Button, useTheme } from "tamagui";
import { useMMKVBoolean } from "react-native-mmkv";
import { useMMKVObject } from "react-native-mmkv";
import { Favorite } from "@/interfaces/favorites";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

type DetailsPageProps = {
    id: string;
    mediaType: MediaType;
  };
  const DetailsPage = ({ id, mediaType }: DetailsPageProps) => {
    const [isFavorite, setIsFavorite] = useMMKVBoolean(`${mediaType}-${id}`);
    const [favorites, setFavorites] = useMMKVObject<Favorite[]>('favorites');
  
    useEffect(() => {
      const current = favorites || [];
      let isFav = current.some((fav) => fav.id === id && fav.mediaType === mediaType)
 
      setIsFavorite(isFav);
     
    }, [favorites])
    
    
    const theme = useTheme();

    console.log({favorites})
  
    const movieQuery = useQuery({
      queryKey: ['movie', id],
      queryFn: () => getMovieDetails(+id, mediaType),
    });
  
    const toggleFavorite = (itemId: string, itemMediaType: MediaType) => {
      const current = favorites || [];
      const isCurrentlyFavorite = current.some((fav) => fav.id === itemId && fav.mediaType === itemMediaType);
  
      if (!isCurrentlyFavorite) {
        setFavorites([
          ...current,
          {
            id: itemId,
            mediaType: itemMediaType,
            thumb: movieQuery.data?.poster_path,
            name: movieQuery.data?.title || movieQuery.data?.name,
          },
        ]);
      } else {
        setFavorites(current.filter((fav) => !(fav.id === itemId && fav.mediaType === itemMediaType)));
      }
  
      
    };
  
  
    return (
      <Main>
        <Stack.Screen
          options={{
            headerRight: () => (
              <Button
                unstyled
                onPress={() => toggleFavorite(id, mediaType)} // Pass unique id and mediaType
                scale={0.95}
                hoverStyle={{ scale: 0.925 }}
                pressStyle={{ scale: 0.975 }}
                animation={'bouncy'}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={26}
                  color={theme.blue9.get()}
                />
              </Button>
            ),
          }}
        />
        <ScrollView>
          <ImageBackground
            source={{
              uri: `https://image.tmdb.org/t/p/w400${movieQuery.data?.backdrop_path}`,
            }}>
            <Animated.Image
              borderRadius={6}
              source={{
                uri: `https://image.tmdb.org/t/p/w400${movieQuery.data?.poster_path}`,
              }}
              style={{ width: 200, height: 300, margin: 10 }}
              sharedTransitionTag={`${mediaType === 'movie' ? 'movie' : 'tv'}-${id}`}
            />
          </ImageBackground>
  
          <YStack
            p={10}
            animation={'lazy'}
            enterStyle={{
              opacity: 0,
              y: 10,
            }}>
            <H1 color={'$blue7'}>
              {movieQuery.data?.title || movieQuery.data?.name} <Text fontSize={16}>(2023)</Text>
            </H1>
            <Paragraph theme={'alt2'}>{movieQuery.data?.tagline}</Paragraph>
            <Text fontSize={16}>{movieQuery.data?.overview}</Text>
          </YStack>
        </ScrollView>
      </Main>
    );
  };
  export default DetailsPage;
  
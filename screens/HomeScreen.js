// screens/HomeScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import CollectionCard from '../components/CollectionCard';
import { fetchFeaturedProducts, fetchCollections } from '../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef(null);
  
  // Animações para fade-in dos elementos
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Simular chamada de API para um backend Java
    const loadData = async () => {
      try {
        // Em produção, estas seriam chamadas reais para seu backend Java
        const productsData = await fetchFeaturedProducts();
        const collectionsData = await fetchCollections();
        
        setFeaturedProducts(productsData);
        setCollections(collectionsData);
        setIsLoading(false);
        
        // Iniciar animação de fade-in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Animação do header ao rolar
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const renderCarouselItem = ({ item }) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Product', { product: item })}
        style={styles.carouselItem}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.carouselImage}
          resizeMode="cover"
        />
        <View style={styles.carouselOverlay}>
          <Text style={styles.carouselBrand}>{item.brand}</Text>
          <Text style={styles.carouselName}>{item.name}</Text>
          <Text style={styles.carouselPrice}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header com animação */}
      <Header 
        scrollY={scrollY} 
        navigation={navigation} 
        cartItemCount={3} 
      />
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Carrossel de produtos em destaque */}
        <Animated.View style={[styles.carouselContainer, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Em Destaque</Text>
          
          {!isLoading && (
            <Carousel
              ref={carouselRef}
              data={featuredProducts}
              renderItem={renderCarouselItem}
              sliderWidth={width}
              itemWidth={width * 0.8}
              inactiveSlideScale={0.95}
              inactiveSlideOpacity={0.7}
              containerCustomStyle={styles.carousel}
              autoplay={true}
              autoplayInterval={5000}
              loop={true}
              enableMomentum={false}
              lockScrollWhileSnapping={true}
            />
          )}
        </Animated.View>
        
        {/* Coleções */}
        <Animated.View 
          style={[
            styles.collectionsContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ 
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                }) 
              }] 
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Coleções</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Ver todas</Text>
              <Feather name="chevron-right" size={16} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.collectionsScroll}
          >
            {!isLoading && collections.map((collection, index) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection}
                index={index}
                onPress={() => console.log('Coleção:', collection.name)}
              />
            ))}
          </ScrollView>
        </Animated.View>
        
        {/* Novidades */}
        <Animated.View 
          style={[
            styles.newArrivalsContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ 
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                }) 
              }] 
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Novidades</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Ver todas</Text>
              <Feather name="chevron-right" size={16} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsGrid}>
            {!isLoading && featuredProducts.slice(0, 4).map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
                onPress={() => navigation.navigate('Product', { product })}
              />
            ))}
          </View>
        </Animated.View>
        
        {/* Designers Internacionais */}
        <Animated.View 
          style={[
            styles.designersContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ 
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                }) 
              }] 
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Designers Internacionais</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.designersScroll}
          >
            {!isLoading && [
              { id: 1, name: 'Balenciaga', logo: 'https://placehold.co/200x100/111/fff?text=Balenciaga' },
              { id: 2, name: 'Gucci', logo: 'https://placehold.co/200x100/111/fff?text=Gucci' },
              { id: 3, name: 'Prada', logo: 'https://placehold.co/200x100/111/fff?text=Prada' },
              { id: 4, name: 'Saint Laurent', logo: 'https://placehold.co/200x100/111/fff?text=Saint+Laurent' },
              { id: 5, name: 'Dior', logo: 'https://placehold.co/200x100/111/fff?text=Dior' },
            ].map((designer, index) => (
              <TouchableOpacity 
                key={designer.id}
                style={styles.designerCard}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: designer.logo }}
                  style={styles.designerLogo}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 40,
  },
  carouselContainer: {
    marginBottom: 30,
  },
  carousel: {
    marginTop: 15,
  },
  carouselItem: {
    height: 450,
    borderRadius: 8,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  carouselBrand: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  carouselName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  carouselPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#000',
    marginRight: 4,
  },
  collectionsContainer: {
    marginBottom: 30,
  },
  collectionsScroll: {
    paddingHorizontal: 15,
  },
  newArrivalsContainer: {
    marginBottom: 30,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  designersContainer: {
    marginBottom: 30,
  },
  designersScroll: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  designerCard: {
    width: 120,
    height: 60,
    marginHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  designerLogo: {
    width: '100%',
    height: '100%',
  },
});
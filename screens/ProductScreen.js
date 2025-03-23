// screens/ProductScreen.js
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import { addToCart } from '../services/api';

const { width } = Dimensions.get('window');

export default function ProductScreen({ route, navigation }) {
  const { product } = route.params;
  const insets = useSafeAreaInsets();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Imagens simuladas do produto
  const productImages = [
    { id: 1, uri: product.image },
    { id: 2, uri: 'https://placehold.co/600x800/111/fff?text=Detalhe+1' },
    { id: 3, uri: 'https://placehold.co/600x800/111/fff?text=Detalhe+2' },
    { id: 4, uri: 'https://placehold.co/600x800/111/fff?text=Detalhe+3' },
  ];
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const renderImageItem = ({ item }) => {
    return (
      <Image 
        source={{ uri: item.uri }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    );
  };
  
  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho');
      return;
    }
    
    try {
      await addToCart(product.id, quantity);
      alert('Produto adicionado ao carrinho!');
    } catch (error) {
      alert('Erro ao adicionar ao carrinho');
    }
  };
  
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10 }
        ]}
      >
        {/* Carrossel de imagens do produto */}
        <View style={styles.carouselContainer}>
          <Carousel
            data={productImages}
            renderItem={renderImageItem}
            sliderWidth={width}
            itemWidth={width}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            enableMomentum={true}
            lockScrollWhileSnapping={false}
            loop={false}
            autoplay={false}
          />
        </View>
        
        <Animated.View 
          style={[
            styles.productInfo,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{product.brand}</Text>
            <TouchableOpacity style={styles.favoriteButton}>
              <Feather name="heart" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Tamanho</Text>
          <View style={styles.sizesContainer}>
            {['PP', 'P', 'M', 'G', 'GG'].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSizeButton
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text 
                  style={[
                    styles.sizeButtonText,
                    selectedSize === size && styles.selectedSizeButtonText
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Quantidade</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <Feather name="minus" size={18} color="#000" />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Feather name="plus" size={18} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Detalhes</Text>
          <Text style={styles.description}>
            Peça exclusiva da coleção {product.brand}. Fabricada com materiais premium e acabamento de alta qualidade. Design atemporal que combina com diversas ocasiões.
          </Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Entrega</Text>
          <View style={styles.deliveryInfo}>
            <Feather name="truck" size={18} color="#000" style={styles.deliveryIcon} />
            <Text style={styles.deliveryText}>
              Frete grátis para todo o Brasil em compras acima de R$ 1.000
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Autenticidade</Text>
          <Text style={styles.description}>
            Todos os produtos vendidos na 1312 archive são 100% autênticos e verificados por nossa equipe especializada.
          </Text>
        </Animated.View>
      </Animated.ScrollView>
      
      {/* Header flutuante */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Feather name="shopping-bag" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Botão de adicionar ao carrinho */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartButtonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    height: 500,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 20,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    color: '#666',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSizeButton: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  sizeButtonText: {
    fontSize: 14,
    color: '#000',
  },
  selectedSizeButtonText: {
    color: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryIcon: {
    marginRight: 10,
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 20,
  },
  addToCartButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
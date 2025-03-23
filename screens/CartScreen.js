// screens/CartScreen.js
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
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

// Dados simulados do carrinho
const initialCartItems = [
  {
    id: 1,
    name: 'Jaqueta Oversized',
    brand: 'Balenciaga',
    price: 4990,
    quantity: 1,
    size: 'M',
    image: 'https://placehold.co/600x800/111/fff?text=Jaqueta',
  },
  {
    id: 2,
    name: 'Calça Wide Leg',
    brand: 'Prada',
    price: 3590,
    quantity: 1,
    size: 'P',
    image: 'https://placehold.co/600x800/111/fff?text=Calça',
  },
  {
    id: 3,
    name: 'Tênis Chunky',
    brand: 'Balenciaga',
    price: 6490,
    quantity: 1,
    size: '40',
    image: 'https://placehold.co/600x800/111/fff?text=Tênis',
  },
];

// Produtos recomendados
const recommendedProducts = [
  {
    id: 4,
    name: 'Blazer Estruturado',
    brand: 'Gucci',
    price: 'R$ 7.290,00',
    image: 'https://placehold.co/600x800/111/fff?text=Blazer',
  },
  {
    id: 5,
    name: 'Vestido Slip',
    brand: 'Saint Laurent',
    price: 'R$ 5.790,00',
    image: 'https://placehold.co/600x800/111/fff?text=Vestido',
  },
  {
    id: 6,
    name: 'Camiseta Estampada',
    brand: 'Off-White',
    price: 'R$ 1.990,00',
    image: 'https://placehold.co/600x800/111/fff?text=Camiseta',
  },
  {
    id: 7,
    name: 'Bolsa Estruturada',
    brand: 'Prada',
    price: 'R$ 8.990,00',
    image: 'https://placehold.co/600x800/111/fff?text=Bolsa',
  },
];

// Formatar preço em reais
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
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
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calcular frete (grátis acima de R$ 1000)
  const shipping = subtotal >= 1000 ? 0 : 50;
  
  // Calcular total
  const total = subtotal + shipping;
  
  // Atualizar quantidade
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Remover item
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  // Renderizar item do carrinho
  const renderCartItem = (item, index) => {
    return (
      <Animated.View 
        key={item.id}
        style={[
          styles.cartItem,
          {
            opacity: fadeAnim,
            transform: [{ 
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20 * (index + 1), 0]
              }) 
            }]
          }
        ]}
      >
        <View style={styles.cartItemImageContainer}>
          <Image 
            source={{ uri: item.image }}
            style={styles.cartItemImage}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.cartItemContent}>
          <View style={styles.cartItemHeader}>
            <View>
              <Text style={styles.cartItemBrand}>{item.brand}</Text>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemSize}>Tamanho: {item.size}</Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => removeItem(item.id)}
              style={styles.removeButton}
            >
              <Feather name="x" size={18} color="#999" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cartItemFooter}>
            <View style={styles.quantityControl}>
              <TouchableOpacity 
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
                style={styles.quantityButton}
              >
                <Feather name="minus" size={14} color="#000" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity 
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
                style={styles.quantityButton}
              >
                <Feather name="plus" size={14} color="#000" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.cartItemPrice}>
              {formatPrice(item.price * item.quantity)}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };
  
  // Renderizar carrinho vazio
  const renderEmptyCart = () => {
    return (
      <Animated.View 
        style={[
          styles.emptyCartContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.emptyCartIcon}>
          <Feather name="shopping-bag" size={48} color="#ccc" />
        </View>
        <Text style={styles.emptyCartTitle}>Seu carrinho está vazio</Text>
        <Text style={styles.emptyCartText}>
          Parece que você ainda não adicionou nenhum item ao seu carrinho.
        </Text>
        <TouchableOpacity 
          style={styles.continueShoppingButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.continueShoppingButtonText}>Continuar comprando</Text>
          <Feather name="arrow-right" size={16} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[
        styles.header, 
        { paddingTop: insets.top + 10 }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Carrinho</Text>
        
        <View style={{ width: 40 }} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIndicator} />
          <Text style={styles.loadingText}>Carregando seu carrinho...</Text>
        </View>
      ) : cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 }
          ]}
        >
          {/* Lista de itens */}
          <View style={styles.cartItemsContainer}>
            <Text style={styles.sectionTitle}>
              Itens no carrinho ({cartItems.length})
            </Text>
            
            {cartItems.map(renderCartItem)}
          </View>
          
          {/* Resumo do pedido */}
          <Animated.View 
            style={[
              styles.orderSummary,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Resumo do pedido</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frete</Text>
              <Text style={styles.summaryValue}>
                {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
              </Text>
            </View>
            
            {shipping === 0 && (
              <View style={styles.freeShippingNote}>
                <Text style={styles.freeShippingNoteText}>
                  Frete grátis para compras acima de R$ 1.000
                </Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
            
            <Text style={styles.taxNote}>Impostos inclusos</Text>
          </Animated.View>
          
          {/* Produtos recomendados */}
          <View style={styles.recommendedContainer}>
            <Text style={styles.sectionTitle}>Você também pode gostar</Text>
            
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedScroll}
            >
              {recommendedProducts.map((product, index) => (
                <Animated.View
                  key={product.id}
                  style={[
                    styles.recommendedItem,
                    {
                      opacity: fadeAnim,
                      transform: [{ 
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50 * (index + 1), 0]
                        }) 
                      }]
                    }
                  ]}
                >
                  <TouchableOpacity 
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('Product', { product })}
                  >
                    <View style={styles.recommendedImageContainer}>
                      <Image 
                        source={{ uri: product.image }}
                        style={styles.recommendedImage}
                        resizeMode="cover"
                      />
                      <View style={styles.recommendedOverlay}>
                        <View style={styles.recommendedActions}>
                          <TouchableOpacity style={styles.recommendedActionButton}>
                            <Feather name="heart" size={14} color="#000" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.recommendedActionButton}>
                            <Feather name="shopping-bag" size={14} color="#000" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={styles.recommendedInfo}>
                      <Text style={styles.recommendedBrand}>{product.brand}</Text>
                      <Text style={styles.recommendedName}>{product.name}</Text>
                      <Text style={styles.recommendedPrice}>{product.price}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}
      
      {/* Botão de checkout */}
      {!isLoading && cartItems.length > 0 && (
        <View style={[
          styles.checkoutContainer,
          { paddingBottom: insets.bottom || 20 }
        ]}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => alert('Processando pedido...')}
          >
            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.continueShoppingLink}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingLinkText}>Continuar comprando</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#f0f0f0',
    borderTopColor: '#000',
    transform: [{ rotate: '45deg' }],
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#999',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 250,
  },
  continueShoppingButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueShoppingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  cartItemsContainer: {
    marginBottom: 24,
  },
  cartItem: {
    flexDirection: 'row',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cartItemImageContainer: {
    width: 80,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  cartItemImage: {
    width: '100%',
    height: '100%',
  },
  cartItemContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartItemBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  cartItemSize: {
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderSummary: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  freeShippingNote: {
    backgroundColor: '#e6f7e6',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  freeShippingNoteText: {
    fontSize: 12,
    color: '#2e7d32',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  taxNote: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 16,
  },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  continueShoppingLink: {
    marginTop: 12,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueShoppingLinkText: {
    fontSize: 14,
    color: '#000',
  },
  recommendedContainer: {
    marginBottom: 24,
  },
  recommendedScroll: {
    paddingBottom: 8,
  },
  recommendedItem: {
    width: 150,
    marginRight: 16,
  },
  recommendedImageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  recommendedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  recommendedActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  recommendedActionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  recommendedInfo: {
    marginTop: 8,
  },
  recommendedBrand: {
    fontSize: 12,
    color: '#666',
  },
  recommendedName: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 2,
  },
  recommendedPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
});
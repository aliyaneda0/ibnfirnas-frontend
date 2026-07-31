import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet, View, Text, ImageBackground,
  Dimensions, TouchableOpacity, FlatList, Animated
} from 'react-native'
import { router } from 'expo-router'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const HERO_DATA = [
  {
    id: '1',
    title: 'SMART INDUSTRIAL',
    highlight: 'AUTOMATION SOLUTIONS',
    subtitle: 'Optimize your production with intelligent automation — from motion control to complete factory integration.',
    buttonText: 'DISCOVER MORE',
    image: require('../../assets/images/hero_bg_1.png'),
    route: '/(tabs)/services',
  },
  {
    id: '2',
    title: 'COMPLETE AUTOMATION',
    highlight: 'UNDER ONE ROOF',
    subtitle: 'From PLCs to servo systems, we design solutions that maximize performance and minimize downtime.',
    buttonText: 'DISCOVER MORE',
    image: require('../../assets/images/hero_bg_2.png'),
    route: '/(tabs)/services',
  },
  {
    id: '3',
    title: 'EMPOWERING QATAR WITH',
    highlight: 'SMART AUTOMATION',
    subtitle: 'Reliable automation, control, and repair solutions for every industry in Qatar.',
    buttonText: 'EXPLORE SERVICES',
    image: require('../../assets/images/hero_bg_3.png'),
    route: '/(tabs)/services',
  },
  {
    id: '4',
    title: 'INNOVATIVE AUTOMATIC',
    highlight: 'DOOR SOLUTIONS',
    subtitle: 'Smart automation with high-performance sectional, rolling, and swing door systems.',
    buttonText: 'LEARN MORE',
    image: require('../../assets/images/hero_bg_4.png'),
    route: '/(tabs)/products',
  },
]

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % HERO_DATA.length
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
      setActiveIndex(nextIndex)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeIndex])

  const renderItem = ({ item }: { item: typeof HERO_DATA[0] }) => (
    <ImageBackground source={item.image} style={styles.slide} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {item.title}{'\n'}
            <Text style={styles.highlight}>{item.highlight}</Text>
          </Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={styles.buttonText}>{item.buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={HERO_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          setActiveIndex(Math.round(ev.nativeEvent.contentOffset.x / SCREEN_WIDTH))
        }}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {HERO_DATA.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: activeIndex === index
                  ? '#C9A84C'
                  : 'rgba(255,255,255,0.5)',
                width: activeIndex === index ? 20 : 8,
              }
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 420,
    width: '100%',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: 420,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  contentContainer: {
    maxWidth: '88%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
    lineHeight: 36,
    textTransform: 'uppercase',
  },
  highlight: {
    color: '#C9A84C',
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: '#F1FAEE',
    fontSize: 14,
    marginTop: 12,
    lineHeight: 22,
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#1E3A5F',
    borderWidth: 1,
    borderColor: '#C9A84C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginTop: 24,
    alignSelf: 'flex-start',
    elevation: 6,
  },
  buttonText: {
    color: '#C9A84C',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
})

export default HeroSlider
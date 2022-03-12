import { View, ActivityIndicator } from 'react-native'
import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

import styles from './SplashScreen.style';

const SplashScreen = () => {
    const naviagation = useNavigation()
    useEffect(() => {
        if(isAuthenticated()) {
            naviagation.navigate('Home')
        } else {
            naviagation.navigate('SignInScreen')
        }
    },[])
    
    const isAuthenticated = () => {
        return false
    }

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#999999' />
    </View>
  )
}

export default SplashScreen
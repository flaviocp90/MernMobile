import { View, ActivityIndicator } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

import styles from "./SplashScreen.style";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = () => {
  const naviagation = useNavigation();
  useEffect(() => {
    const checkUser = async () => {
      if (await isAuthenticated()) {
        naviagation.navigate("Home");
      } else {
        naviagation.navigate("SignInScreen");
      }
    };
    checkUser();
  }, []);

  const isAuthenticated = async () => {
    /* await AsyncStorage.removeItem("token"); */
    const token = await AsyncStorage.getItem("token");
    return !!token;
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#999999" />
    </View>
  );
};

export default SplashScreen;

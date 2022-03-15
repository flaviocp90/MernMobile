import { View, Text, TextInput, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";

import { SIGN_IN_MUTATION } from "../../graphql/mutation/signInMutation";
import styles from "./SignInScreen.style";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

  useEffect(() => {
    if (error) {
      Alert.alert("Invalid credentials, try again");
    }
  }, [error]);

  if (data) {
    AsyncStorage.setItem("token", data.signIn.token).then(() => {
      navigation.navigate("Home");
    });
  }

  const onSubmit = () => {
    signIn({ variables: { email, password } });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.emailInput}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.passInput}
        secureTextEntry
      />
      <Pressable onPress={onSubmit} style={styles.submit}>
        <Text style={styles.submitText}>Sign In</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("SignUpScreen")}
        style={styles.submitSignUp}
      >
        <Text style={styles.signUpText}>New here? Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default SignInScreen;

import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SIGN_UP_MUTATION } from "../../graphql/mutation/signUpMutation";
import styles from "./SignUpScreen.style";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigation = useNavigation();

  const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION);

  if (error) {
    Alert.alert("Error signing up. Try again");
  }

  if (data) {
    AsyncStorage.setItem("token", data.signUp.token).then(() => {
      navigation.navigate("Home");
    });
  }

  const onSubmit = () => {
    signUp({ variables: { name, email, password } });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.emailInput}
      />
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
        {loading && <ActivityIndicator />}
        <Text style={styles.submitText}>Sign Up</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("SignInScreen")}
        style={styles.submitSignUp}
      >
        <Text style={styles.signUpText}>Already have an account? Sign In</Text>
      </Pressable>
    </View>
  );
};

export default SignInScreen;

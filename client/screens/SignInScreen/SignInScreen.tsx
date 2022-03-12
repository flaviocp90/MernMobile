import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "./SignInScreen.style";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    // submit
  };

  const navigation = useNavigation();

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
        onPress={() => navigation.navigate('SignUpScreen')}
        style={styles.submitSignUp}
      >
        <Text style={styles.signUpText}>New here? Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default SignInScreen;

import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

import styles from "./CheckBox.style";

interface CheckBoxProps {
  isChecked: boolean;
  onPress: () => void;
}

const CheckBox = (props: CheckBoxProps) => {
  const name = props.isChecked
    ? "checkbox-marked-outline"
    : "checkbox-blank-outline";
  return (
    <Pressable onPress={props.onPress}>
      <MaterialCommunityIcons name={name} size={24} color="white" />
    </Pressable>
  );
};

export default CheckBox;

import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import React from "react";

import styles from "./ProjectItem.style";

const ProjectItem = () => {
  return (
    <View style={styles.root}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="file-outline" color="grey" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Title</Text>
        <Text style={styles.time}>2d</Text>
      </View>
    </View>
  );
};

export default ProjectItem;

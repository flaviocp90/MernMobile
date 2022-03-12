import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import React from "react";

import styles from "./ProjectItem.style";

interface ProjectItemProps {
  project: {
    id: string;
    title: string;
    createdAt: string;
  };
}

const ProjectItem = ({ project }: ProjectItemProps) => {

  const handlePress = () => {
    console.warn(`open project ${project.title}`)
  }

  return (
    <Pressable onPress={handlePress} style={styles.root}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="file-outline" color="grey" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.time}>{project.createdAt}</Text>
      </View>
    </Pressable>
  );
};

export default ProjectItem;

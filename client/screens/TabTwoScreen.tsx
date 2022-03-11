import { StyleSheet } from "react-native";

import ProjectItem from "../components/ProjectItem/ProjectItem";
import { View } from "../components/Themed";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <ProjectItem />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { useQuery } from "@apollo/client";

import ProjectItem from "../../components/ProjectItem/ProjectItem";
import { View } from "../../components/Themed";
import styles from "./ProjectsScreen.style";
import { MY_PROJECTS } from "../../graphql/Query/taskList";

export default function ProjectsScreen() {
  const [project, setProjects] = useState([]);

  const { data, error, loading } = useQuery(MY_PROJECTS);

  useEffect(() => {
    if (error) {
      Alert.alert("Error fetching projects", error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProjects(data.myTaskLists);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <FlatList
        data={project}
        renderItem={({ item }) => <ProjectItem project={item} />}
        style={{ width: "100%" }}
      />
    </View>
  );
}

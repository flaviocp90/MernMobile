import { useState } from "react";
import { StyleSheet, FlatList } from "react-native";

import ProjectItem from "../components/ProjectItem/ProjectItem";
import { View } from "../components/Themed";

export default function TabTwoScreen() {
  const [project, setProjects] = useState([{
    id: '1',
    title: 'Project 1',
    createdAt: '2d'
  },{
    id: '2',
    title: 'Project 2',
    createdAt: '7d'
  },{
    id: '3',
    title: 'Project 3',
    createdAt: '5d'
  },
]);

  return (
    <View style={styles.container}>
      <FlatList 
        data={project}
        renderItem={({item}) => <ProjectItem project={item}/>}
        style={{width: '100%'}}
      />
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

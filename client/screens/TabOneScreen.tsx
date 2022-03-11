import { FlatList, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";

import { View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import ToDoItem from "../components/ToDoItem/ToDoItem";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  let id: "4";
  const [todos, setTodos] = useState([
    {
      id: "1",
      content: "Buy apple",
      isCompleted: true,
    },
    {
      id: "2",
      content: "Buy milk",
      isCompleted: false,
    },
    {
      id: "3",
      content: "Buy somethink",
      isCompleted: false,
    },
    {
      id: "1",
      content: "Buy new Iphone",
      isCompleted: false,
    },
  ]);

  const createNewItem = (atIndex: number) => {
    const newTodos = [...todos];
    newTodos.splice(atIndex, 0, {
      id: "4",
      content: "",
      isCompleted: "",
    });
    setTodos(newTodos);
  };
  const [title, setTitle] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        value={title}
        onChangeText={setTitle}
        placeholder={"Title"}
      />
      <FlatList
        data={todos}
        renderItem={({ item, index }) => (
          <ToDoItem todo={item} onSubmit={() => createNewItem(index + 1)} />
        )}
        style={{ width: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    width: "100%",
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 12
  },
});

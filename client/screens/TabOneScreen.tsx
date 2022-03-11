import {
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React, { useState } from "react";

import { RootTabScreenProps } from "../types";
import ToDoItem from "../components/ToDoItem/ToDoItem";
let id: "4";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [todos, setTodos] = useState([
    {
      id: id,
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
      id: id,
      content: "",
      isCompleted: false,
    });
    setTodos(newTodos);
  };
  const [title, setTitle] = useState("");

  return (
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={"position"}
        keyboardVerticalOffset={-80}
      >
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
      </KeyboardAvoidingView>
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
    marginBottom: 12,
  },
});

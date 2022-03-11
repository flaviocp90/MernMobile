import { View } from "react-native";
import { TextInput } from "react-native";
import React, { useState, useEffect, useRef } from "react";

import Checkbox from "../Checkbox/CheckBox";
import styles from "./ToDoItem.style";

interface ToDoItemProps {
  todo: {
    id: String;
    content: String;
    isCompleted: Boolean;
  };
  onSubmit: () => void;
}

const ToDoItem = ({ todo, onSubmit }: ToDoItemProps) => {
  const [check, setCheck] = useState(false);
  const [content, setContent] = useState("");
  const input = useRef(null);

  useEffect(() => {
    if (!todo) {
      return;
    }
    setCheck(todo.isCompleted);
    setContent(todo.content);
  }, [todo]);

  useEffect(() => {
    if (input.current) {
      input?.current?.focus();
    }
  }, [input]);

  return (
    <View style={styles.elementContainer}>
      <Checkbox
        isChecked={check}
        onPress={() => {
          setCheck(!check);
        }}
      />
      <TextInput
        style={styles.textInput}
        ref={input}
        multiline
        value={content}
        onChangeText={setContent}
        onSubmitEditing={onSubmit}
        blurOnSubmit
      />
    </View>
  );
};

export default ToDoItem;

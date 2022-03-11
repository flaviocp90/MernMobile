import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginRight: 5,
  },
  time: {
    color: "darkgrey",
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#404040",
    marginRight: 10,
  },
  root: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
  },
  textContainer: { flexDirection: "row", alignItems: "center" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;

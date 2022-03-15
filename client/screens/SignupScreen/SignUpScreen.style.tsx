import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  emailInput: {
    color: "white",
    fontSize: 18,
    width: "100%",
    marginVertical: 10,
  },
  passInput: {
    color: "white",
    fontSize: 18,
    width: "100%",
    marginVertical: 10,
  },
  container: {
    padding: 20,
  },
  submit: {
    backgroundColor: "#e33862",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    flexDirection: 'row',
    alignItems: "center",
    marginTop: 30,
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  signUpText: {
    color: "#e33862",
    fontWeight: "bold",
    fontSize: 18,
  },
  submitSignUp: {
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,

  }
});

export default styles;

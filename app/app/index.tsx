// app/index.tsx
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

const generatePaceOptions = () => {
  const options = [];
  for (let min = 3; min <= 10; min++) {
    options.push(`${min}:00`);
    options.push(`${min}:30`);
  }
  return options;
};

export default function HomeScreen() {
  const paces = generatePaceOptions();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>페이스를 선택하세요</Text>
      {paces.map((pace) => (
        <Pressable
          key={pace}
          style={styles.button}
          onPress={() => router.push(`/play/${pace.replace(":", "")}`)}
        >
          <Text style={styles.buttonText}>{pace} / km</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    gap: 12
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16
  },
  button: {
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    width: "80%",
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 18
  }
});

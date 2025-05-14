// app/index.tsx
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";

const paceOptions = Array.from({ length: 15 }, (_, i) => {
  const min = 3 + Math.floor(i / 2);
  const sec = i % 2 === 0 ? "00" : "30";
  return `${min}:${sec}`;
});

const sounds = ["beep", "clave", "footstep", "metronome", "snare"];
const modes = ["treadmill", "outdoor", "runningmachine"];

export default function HomeScreen() {
  const [pace, setPace] = useState("5:30");
  const [sound, setSound] = useState("metronome");
  const [mode, setMode] = useState("outdoor");
  const [strideLength, setStrideLength] = useState("110");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Running Settings</Text>

      <Text style={styles.label}>1km Pace</Text>
      <Picker
        selectedValue={pace}
        onValueChange={(itemValue) => setPace(itemValue)}
        style={styles.picker}
      >
        {paceOptions.map((option) => (
          <Picker.Item label={`${option} / km`} value={option} key={option} />
        ))}
      </Picker>

      <Text style={styles.label}>Sound</Text>
      <Picker
        selectedValue={sound}
        onValueChange={(itemValue) => setSound(itemValue)}
        style={styles.picker}
      >
        {sounds.map((s) => (
          <Picker.Item label={s} value={s} key={s} />
        ))}
      </Picker>

      <Text style={styles.label}>Running Mode</Text>
      <Picker
        selectedValue={mode}
        onValueChange={(itemValue) => setMode(itemValue)}
        style={styles.picker}
      >
        {modes.map((m) => (
          <Picker.Item label={m} value={m} key={m} />
        ))}
      </Picker>

      <Text style={styles.label}>Stride Length (cm)</Text>
      <TextInput
        value={strideLength}
        onChangeText={setStrideLength}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button
        title="시작하기"
        onPress={() =>
          router.push({
            pathname: "/play",
            params: {
              pace: pace.replace(":", ""),
              sound,
              mode,
              strideLength
            }
          })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 24, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center"
  },
  label: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  block: { marginBottom: 24 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  picker: {
    height: 50,
    width: "100%"
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    width: 100
  }
});

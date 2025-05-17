// app/index.tsx
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const paceOptions = Array.from({ length: 15 }, (_, i) => {
  const min = 3 + Math.floor(i / 2);
  const sec = i % 2 === 0 ? "00" : "30";
  return `${min}:${sec}`;
});

const sounds = ["beep", "clave", "footstep", "metronome", "snare"];

export default function HomeScreen() {
  const [pace, setPace] = useState("5:30");
  const [sound, setSound] = useState("metronome");
  const [strideLength, setStrideLength] = useState("");
  const [height, setHeight] = useState("165");
  const [halfStep, setHalfStep] = useState(false);

  const estimateStrideLength = (heightCm: number) => {
    const strideFactor = 0.9;
    return Math.round(heightCm * strideFactor);
  };

  useEffect(() => {
    const h = parseFloat(height);
    if (!isNaN(h)) {
      const estimate = estimateStrideLength(h);
      setStrideLength(String(estimate));
    }
  }, [height]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Running Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>1km Pace</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={pace}
            onValueChange={(itemValue) => setPace(itemValue)}
            style={styles.picker}
          >
            {paceOptions.map((option) => (
              <Picker.Item
                label={`${option} / km`}
                value={option}
                key={option}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Sound</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={sound}
            onValueChange={(itemValue) => setSound(itemValue)}
            style={styles.picker}
          >
            {sounds.map((s) => (
              <Picker.Item label={s} value={s} key={s} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Estimated Stride Length (cm)</Text>
        <TextInput
          value={strideLength}
          onChangeText={setStrideLength}
          keyboardType="numeric"
          style={[styles.input, { backgroundColor: "#eee" }]}
        />

        <Text style={styles.label}>Step Mode</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={halfStep ? "half" : "full"}
            onValueChange={(value) => setHalfStep(value === "half")}
            style={styles.picker}
          >
            <Picker.Item label="Full Step (Both Feet)" value="full" />
            <Picker.Item label="Half Step (One Foot Only)" value="half" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() =>
          router.push({
            pathname: `/play/${pace.replace(":", "")}`,
            params: {
              sound,
              strideLength,
              halfStep: halfStep ? "true" : "false"
            }
          } as any)
        }
      >
        <Text style={styles.startButtonText}>Start Running</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f9f9f9",
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6
  },
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
    width: "100%"
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: "center"
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  }
});

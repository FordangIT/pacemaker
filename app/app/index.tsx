// app/index.tsx
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

      <View style={styles.block}>
        <Text style={styles.label}>1km/pace</Text>
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
      </View>

      <View style={styles.block}>
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
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Estimated Stride Length (cm)</Text>
        <TextInput
          value={strideLength}
          onChangeText={setStrideLength}
          keyboardType="numeric"
          style={[styles.input, { backgroundColor: "#eee" }]}
        />
      </View>

      <View style={styles.block}>
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

      <Button
        title="Start"
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
    width: 120
  }
});

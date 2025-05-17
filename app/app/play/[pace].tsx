// app/play/index.tsx
import { calculateStepIntervalMs } from "@/utils/calculateInterval";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PlayScreen() {
  const { pace, sound, strideLength, halfStep } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playClick = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };

  const startLoop = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      getSoundFile(sound)
    );
    soundRef.current = newSound;

    const rawInterval = calculateStepIntervalMs(
      `${pace?.slice(0, -2)}:${pace?.slice(-2)}`,
      parseFloat(strideLength as string)
    );

    const intervalMs = halfStep === "true" ? rawInterval * 2 : rawInterval;

    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      playClick();
    }, intervalMs);
  };

  const stopLoop = async () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const getSoundFile = (name: string | string[] | undefined) => {
    if (Array.isArray(name)) name = name[0];
    switch (name) {
      case "beep":
        return require("../../assets/sounds/beep.mp3");
      case "clave":
        return require("../../assets/sounds/clave.mp3");
      case "footstep":
        return require("../../assets/sounds/footstep.mp3");
      case "snare":
        return require("../../assets/sounds/snare.mp3");
      default:
        return require("../../assets/sounds/metronome.mp3");
    }
  };

  useEffect(() => {
    return () => {
      stopLoop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.title}>Current Settings</Text>
        <Text style={styles.label}>
          Pace: {pace?.slice(0, -2)}:{pace?.slice(-2)}
        </Text>
        <Text style={styles.label}>Sound: {sound}</Text>
        <Text style={styles.label}>
          Half Step: {halfStep === "true" ? "Yes" : "No"}
        </Text>
        <Text style={styles.label}>Stride Length: {strideLength} cm</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, isPlaying && styles.disabled]}
          onPress={startLoop}
          disabled={isPlaying}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !isPlaying && styles.disabled]}
          onPress={stopLoop}
          disabled={!isPlaying}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center"
  },
  label: {
    fontSize: 16,
    marginBottom: 6
  },
  buttonGroup: {
    width: "100%",
    maxWidth: 320,
    gap: 12
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center"
  },
  disabled: {
    backgroundColor: "#A5D6A7"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  backButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center"
  },
  backButtonText: {
    color: "#333",
    fontSize: 16
  }
});

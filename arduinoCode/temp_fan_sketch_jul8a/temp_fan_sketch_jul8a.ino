#include <DHT.h>

// ----- DHT11 CONFIG -----
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// ----- RELAY / OUTPUT PINS -----
#define FAN_RELAY 3
#define LIGHT_RELAY 4

// ----- PIR + LIGHT SENSOR CONFIG -----
#define PIR_PIN 5
#define LDR_PIN A0  // Analog pin for light sensor

// ----- THRESHOLDS -----
const float TEMP_ON = 30.0;
const float TEMP_OFF = 28.0;
const float HUMIDITY_ON = 70.0;
const float HUMIDITY_OFF = 65.0;
const int LDR_THRESHOLD = 500;

bool fanState = false;
bool lightState = false;
int lastPirState = LOW;

// ----- SETTINGS -----
bool motionSensorEnabled = true;
bool lightSensorEnabled = true;

void setup() {
  Serial.begin(9600);

  pinMode(FAN_RELAY, OUTPUT);
  pinMode(LIGHT_RELAY, OUTPUT);
  pinMode(PIR_PIN, INPUT);

  digitalWrite(FAN_RELAY, LOW);
  digitalWrite(LIGHT_RELAY, LOW);

  dht.begin();
}

void loop() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (!isnan(temp) && !isnan(humidity)) {
    Serial.print("Temp: "); Serial.print(temp); Serial.print(" °C, ");
    Serial.print("Humidity: "); Serial.println(humidity);

    if (!fanState && (temp >= TEMP_ON || humidity >= HUMIDITY_ON)) {
      digitalWrite(FAN_RELAY, HIGH);
      fanState = true;
      Serial.println("Fan ON");
    } else if (fanState && (temp <= TEMP_OFF && humidity <= HUMIDITY_OFF)) {
      digitalWrite(FAN_RELAY, LOW);
      fanState = false;
      Serial.println("Fan OFF");
    }
  }

  // PIR Motion Logic
  if (motionSensorEnabled) {
    int currentPirState = digitalRead(PIR_PIN);
    if (currentPirState != lastPirState) {
      if (currentPirState == HIGH) {
        digitalWrite(LIGHT_RELAY, HIGH);
        Serial.println("Motion detected! Light ON");
        lightState = true;
      } else {
        digitalWrite(LIGHT_RELAY, LOW);
        Serial.println("No motion. Light OFF");
        lightState = false;
      }
      lastPirState = currentPirState;
    }
  }

  // Light Sensor Logic (only if motion sensor is off)
  if (lightSensorEnabled && !motionSensorEnabled) {
    int ldrValue = analogRead(LDR_PIN);
    Serial.print("LDR value: ");
    Serial.println(ldrValue);

    if (ldrValue < LDR_THRESHOLD) {
      digitalWrite(LIGHT_RELAY, HIGH);
      Serial.println("Low light! Light ON");
    } else {
      digitalWrite(LIGHT_RELAY, LOW);
      Serial.println("Bright enough. Light OFF");
    }
  }

  delay(1000); // 1-second interval
}
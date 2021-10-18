/***************************/
/*  Virtual keyboard and   */
/*  digital triggers for   */
/*  simulated experiments  */
/*                         */
/*  Andreas Gartus (2021)  */
/***************************/

#include <Keyboard.h>´

#define TRIGGER_PIN PC7           // = Arduino pin 13
#define TRIGGER_PORT PORTC
#define TRIGGER_DDR DDRC

#define TRIGGER_TIME1 160000      // Trigger 1 length [us]
#define TRIGGER_TIME2 100000      // Trigger 2 length [us] (must be longer than keypress time!)
#define TRIGGER_TIME2_10 130000   // Every tenth trigger 2 has this length

#define KEY1 'x'                  // Key 1
#define KEY2 'q'                  // Key 2

#define N1 1                      // Number of times to press key 1
#define N2 100000                 // Number of times to press key 2

#define KEYPRESS_TIME 50000       // Time to press key [us] (should be short to avoid repeated keys!)
#define TIME_TOTAL_MIN 1000000    // Keypress every [us]
#define TIME_TOTAL_MAX 1100001    // (between TIME_TOTAL_MIN and TIME_TOTAL_MAX-1)

void setup() {
  // Initialize trigger pin
  TRIGGER_DDR |= (1 << TRIGGER_PIN);        // Set trigger pin as output
  TRIGGER_PORT &= ~(1 << TRIGGER_PIN);      // Set trigger pin low
  // Initialize control over the keyboard
  Keyboard.begin();
}

void loop() {
  int i;
  unsigned long start_time;
  unsigned long current_time;
  unsigned long trigger_time;
  unsigned long time_total;
  // Release all keys and wait 3 seconds
  Keyboard.releaseAll();
  delay(3000);
  // Press KEY1 for N1 times
  for (i=1; i<=N1; i++) {
    // Save start time
    start_time = micros();
    // Set trigger pin high
    TRIGGER_PORT |= (1 << TRIGGER_PIN);
    // Key press
    Keyboard.press(KEY1);
    // Wait until KEYPRESS_TIME
    for (;;) {
      current_time = micros();
      if ((current_time-start_time) > KEYPRESS_TIME) break;
    }
    // Key release
    Keyboard.releaseAll();
    // Wait until TRIGGER_TIME1
    for (;;) {
      current_time = micros();
      if ((current_time-start_time) > TRIGGER_TIME1) break;
    }
    // Set trigger pin low
    TRIGGER_PORT &= ~(1 << TRIGGER_PIN);
    // Wait until TIME_TOTAL
    time_total = random(TIME_TOTAL_MIN,TIME_TOTAL_MAX);
    for (;;) {
      current_time = micros();
      if ((current_time-start_time) > time_total) break;
    }
  }
  // Press KEY2 for N2 times
  for (i=1; i<=N2; i++) {
    // Save start time
    start_time = micros();
    // Set trigger pin high
    TRIGGER_PORT |= (1 << TRIGGER_PIN);
    // Key press
    Keyboard.press(KEY2);
    // Wait until KEYPRESS_TIME
    for (;;) {
      current_time = micros();
      if ((current_time-start_time) > KEYPRESS_TIME) break;
    }
    // Key release
    Keyboard.releaseAll();
    // Wait until TRIGGER_TIME2
    if ((i%10)==0) {  // Every tenth trigger is different
      trigger_time = TRIGGER_TIME2_10;
    } else {
      trigger_time = TRIGGER_TIME2;
    }
    for (;;) {
      current_time = micros();
      if ((current_time-start_time) > trigger_time) break;
    }
    // Set trigger pin low
    TRIGGER_PORT &= ~(1 << TRIGGER_PIN);
    // Wait until TIME_TOTAL
    time_total = random(TIME_TOTAL_MIN,TIME_TOTAL_MAX);
    for (;;) {
      current_time = micros();
      if ((current_time-start_time) > time_total) break;
    }
  }
  // Press KEY1 for N1 times
  for (i=1; i<=N1; i++) {
    // Save start time
    start_time = micros();
    // Set trigger pin high
    TRIGGER_PORT |= (1 << TRIGGER_PIN);
    // Key press
    Keyboard.press(KEY1);
    // Wait until KEYPRESS_TIME
    for (;;) {
      current_time = micros();
      if ((current_time-start_time) > KEYPRESS_TIME) break;
    }
    // Key release
    Keyboard.releaseAll();
    // Wait until TRIGGER_TIME1
    for (;;) {
      current_time = micros();
      if ((current_time-start_time) > TRIGGER_TIME1) break;
    }
    // Set trigger pin low
    TRIGGER_PORT &= ~(1 << TRIGGER_PIN);
    // Wait until TIME_TOTAL
    time_total = random(TIME_TOTAL_MIN,TIME_TOTAL_MAX);
    for (;;) {
      current_time = micros();
      if ((current_time-start_time) > time_total) break;
    }
  }
  // Release all keys and wait 3 seconds
  Keyboard.releaseAll();
  delay(3000);
  // Loop forever
  for (;;) {}
}

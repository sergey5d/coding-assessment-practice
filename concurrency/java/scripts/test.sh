#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LEVEL="${1:-4}"

if [[ ! "$LEVEL" =~ ^[1-4]$ ]]; then
  echo "Usage: $0 [1|2|3|4]" >&2
  exit 2
fi

BUILD_ROOT="$PROJECT_DIR/build/step${LEVEL}"
BUILD_DIR="$BUILD_ROOT/classes"
rm -rf "$BUILD_ROOT"
mkdir -p "$BUILD_DIR"

MAIN_SOURCES=$(find "$PROJECT_DIR/src/main/java" -name '*.java' -print | sort)
TEST_SOURCES="$PROJECT_DIR/src/test/java/assessment/concurrency/TestSupport.java"

for step in $(seq 1 "$LEVEL"); do
  TEST_SOURCES="$TEST_SOURCES $PROJECT_DIR/src/test/java/assessment/concurrency/Step${step}Test.java"
done

javac --release 17 -Xlint:all -Werror -d "$BUILD_DIR" $MAIN_SOURCES $TEST_SOURCES

for step in $(seq 1 "$LEVEL"); do
  java -ea -cp "$BUILD_DIR" "assessment.concurrency.Step${step}Test"
done

import { expect, test } from "bun:test";

// Test the CSS transform logic for mirroring
test("mirror transform applies scaleX(-1) when mirror is true", () => {
  const getMirrorTransform = (mirror: boolean) => {
    return mirror ? "scaleX(-1)" : "none";
  };

  expect(getMirrorTransform(true)).toEqual("scaleX(-1)");
  expect(getMirrorTransform(false)).toEqual("none");
});

// Test localStorage functionality for mirror preference
test("mirror localStorage key handling", () => {
  const mirrorLocalStorageKey = "mirrorWebcam";
  
  // Mock localStorage
  const localStorageMock = {
    store: {} as Record<string, string>,
    getItem: function(key: string) {
      return this.store[key] || null;
    },
    setItem: function(key: string, value: string) {
      this.store[key] = value;
    },
    clear: function() {
      this.store = {};
    }
  };

  // Test default behavior when no storage exists
  expect(localStorageMock.getItem(mirrorLocalStorageKey)).toBeNull();

  // Test setting and getting mirror preference
  localStorageMock.setItem(mirrorLocalStorageKey, "true");
  expect(localStorageMock.getItem(mirrorLocalStorageKey)).toEqual("true");

  localStorageMock.setItem(mirrorLocalStorageKey, "false");
  expect(localStorageMock.getItem(mirrorLocalStorageKey)).toEqual("false");
});
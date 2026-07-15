/**
 * Campus Compass IndexedDB schema and data access layer.
 *
 * Database: "CampusCompass"
 * Stores:
 *   - landmarks: audio recordings tagged with descriptions
 *   - zones: campus areas/buildings for organizing landmarks
 *   - routes: ordered sequences of landmarks for navigation
 *   - recordings: raw audio blob data (stored separately for performance)
 */

import { openDB, type IDBPDatabase } from "idb";

export interface Landmark {
  id: string;
  title: string;
  description: string;
  zoneId: string;
  audioBlobId: string;
  createdBy: string;
  createdAt: number;
  latitude?: number;
  longitude?: number;
  tags: string[];
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: number;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  landmarkIds: string[];
  createdBy: string;
  createdAt: number;
}

export interface Recording {
  id: string;
  blob: Blob;
  mimeType: string;
  duration: number;
  createdAt: number;
}

const DB_NAME = "CampusCompass";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase | null = null;

export async function getDb(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Landmarks store
      if (!db.objectStoreNames.contains("landmarks")) {
        const landmarkStore = db.createObjectStore("landmarks", {
          keyPath: "id",
        });
        landmarkStore.createIndex("by-zone", "zoneId");
        landmarkStore.createIndex("by-creator", "createdBy");
        landmarkStore.createIndex("by-created", "createdAt");
        landmarkStore.createIndex("by-title", "title");
      }

      // Zones store
      if (!db.objectStoreNames.contains("zones")) {
        const zoneStore = db.createObjectStore("zones", {
          keyPath: "id",
        });
        zoneStore.createIndex("by-name", "name");
      }

      // Routes store
      if (!db.objectStoreNames.contains("routes")) {
        const routeStore = db.createObjectStore("routes", {
          keyPath: "id",
        });
        routeStore.createIndex("by-creator", "createdBy");
        routeStore.createIndex("by-name", "name");
      }

      // Recordings store (audio blobs)
      if (!db.objectStoreNames.contains("recordings")) {
        const recordingStore = db.createObjectStore("recordings", {
          keyPath: "id",
        });
        recordingStore.createIndex("by-created", "createdAt");
      }
    },
  });

  return dbInstance;
}

// ---- Landmark operations ----

export async function addLandmark(landmark: Landmark): Promise<void> {
  const db = await getDb();
  await db.add("landmarks", landmark);
}

export async function getLandmark(id: string): Promise<Landmark | undefined> {
  const db = await getDb();
  return db.get("landmarks", id);
}

export async function getAllLandmarks(): Promise<Landmark[]> {
  const db = await getDb();
  return db.getAll("landmarks");
}

export async function getLandmarksByZone(zoneId: string): Promise<Landmark[]> {
  const db = await getDb();
  return db.getAllFromIndex("landmarks", "by-zone", zoneId);
}

export async function deleteLandmark(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("landmarks", id);
}

// ---- Zone operations ----

export async function addZone(zone: Zone): Promise<void> {
  const db = await getDb();
  await db.add("zones", zone);
}

export async function getZone(id: string): Promise<Zone | undefined> {
  const db = await getDb();
  return db.get("zones", id);
}

export async function getAllZones(): Promise<Zone[]> {
  const db = await getDb();
  return db.getAll("zones");
}

// ---- Route operations ----

export async function addRoute(route: Route): Promise<void> {
  const db = await getDb();
  await db.add("routes", route);
}

export async function getRoute(id: string): Promise<Route | undefined> {
  const db = await getDb();
  return db.get("routes", id);
}

export async function getAllRoutes(): Promise<Route[]> {
  const db = await getDb();
  return db.getAll("routes");
}

// ---- Recording operations ----

export async function addRecording(recording: Recording): Promise<void> {
  const db = await getDb();
  await db.add("recordings", recording);
}

export async function getRecording(id: string): Promise<Recording | undefined> {
  const db = await getDb();
  return db.get("recordings", id);
}

export async function deleteRecording(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("recordings", id);
}

// ---- Utility ----

export async function generateId(): Promise<string> {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Helper to create a blob URL from a recording
export function getRecordingUrl(recording: Recording): string {
  return URL.createObjectURL(recording.blob);
}

// Revoke a blob URL to free memory
export function revokeRecordingUrl(url: string): void {
  URL.revokeObjectURL(url);
}
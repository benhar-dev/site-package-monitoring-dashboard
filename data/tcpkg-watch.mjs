import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

const pExecFile = promisify(execFile);

// --- Config (env-overridable) ---
const TPKG_CMD = process.env.TPKG_CMD || "Tcpkg"; // or "TcPkg"
const OUT_DIR = process.env.OUT_DIR || path.resolve("data");
const TZ = process.env.TZ || undefined; // e.g. "Australia/Sydney" if you want to force it
const DATE = () => {
  const d = TZ ? new Date(new Date().toLocaleString("en-US", { timeZone: TZ })) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const DIR_SNAP = path.join(OUT_DIR, "snapshots");
const DIR_CHANGES = path.join(OUT_DIR, "changes");
const ACTIVITY = path.join(OUT_DIR, "activity.json");

// --- IO helpers ---
async function ensureDirs() {
  await fs.mkdir(DIR_SNAP, { recursive: true });
  await fs.mkdir(DIR_CHANGES, { recursive: true });
}

async function readJsonSafe(file, fallback) {
  try {
    const s = await fs.readFile(file, "utf8");
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

async function writeJsonPretty(file, obj) {
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(obj, null, 2) + "\n", { encoding: "utf8" });
  await fs.rename(tmp, file);
}

// --- Tcpkg call ---
async function getTcpkgList() {
  const { stdout } = await pExecFile(TPKG_CMD, ["list", "--as-json"], {
    windowsHide: true,
    timeout: 10 * 60_000,
    maxBuffer: 1000 * 1024 * 1024
  });
  // Tcpkg prints JSON array. Parse defensively.
  let arr;
  try {
    arr = JSON.parse(stdout);
  } catch (e) {
    throw new Error("Tcpkg returned invalid JSON");
  }
  if (!Array.isArray(arr)) throw new Error("Tcpkg JSON was not an array");
  // Normalize records
  return arr
    .filter(x => x && typeof x.Id === "string")
    .map(x => ({
      Id: x.Id,
      Version: String(x.Version ?? ""),
      Source: String(x.Source ?? "")
    }))
    .sort((a, b) => a.Id.localeCompare(b.Id));
}

// --- Diff logic ---
function indexById(list) {
  const m = new Map();
  for (const p of list) m.set(p.Id, p);
  return m;
}

function diffSnapshots(prevList, currList) {
  const prev = indexById(prevList);
  const curr = indexById(currList);

  const added = [];
  const removed = [];
  const updated = [];

  for (const [id, c] of curr.entries()) {
    const p = prev.get(id);
    if (!p) {
      added.push({ Id: id, Version: c.Version, Source: c.Source });
    } else if (p.Version !== c.Version) {
      updated.push({
        Id: id,
        from: p.Version,
        to: c.Version,
        Source: c.Source
      });
    }
  }
  for (const [id, p] of prev.entries()) {
    if (!curr.has(id)) {
      removed.push({ Id: id, Version: p.Version, Source: p.Source });
    }
  }

  return { added, removed, updated };
}

// --- Activity rollup ---
function updateActivity(activity, day, diff, currList) {
  const a = activity ?? { packageStats: {}, totals: { adds: 0, removals: 0, updates: 0 }, lastRunDate: null };
  const touch = (id) => {
    a.packageStats[id] ??= { changeCount: 0, firstSeen: day, lastSeen: day, lastVersion: null };
    a.packageStats[id].lastSeen = day;
  };

  // Current versions for lastVersion update
  const curMap = indexById(currList);
  for (const id of curMap.keys()) {
    touch(id);
    a.packageStats[id].lastVersion = curMap.get(id).Version;
  }

  // Increment counts
  a.totals.adds += diff.added.length;
  a.totals.removals += diff.removed.length;
  a.totals.updates += diff.updated.length;

  for (const x of diff.added) {
    touch(x.Id);
    a.packageStats[x.Id].changeCount += 1;
    a.packageStats[x.Id].lastVersion = x.Version;
  }
  for (const x of diff.removed) {
    // keep lastVersion at what it was, just count
    a.packageStats[x.Id] ??= { changeCount: 0, firstSeen: day, lastSeen: day, lastVersion: x.Version };
    a.packageStats[x.Id].changeCount += 1;
    a.packageStats[x.Id].lastSeen = day;
  }
  for (const x of diff.updated) {
    touch(x.Id);
    a.packageStats[x.Id].changeCount += 1;
    a.packageStats[x.Id].lastVersion = x.to;
  }

  a.lastRunDate = day;
  return a;
}

// --- Find previous snapshot file (latest older date) ---
async function findPrevSnapshot(today) {
  const files = await fs.readdir(DIR_SNAP).catch(() => []);
  const days = files
    .map(f => f.replace(/\.json$/i, ""))
    .filter(s => /^\d{4}-\d{2}-\d{2}$/.test(s) && s < today)
    .sort();
  if (days.length === 0) return null;
  return path.join(DIR_SNAP, `${days.at(-1)}.json`);
}

// --- Main run ---
async function main() {
  await ensureDirs();
  const day = DATE();

  // If today’s snapshot already exists, treat this as idempotent
  const todaySnapFile = path.join(DIR_SNAP, `${day}.json`);
  const todayChangesFile = path.join(DIR_CHANGES, `${day}.json`);

  const currentList = await getTcpkgList();

  // Load prev snapshot (yesterday or latest earlier)
  let prevList = [];
  const prevFile = await findPrevSnapshot(day);
  if (prevFile) prevList = await readJsonSafe(prevFile, []);

  // Compute diff
  const diff = diffSnapshots(prevList, currentList);

  // Write today’s snapshot (always overwrite to keep idempotent)
  await writeJsonPretty(todaySnapFile, currentList);

  // Write today’s changes
  const changesPayload = {
    date: day,
    counts: {
      added: diff.added.length,
      removed: diff.removed.length,
      updated: diff.updated.length
    },
    added: diff.added,
    removed: diff.removed,
    updated: diff.updated
  };
  await writeJsonPretty(todayChangesFile, changesPayload);

  // Update activity rollup
  const activity = await readJsonSafe(ACTIVITY, null);
  const nextActivity = updateActivity(activity, day, diff, currentList);
  await writeJsonPretty(ACTIVITY, nextActivity);

  // Console summary for logs
  console.log(
    `[tcpkg-watch] ${day} added=${diff.added.length} updated=${diff.updated.length} removed=${diff.removed.length}`
  );
}

main().catch(err => {
  console.error("[tcpkg-watch] ERROR:", err.message);
  process.exitCode = 1;
});

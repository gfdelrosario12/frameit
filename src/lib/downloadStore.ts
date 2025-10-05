import { randomBytes } from "crypto";

export type StoredItem = {
  contentType: string;
  data: Buffer;
  filename: string;
  expiresAt: number;
};

const g = globalThis as unknown as {
  __FRAMEIT_DOWNLOAD_STORE__?: Map<string, StoredItem>;
};
if (!g.__FRAMEIT_DOWNLOAD_STORE__) {
  g.__FRAMEIT_DOWNLOAD_STORE__ = new Map<string, StoredItem>();
}

export const store = g.__FRAMEIT_DOWNLOAD_STORE__ as Map<string, StoredItem>;
export const TTL_MS = 10 * 60 * 1000;

export function sweepExpired(): void {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.expiresAt <= now) store.delete(key);
  }
}

export function putItem(
  data: Buffer,
  contentType: string,
  filename: string
): string {
  sweepExpired();
  const token = randomBytes(12).toString("hex");
  store.set(token, {
    contentType,
    data,
    filename,
    expiresAt: Date.now() + TTL_MS,
  });
  return token;
}

export function getItem(token: string): StoredItem | undefined {
  const item = store.get(token);
  if (!item) return undefined;

  if (item.expiresAt <= Date.now()) {
    store.delete(token);
    return undefined;
  }
  return item;
}

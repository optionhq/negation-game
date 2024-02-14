import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Casts {
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  embeds: Generated<Json>;
  fid: Int8;
  hash: Buffer;
  id: Generated<Int8>;
  mentions: Generated<Int8[]>;
  mentions_positions: Generated<number[]>;
  parent_fid: Int8 | null;
  parent_hash: Buffer | null;
  parent_url: string | null;
  root_parent_hash: Buffer | null;
  root_parent_url: string | null;
  text: string;
  timestamp: Timestamp;
  updated_at: Generated<Timestamp>;
}

export interface Fids {
  created_at: Generated<Timestamp>;
  custody_address: Buffer;
  fid: Int8;
  updated_at: Generated<Timestamp>;
}

export interface Fnames {
  created_at: Generated<Timestamp>;
  custody_address: Buffer | null;
  deleted_at: Timestamp | null;
  expires_at: Timestamp | null;
  fid: Int8 | null;
  fname: string;
  updated_at: Generated<Timestamp>;
}

export interface HubSubscriptions {
  host: string;
  last_event_id: Int8 | null;
}

export interface Links {
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  display_timestamp: Timestamp | null;
  fid: Int8 | null;
  hash: Buffer;
  id: Generated<Int8>;
  target_fid: Int8 | null;
  timestamp: Timestamp;
  type: string | null;
  updated_at: Generated<Timestamp>;
}

export interface Messages {
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  fid: Int8;
  hash: Buffer;
  hash_scheme: number;
  id: Generated<Int8>;
  message_type: number;
  pruned_at: Timestamp | null;
  raw: Buffer;
  revoked_at: Timestamp | null;
  signature: Buffer;
  signature_scheme: number;
  signer: Buffer;
  timestamp: Timestamp;
  updated_at: Generated<Timestamp>;
}

export interface ProfileWithAddresses {
  avatar_url: string | null;
  bio: string | null;
  display_name: string | null;
  fid: Int8 | null;
  fname: string | null;
  verified_addresses: Json | null;
}

export interface Reactions {
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  fid: Int8;
  hash: Buffer;
  id: Generated<Int8>;
  reaction_type: number;
  target_fid: Int8 | null;
  target_hash: Buffer | null;
  target_url: string | null;
  timestamp: Timestamp;
  updated_at: Generated<Timestamp>;
}

export interface Signers {
  created_at: Generated<Timestamp>;
  custody_address: Buffer | null;
  deleted_at: Timestamp | null;
  fid: Int8;
  hash: Buffer | null;
  id: Generated<Int8>;
  name: string | null;
  signer: Buffer;
  timestamp: Timestamp;
  updated_at: Generated<Timestamp>;
}

export interface Storage {
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  expiry: Timestamp;
  fid: Int8;
  id: Generated<Int8>;
  timestamp: Timestamp;
  units: Int8;
  updated_at: Generated<Timestamp>;
}

export interface UserData {
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  fid: Int8;
  hash: Buffer;
  id: Generated<Int8>;
  timestamp: Timestamp;
  type: number;
  updated_at: Generated<Timestamp>;
  value: string;
}

export interface Verifications {
  claim: Json;
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  fid: Int8;
  hash: Buffer;
  id: Generated<Int8>;
  timestamp: Timestamp;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  casts: Casts;
  fids: Fids;
  fnames: Fnames;
  hub_subscriptions: HubSubscriptions;
  links: Links;
  messages: Messages;
  profile_with_addresses: ProfileWithAddresses;
  reactions: Reactions;
  signers: Signers;
  storage: Storage;
  user_data: UserData;
  verifications: Verifications;
}

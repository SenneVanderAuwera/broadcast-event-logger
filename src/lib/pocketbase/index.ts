import type { CollectionRecords, CollectionResponses, CreateBase, TypedPocketBase } from "./types";

import { PUBLIC_POCKETBASE_URL } from "$app/env/public";
import PocketBase from "pocketbase";

export const pb: TypedPocketBase = new PocketBase(PUBLIC_POCKETBASE_URL);

export class PocketbaseRecord<T extends keyof CollectionResponses> {
    record;

    constructor(record: CollectionResponses[T]) {
        this.record = $state(record);

        return this;
    }

    static fromObject<T extends keyof CollectionRecords>(record: CreateBase<CollectionRecords[T]>) {
        if (!record) {
            throw new Error("Cannot create PocketbaseRecord from an empty object");
        }

        return new PocketbaseRecord<T>(record as CollectionResponses[T]);
    }
}
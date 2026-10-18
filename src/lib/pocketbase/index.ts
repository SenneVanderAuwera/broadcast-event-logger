import type { CollectionRecords, CollectionResponses, CreateBase, TypedPocketBase } from "./types";

import { PUBLIC_POCKETBASE_URL } from "$app/env/public";
import PocketBase from "pocketbase";
import { untrack } from "svelte";

export const pb: TypedPocketBase = new PocketBase(PUBLIC_POCKETBASE_URL);

export class PocketbaseRecord<T extends keyof CollectionResponses> {
    record;

    constructor(record: CollectionResponses[T]) {
        this.record = $state(record);

        $effect(() => {
            untrack(async () => {
                try {
                    await this.persist();
                } catch (error) {
                    console.error("Failed to persist record:", error);
                }
            })
        })

        return this;
    }

    static fromObject<T extends keyof CollectionRecords>(record: CreateBase<CollectionRecords[T]>) {
        if (!record) {
            throw new Error("Cannot create PocketbaseRecord from an empty object");
        }

        return new PocketbaseRecord<T>(record as CollectionResponses[T]);
    }

    async persist() {
        if (!this.record) {
            throw new Error("Cannot persist an empty record");
        }

        if (!this.record.created) {
            return pb.collection(this.record.collectionName).create(this.record);
        }

        return pb.collection(this.record.collectionName).update(this.record.id, this.record);
    }
}
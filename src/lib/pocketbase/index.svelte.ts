import type { CollectionResponses, Create, TypedPocketBase } from "./types";

import { PUBLIC_POCKETBASE_URL } from "$app/env/public";
import PocketBase from "pocketbase";

export const pb: TypedPocketBase = new PocketBase(PUBLIC_POCKETBASE_URL);

export class PocketbaseRecord<T extends keyof CollectionResponses> {
    record;

    constructor(record: Create<T>) {
        this.record = $state(record as unknown as CollectionResponses[T]);

        return this;
    }
}
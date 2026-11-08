function nameToHex(color: string): string {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return "";
    ctx.fillStyle = color;
    return ctx.fillStyle;
}

export function parseColor(color: string): string | undefined {
    if (!color) return undefined;
    const hex = nameToHex(color);

    const tailwindString = hex ? `bg-[${hex}]` : "";

    return tailwindString || undefined;
}
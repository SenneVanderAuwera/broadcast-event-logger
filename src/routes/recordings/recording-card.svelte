<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import Archive from "@lucide/svelte/icons/archive";
	import gsap from "gsap";

	let { active = false } = $props();
	let card: HTMLDivElement;

	$effect(() => {
		if (active) {
			gsap.set(card, { backgroundColor: "#ffffff", border: "1px solid red", color: "red" });
			gsap.to(card, { backgroundColor: "red", color: "white", yoyo: true, repeat: -1, duration: 1, ease: "power1.inOut" });
		}
	});
</script>

<div class="flex items-center gap-2">
	<a class="flex-1" href="##">
		<div class="flex justify-between items-center p-4 rounded-md text-white shadow-lg" bind:this={card}>
			<span>File name</span>
			<span>00:00:00 UTC</span>
		</div>
	</a>
	<Button variant="destructive" size="icon"><Archive /></Button>
</div>

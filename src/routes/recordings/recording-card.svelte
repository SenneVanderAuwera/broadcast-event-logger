<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import Archive from "@lucide/svelte/icons/archive";
	import gsap from "gsap";

	let { active = false } = $props();
	let card: HTMLDivElement;

	$effect(() => {
		const tl = gsap.timeline();

		if (active) {
			tl.to(card, { backgroundColor: "#ffffff", border: "1px solid red", color: "red" });
			tl.to(card, { backgroundColor: "red", color: "white", yoyo: true, repeat: -1, duration: 1, ease: "power1.inOut" });
		} else {
			tl.set(card, { color: "black", border: "1px solid #e6e6e6", backgroundColor: "white" });
		}

		return () => {
			gsap.killTweensOf(card);
		};
	});
</script>

<div class="flex items-center gap-2 group relative ms-12">
	<div class="flex-1">
		<a href="##">
			<div class="flex justify-between items-center p-4 rounded-md shadow-lg" bind:this={card}>
				<span>Recording name</span>
				<span>File name</span>
				<span>00:00:00 UTC</span>
			</div>
		</a>
	</div>

	<div class="min-w-12">
		<div class="hidden group-hover:block">
			<Button variant="destructive" size="icon" class="hover:cursor-pointer"><Archive /></Button>
		</div>
	</div>
</div>

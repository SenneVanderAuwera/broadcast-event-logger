<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import Archive from "@lucide/svelte/icons/archive";
</script>

<a href="##">
	<Card.Root class="relative">
		<Card.Header class="text-center">
			<Card.Title>File name - 15:00:00 UTC</Card.Title>
		</Card.Header>
		<Button href="#" class="absolute -right-10 top-1/2 -translate-y-1/2" size="icon" variant="destructive"><Archive /></Button>
	</Card.Root>
</a>

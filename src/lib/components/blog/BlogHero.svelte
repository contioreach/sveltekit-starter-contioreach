<script>
  import Aurora from "./Aurora.svelte";
  import Eyebrow from "./Eyebrow.svelte";

  let {
    eyebrow = "The ContioReach blog",
    paragraph = "",
    stat = null,
    heading,
  } = $props();
</script>

<section class="relative overflow-hidden border-b border-white/10">
  <Aurora />
  <div class="relative mx-auto max-w-4xl px-6 pt-20 pb-14 text-center sm:pt-28 sm:pb-20">
    <Eyebrow>{eyebrow}</Eyebrow>

    <h1 class="mt-6 text-4xl leading-[1.05] font-semibold text-balance text-white sm:text-6xl">
      {@render heading()}
    </h1>

    {#if paragraph}
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-zinc-400">
        {paragraph}
      </p>
    {/if}

    {#if stat}
      <p class="mt-6 text-sm text-zinc-500">{stat}</p>
    {/if}
  </div>
</section>

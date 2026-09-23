<script>
  import { initials } from "$lib/format.js";
  let { author = null } = $props();
</script>

{#if author}
  <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
    <p class="mb-4 text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
      Written by
    </p>
    <div class="flex items-start gap-3.5">
      {#if author.image}
        <img
          src={author.image}
          alt={author.name || ""}
          width="48"
          height="48"
          loading="lazy"
          decoding="async"
          class="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/15"
        />
      {:else}
        <span
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 font-semibold text-zinc-200"
        >
          {initials(author.name)}
        </span>
      {/if}
      <div class="min-w-0">
        <p class="font-semibold text-white">{author.name}</p>
        {#if author.bio}
          <p class="mt-1.5 text-sm leading-relaxed text-zinc-400">{author.bio}</p>
        {/if}
        {#if author.twitter || author.website}
          <div class="mt-3 flex gap-4 text-xs font-medium">
            {#if author.twitter}
              <a
                href={author.twitter}
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="text-zinc-300 underline-offset-4 hover:underline"
              >
                Twitter
              </a>
            {/if}
            {#if author.website}
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="text-zinc-300 underline-offset-4 hover:underline"
              >
                Website
              </a>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

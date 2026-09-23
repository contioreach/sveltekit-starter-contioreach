<!-- The shared backdrop for every blog surface: a near-black ground with two
     soft colour blooms and a faint grid. Purely decorative, so it is hidden
     from assistive tech and never intercepts pointer events. -->
<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
  <div class="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/20 blur-[120px]"></div>
  <div class="absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[120px]"></div>
  <div class="aurora-grid absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(70%_50%_at_50%_0%,#000,transparent)]"></div>
</div>

<style>
  .aurora-grid {
    background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.14) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 1px, transparent 1px);
    background-size: 64px 64px;
  }
</style>

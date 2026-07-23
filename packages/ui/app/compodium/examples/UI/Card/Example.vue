<template>
  <div class="flex flex-col gap-4">
    <UICard
      intent="neutral"
      trailing-icon="tabler:sparkles"
      subtitle="vol. 01 / phase 1"
      title="Card Title"
      description="Card Description"
      tag="on track"
    >
      <template #header>
        <h2>Card Header</h2>
      </template>

      <p>Card Body</p>
    </UICard>

    <UICard
      intent="neutral"
      leading-icon="tabler:sparkles"
      subtitle="vol. 01 / phase 1"
      title="Card Title"
      description="Card Description"
      tag="on track"
      size="lg"
      variant="subtle"
    >
      <template #header>
        <h2>Card Header</h2>
      </template>

      <p>Card Body</p>
    </UICard>

    <UICard intent="neutral" variant="strong">
      <template #header>
        <h2>Card Header</h2>
      </template>

      <p>Card Body</p>

      <!-- <template #footer>
        <p>Card Footer</p>
      </template> -->
    </UICard>
  </div>
</template>

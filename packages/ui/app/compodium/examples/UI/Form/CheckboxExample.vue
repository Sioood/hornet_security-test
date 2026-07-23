<template>
  <div class="flex flex-col gap-8 p-4">
    <section class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">States</h3>
      <div class="flex flex-wrap gap-6">
        <UIFormCheckbox label="Default" helper-text="With helper text" />
        <UIFormCheckbox label="Required" required />
        <UIFormCheckbox label="Disabled" disabled :model-value="true" />
        <UIFormCheckbox label="Invalid" invalid error="This field is required" />
        <UIFormCheckbox label="Indeterminate" model-value="indeterminate" />
      </div>
    </section>
  </div>
</template>

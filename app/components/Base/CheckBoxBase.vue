<script setup>

const { checked, backgroundChecked } = defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  backgroundChecked: {
    type: Object,
    default: ['#FFB800', '#FF8A00']
  }
})

const emit = defineEmits(['onClickCheckbox'])

const handleClickIcon = () => {
  emit('onClickCheckbox')
}

</script>

<template>
  <div class="flex items-center">
    <div 
      class="w-4 h-4 flex-none cursor-pointer"
      @click="handleClickIcon"
    >
      <CheckboxCheckedIcon v-if="checked" :background-primary="backgroundChecked" />
      <CheckboxUnCheckedIcon v-else />
    </div>
    <slot />
  </div>
</template>

<style>

</style>
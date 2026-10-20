<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger-600">*</span>
    </label>
    
    <div class="relative">
      <div v-if="prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-500">{{ prefix }}</span>
      </div>
      
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="[
          'input',
          { 'pl-7': prefix },
          { 'pr-10': suffix || $slots.suffix },
          { 'input-error': error }
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="suffix || $slots.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span v-if="suffix" class="text-gray-500">{{ suffix }}</span>
        <slot name="suffix"></slot>
      </div>
      
      <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <Spinner size="sm" />
      </div>
    </div>
    
    <p v-if="helpText" class="text-sm text-gray-500 mt-1">{{ helpText }}</p>
    <p v-if="error" class="form-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Spinner from './Spinner.vue'

const props = defineProps({
  modelValue: [String, Number],
  id: String,
  type: {
    type: String,
    default: 'text'
  },
  label: String,
  placeholder: String,
  error: String,
  helpText: String,
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  loading: Boolean,
  prefix: String,
  suffix: String
})

const emit = defineEmits([
  'update:modelValue',
  'input',
  'blur',
  'focus'
])

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('input', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>
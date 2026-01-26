<script setup>
const { min, max, step, minValue, maxValue } = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  minValue: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    default: 100,
  },
});

const emit = defineEmits(["changeMinValue", "changeMaxValue"]);

const calcLeftPosition = (value) => (100 / (max - min)) * (value - min);

const sliderStyle = ref({
  leftThumbMin: calcLeftPosition(minValue) + "%",
  leftThumbMax: calcLeftPosition(maxValue) + "%",
  leftLine: calcLeftPosition(minValue) + "%",
  rightLine: 100 - calcLeftPosition(maxValue) + "%",
});

const sliderMinValue = ref(minValue);
const sliderMaxValue = ref(maxValue);

const inputMinValue = (event) => {
  const newValue = parseInt(event.target.value);
  if (newValue > sliderMaxValue.value) return;
  sliderMinValue.value = newValue;
  sliderStyle.value.leftThumbMin = calcLeftPosition(newValue) + "%";
  sliderStyle.value.leftLine = calcLeftPosition(newValue) + "%";
  sliderStyle.value.rightLine =
    100 - calcLeftPosition(sliderMaxValue.value) + "%";
  emit("changeMinValue", sliderMinValue.value);
};

const inputMaxValue = (event) => {
  const newValue = parseInt(event.target.value);
  if (newValue < sliderMinValue.value) return;
  sliderMaxValue.value = newValue;
  sliderStyle.value.leftThumbMax = calcLeftPosition(newValue) + "%";
  sliderStyle.value.leftLine = calcLeftPosition(sliderMinValue.value) + "%";
  sliderStyle.value.rightLine = 100 - calcLeftPosition(newValue) + "%";
  emit("changeMaxValue", sliderMaxValue.value);
};
</script>

<template>
  <div>
    <div class="flex justify-between my-5">
      <span class="bg-gray-300 text-sm py-1 px-3 rounded-full">{{
        formatNumberToVnd(sliderMinValue)
      }}</span>
      <span class="bg-gray-300 text-sm py-1 px-3 rounded-full">{{
        formatNumberToVnd(sliderMaxValue)
      }}</span>
    </div>
    <div class="relative h-2">
      <div class="absolute top-0 left-1 right-1 h-2 bg-gray-400 rounded-full">
        <div
          class="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
          :style="{ left: sliderStyle.leftLine, right: sliderStyle.rightLine }"
        ></div>
      </div>
      <span
        class="absolute top-[-7px] bg-white rounded-full shadow-md"
        :style="{ left: sliderStyle.leftThumbMin }"
      ></span>
      <span
        class="absolute top-[-7px] bg-white rounded-full shadow-md"
        :style="{ left: sliderStyle.leftThumbMax }"
      ></span>
      <input
        v-model="sliderMinValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="absolute top-0 left-0 w-full h-3 opacity-0"
        @input="inputMinValue"
      />
      <input
        v-model="sliderMaxValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="absolute top-0 left-0 w-full h-3 opacity-0"
        @input="inputMaxValue"
      />
    </div>
  </div>
</template>

<style scoped>
input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>

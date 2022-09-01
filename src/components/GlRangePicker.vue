<template>
  <div class="date-picker">
    <div style="position: relative">
      <input
        :class="['gl-input__input', { dark: dark }]"
        readonly
        style="width: 100%; position: relative"
        type="text"
        :value="dateRange"
        @click="toggleCalendar"
      >
      <div
        class="gl-search-box__calendar-button"
        @click="toggleCalendar"
      >
        <gl-icon
          :height="24"
          light
          name="calendar"
          :width="24"
        />
      </div>
    </div>
    <span @click="showDateTimePicker = true" />
    <transition name="slide">
      <div
        v-if="showDateTimePicker"
        v-on-clickaway="closeDateTimePicker"
        :class="[
          'picker-wrapper',
          {
            center: center,
            'up-slide': !center,
          },
        ]"
      >
        <div class="calendar-wrapper">
          <label class="gl-label mb-1">Start date</label>
          <VueCtkDateTimePicker
            v-model="startTime"
            color="#5a78ea"
            format="YYYY-MM-DD HH:mm"
            inline
            locale="en"
            :max-date="maxDate"
            :min-date="minDate"
            no-button-now
          />
        </div>
        <div class="calendar-wrapper">
          <label class="gl-label mb-1">End date</label>
          <VueCtkDateTimePicker
            v-model="endTime"
            color="#5a78ea"
            format="YYYY-MM-DD HH:mm"
            inline
            locale="en"
            :max-date="maxDate"
            :min-date="minDate"
            no-button-now
          />
        </div>
        <div class="action-container">
          <button
            class="gl-button outlined cancel"
            @click="closeDateTimePicker"
          >
            Cancel
          </button>
          <button
            class="gl-button"
            @click="filterGraphByTimestamp"
          >
            Apply
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway"
import moment from "moment"
import GlIcon from '@/components/gl-icon'

export default {
  components: {
    GlIcon,
  },
  mixins: [clickaway],
  props: {
    dark: { type: Boolean, default: false },
    center: { type: Boolean, default: false },
  },
  data() {
    return {
      startTime: moment().format('YYYY-MM-DD HH:mm'),
      endTime: moment().format('YYYY-MM-DD HH:mm'),
      dateRange: '',
      maxDate: moment().format('YYYY-MM-DD HH:mm'),
      minDate: moment("2009-01-01 00:00", "YYYY-MM-DD HH:mm"),
      showDateTimePicker: false,
    }
  },
  methods: {
    closeDateTimePicker() {
      this.showDateTimePicker = !this.showDateTimePicker
      this.$emit('toggle-calendar')
    },
    toggleCalendar() {
      this.showDateTimePicker = !this.showDateTimePicker
      this.$emit('toggle-calendar')
    },
    filterGraphByTimestamp() {
      this.dateRange = `${this.startTime} - ${this.endTime}`
      this.$emit("set-date-filter", this.toSeconds(this.startTime), this.toSeconds(this.endTime))
      this.$emit('toggle-calendar')
      this.showDateTimePicker = false
    },
    toSeconds(date, formatDate = 'YYYY-MM-DD HH:mm') {
      return moment(date, formatDate).unix()
    },
    clearDate() {
      this.dateRange = ''
    },
  },
}
</script>

<style scoped>
.calendar-wrapper {
  width: 430px;
  align-items: flex-end;
}
.input-wrapper {
  position: relative;
}
.gl-label {
  display: inline-block;
}
.picker-wrapper {
  position: fixed;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 900px;
  padding: 10px;
  box-shadow: 0 -5px 8px 0 rgba(204, 212, 242, 0.62);
  background-color: var(--white);
  border-radius: 3px;
  z-index: 5;
}
.gl-button {
  margin-top: 10px;
  margin-left: 0;
  width: 100px;
}
.cancel {
  /* position: absolute; */
  margin-right: 20px;
}
.action-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.calendar-button {
  position: absolute;
  right: 0;
  top: -6px;
  border-radius: 0 3px 3px 0;
  height: 30px;
  width: 30px;
  background: var(--soft-blue);
  cursor: pointer;
}
.center {
  top: -175px;
  left: -215px;
}
.up-slide {
  top: 15px;
  right: 10px;
}
.date-picker {
  width: 100%;
}
</style>
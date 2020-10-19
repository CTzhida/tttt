import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('date', (val, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(val).format(format)
})


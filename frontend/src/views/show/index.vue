<template>
  <div class="app-container">
    <el-carousel :interval="5000"
                 :height="height"
                 arrow="always">
      <el-carousel-item v-for="item in fileList"
                        :key="item.url">
        <img :src="item.url"
             class="img_show">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { getSchedule } from '@/api/table'
// import PrayTimes from 'prayer-times'

export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      height: '0px',
      form: {
        tz: 0,
        lang: '',
        lat: '',
        lon: '',
        image: '',
        cm: '',
        athan: '',
        jamaah: '',
        imask_delta: '',
        fajr_delta: '',
        sunrise_delta: '',
        dhuhr_delta: '',
        athan_delta: '',
        jamaah_delta: '',
        asr_delta: '',
        maghrib_delta: '',
        isha_delta: '',
        imask_fixed: '',
        fajr_fixed: '',
        sunrise_fixed: '',
        dhuhr_fixed: '',
        athan_fixed: '',
        jamaah_fixed: '',
        asr_fixed: '',
        maghrib_fixed: '',
        isha_fixed: ''
      }
    }
  },
  mounted: function() {
    this.height = Math.ceil((window.innerHeight * 4) / 5) + 'px'
    console.log(this.$route.params.pk)
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      getSchedule(this.$route.params.pk).then(response => {
        console.log(response)
        this.form.tz = response.data.tz
        this.form.lang = response.data.lang
        this.form.lat = response.data.lat
        this.form.lon = response.data.lon
        this.form.image = response.data.image
        this.form.cm = response.data.cm
        this.form.athan = response.data.athan
        this.form.jamaah = response.data.jamaah
        this.form.imask_delta = response.data.imask_delta
        this.form.fajr_delta = response.data.fajr_delta
        this.form.sunrise_delta = response.data.sunrise_delta
        this.form.dhuhr_delta = response.data.dhuhr_delta
        this.form.asr_delta = response.data.asr_delta
        this.form.maghrib_delta = response.data.maghrib_delta
        this.form.isha_delta = response.data.isha_delta
        this.form.imask_fixed = response.data.imask_fixed
        this.form.fajr_fixed = response.data.fajr_fixed
        this.form.sunrise_fixed = response.data.sunrise_fixed
        this.form.dhuhr_fixed = response.data.dhuhr_fixed
        this.form.asr_fixed = response.data.asr_fixed
        this.form.maghrib_fixed = response.data.maghrib_fixed
        this.form.isha_fixed = response.data.isha_fixed
        if (response.data.image) {
          response.data.image.forEach(element => {
            this.fileList.push({ url: process.env.CDN_URL + element })
          })
        }
      })
      this.loading = false
    }
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

img.img_show {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

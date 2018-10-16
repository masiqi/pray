<template>
  <div class="app-container">
    <el-form ref="form"
             :model="form"
             label-width="120px">
      <el-form-item label="Timezone">
        <el-input v-model="form.tz" />
      </el-form-item>
      <el-form-item label="Language">
        <el-select v-model="form.lang"
                   placeholder="please select your language">
          <el-option label="English"
                     value="EN" />
          <el-option label="Chinese"
                     value="HANS" />
          <el-option label="Arabic"
                     value="AR" />
        </el-select>
      </el-form-item>
      <el-form-item label="Method">
        <el-select v-model="form.cm"
                   :default-first-option="true"
                   placeholder="please select your calculate method">
          <el-option label="MWL"
                     value="MWL" />
          <el-option label="ISNA"
                     value="ISNA" />
          <el-option label="Egypt"
                     value="Egypt" />
          <el-option label="Makkah"
                     value="Makkah" />
          <el-option label="Karachi"
                     value="Karachi" />
          <el-option label="Tehran"
                     value="Tehran" />
          <el-option label="Jafari"
                     value="Jafari" />
        </el-select>
      </el-form-item>
      <el-form-item label="Latitude">
        <el-input v-model="form.lat" />
      </el-form-item>
      <el-form-item label="Longitude">
        <el-input v-model="form.lon" />
      </el-form-item>
      <el-form-item label="Background">

        <el-upload :on-change="handleChange"
                   :file-list="fileList"
                   :auto-upload="false"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :before-remove="beforeRemove"
                   list-type="picture-card"
                   class="upload-demo"
                   accept="image/jpeg,image/png"
                   action="">
          <i class="el-icon-plus" />
          <div slot="tip"
               class="el-upload__tip">jpeg/png only, max size 500kb</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl"
               width="100%"
               alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="imask">
        <el-input v-model="imask"
                  :disabled="true" />
      </el-form-item>
      <el-form-item label="imask delta">
        <el-input v-model="form.imask_delta" />
      </el-form-item>
      <el-form-item label="imask fixed">
        <el-input v-model="form.imask_fixed" />
      </el-form-item>
      <el-form-item label="fajr">
        <el-input v-model="fajr"
                  :disabled="true" />
      </el-form-item>
      <el-form-item label="fajr delta">
        <el-input v-model="form.fajr_delta" />
      </el-form-item>
      <el-form-item label="fajr fixed">
        <el-input v-model="form.fajr_fixed" />
      </el-form-item>
      <el-form-item label="sunrise">
        <el-input v-model="sunrise"
                  :disabled="true" />
      </el-form-item>
      <el-form-item label="sunrise delta">
        <el-input v-model="form.sunrise_delta" />
      </el-form-item>
      <el-form-item label="sunrise fixed">
        <el-input v-model="form.sunrise_fixed" />
      </el-form-item>
      <el-form-item label="dhuhr">
        <el-input v-model="dhuhr"
                  :disabled="true" />
      </el-form-item>
      <el-form-item label="dhuhr delta">
        <el-input v-model="form.dhuhr_delta" />
      </el-form-item>
      <el-form-item label="dhuhr fixed">
        <el-input v-model="form.dhuhr_fixed" />
      </el-form-item>
      <el-form-item label="athan">
        <el-input v-model="form.athan" />
      </el-form-item>
      <el-form-item label="jamaah">
        <el-input v-model="form.jamaah" />
      </el-form-item>
      <el-form-item label="asr">
        <el-input v-model="asr"
                  :disabled="true" />
      </el-form-item>
      <el-form-item label="asr delta">
        <el-input v-model="form.asr_delta" />
      </el-form-item>
      <el-form-item label="asr fixed">
        <el-input v-model="form.asr_fixed" />
      </el-form-item>
      <el-form-item label="maghrib">
        <el-input v-model="maghrib"
                  :disabled="true" />
      </el-form-item>
      <el-form-item label="maghrib delta">
        <el-input v-model="form.maghrib_delta" />
      </el-form-item>
      <el-form-item label="maghrib fixed">
        <el-input v-model="form.maghrib_fixed" />
      </el-form-item>
      <el-form-item label="isha">
        <el-input v-model="isha"
                  :disabled="true" />
      </el-form-item>
      <el-form-item label="isha delta">
        <el-input v-model="form.isha_delta" />
      </el-form-item>
      <el-form-item label="isha fixed">
        <el-input v-model="form.isha_fixed" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createSchedule } from '@/api/table'
import PrayTimes from 'prayer-times'

export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      images: [],
      form: {
        tz: 0 - new Date().getTimezoneOffset() / 60,
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
        asr_delta: '',
        maghrib_delta: '',
        isha_delta: '',
        imask_fixed: '',
        fajr_fixed: '',
        sunrise_fixed: '',
        dhuhr_fixed: '',
        asr_fixed: '',
        maghrib_fixed: '',
        isha_fixed: ''
      }
    }
  },
  computed: {
    imask: function() {
      if (this.form.lat !== '' && this.form.lon !== '') {
        const pt = new PrayTimes()
        if (this.form.cm !== '') {
          pt.setMethod(this.form.cm)
        }
        var time = pt.getTimes(new Date(), [this.form.lat, this.form.lon], this.form.tz)
        return time.imsak
      }
    },
    fajr: function() {
      if (this.form.lat !== '' && this.form.lon !== '') {
        const pt = new PrayTimes()
        if (this.form.cm !== '') {
          pt.setMethod(this.form.cm)
        }
        var time = pt.getTimes(new Date(), [this.form.lat, this.form.lon], this.form.tz)
        return time.fajr
      }
    },
    sunrise: function() {
      if (this.form.lat !== '' && this.form.lon !== '') {
        const pt = new PrayTimes()
        if (this.form.cm !== '') {
          pt.setMethod(this.form.cm)
        }
        var time = pt.getTimes(new Date(), [this.form.lat, this.form.lon], this.form.tz)
        return time.sunrise
      }
    },
    dhuhr: function() {
      if (this.form.lat !== '' && this.form.lon !== '') {
        const pt = new PrayTimes()
        if (this.form.cm !== '') {
          pt.setMethod(this.form.cm)
        }
        var time = pt.getTimes(new Date(), [this.form.lat, this.form.lon], this.form.tz)
        return time.dhuhr
      }
    },
    asr: function() {
      if (this.form.lat !== '' && this.form.lon !== '') {
        const pt = new PrayTimes()
        if (this.form.cm !== '') {
          pt.setMethod(this.form.cm)
        }
        var time = pt.getTimes(new Date(), [this.form.lat, this.form.lon], this.form.tz)
        return time.asr
      }
    },
    maghrib: function() {
      if (this.form.lat !== '' && this.form.lon !== '') {
        const pt = new PrayTimes()
        if (this.form.cm !== '') {
          pt.setMethod(this.form.cm)
        }
        var time = pt.getTimes(new Date(), [this.form.lat, this.form.lon], this.form.tz)
        return time.maghrib
      }
    },
    isha: function() {
      if (this.form.lat !== '' && this.form.lon !== '') {
        const pt = new PrayTimes()
        if (this.form.cm !== '') {
          pt.setMethod(this.form.cm)
        }
        var time = pt.getTimes(new Date(), [this.form.lat, this.form.lon], this.form.tz)
        return time.isha
      }
    }
  },
  mounted: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.position = position.coords
        this.form.lat = this.position.latitude
        this.form.lon = this.position.longitude
      })
    }
  },
  methods: {
    async onSubmit() {
      const files = this.fileList
      const uploadList = []
      console.log(files)

      const readFileAsync = file =>
        new Promise(resolve => {
          const reader = new FileReader()
          reader.onload = evt => resolve(evt.target.result.split(',')[1])
          reader.readAsDataURL(file.raw)
        })

      for (let i = 0; i < files.length; i++) {
        uploadList.push(await readFileAsync(files[i]))
      }

      console.log(uploadList)
      this.$refs.form.validate(valid => {
        if (valid) {
          createSchedule({ cm: this.form.cm, tz: this.form.tz, lon: this.form.lon, lat: this.form.lat, lang: this.form.lang, image: uploadList, athan: this.form.athan, jamaah: this.form.jamaah, imask_delta: this.form.imask_delta, fajr_delta: this.form.fajr_delta, sunrise_delta: this.form.sunrise_delta, dhuhr_delta: this.form.dhuhr_delta, asr_delta: this.form.asr_delta, maghrib_delta: this.form.maghrib_delta, isha_delta: this.form.isha_delta, imask_fixed: this.form.imask_fixed, fajr_fixed: this.form.fajr_fixed, sunrise_fixed: this.form.sunrise_fixed, dhuhr_fixed: this.form.dhuhr_fixed, asr_fixed: this.form.asr_fixed, maghrib_fixed: this.form.maghrib_fixed, isha_fixed: this.form.isha_fixed }).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    handleChange(file, fileList) {
      var This = this
      This.fileList = fileList
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function(e) {
        This.form.image = this.result.split(',')[1]
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>


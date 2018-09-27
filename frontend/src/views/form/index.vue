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
                   :multiple="false"
                   :auto-upload="false"
                   class="upload-demo"
                   accept="image/jpeg,image/png"
                   action="">
          <el-button size="small"
                     type="primary">upload</el-button>
          <div slot="tip"
               class="el-upload__tip">jpeg/png only, max size 500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities"
                       name="type" />
          <el-checkbox label="Promotion activities"
                       name="type" />
          <el-checkbox label="Offline activities"
                       name="type" />
          <el-checkbox label="Simple brand exposure"
                       name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input v-model="form.desc"
                  type="textarea" />
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
export default {
  data() {
    return {
      fileList: [],
      form: {
        tz: 0 - new Date().getTimezoneOffset() / 60,
        lang: '',
        lat: '',
        lon: '',
        image: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
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
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          createSchedule({ tz: this.form.tz, lon: this.form.lon, lat: this.form.lat, lang: this.form.lang, image: this.form.image }).then(() => {})
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
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function(e) {
        this.result // 这个就是base64编码了
        This.form.image = this.result.split(',')[1]
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>


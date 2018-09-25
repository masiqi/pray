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
      <el-form-item label="Latitude">
        <el-input v-model="form.lat" />
      </el-form-item>
      <el-form-item label="Longitude">
        <el-input v-model="form.lon" />
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
export default {
  data() {
    return {
      form: {
        tz: 0 - new Date().getTimezoneOffset() / 60,
        lang: '',
        lat: '',
        lon: '',
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
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>


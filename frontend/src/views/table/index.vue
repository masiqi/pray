<template>
  <div class="app-container">
    <el-table v-loading="listLoading"
              :data="list"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row>
      <el-table-column align="center"
                       label="ID"
                       width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="GeoLocation">
        <template slot-scope="scope">
          {{ scope.row.lon }} , {{ scope.row.lat }}
        </template>
      </el-table-column>
      <el-table-column label="Language">
        <template slot-scope="scope">
          {{ scope.row.lang }}
        </template>
      </el-table-column>
      <el-table-column label="Timezone">
        <template slot-scope="scope">
          {{ scope.row.tz }}
        </template>
      </el-table-column>
      <el-table-column label="Method">
        <template slot-scope="scope">
          {{ scope.row.cm }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listSchedule } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listSchedule(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

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
      <el-table-column align="center"
                       label="Action"
                       width="280"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{ name: 'Edit', params: { pk: scope.row.pk.split('schedule-')[1]}}">
            <el-button type="primary"
                       size="mini">edit</el-button>
          </router-link>
          <router-link :to="{ name: 'Show', params: { pk: scope.row.pk.split('schedule-')[1]}}">
            <el-button size="mini"
                       type="info">show</el-button>
          </router-link>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.row,'deleted')">delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listSchedule, deleteSchedule } from '@/api/table'

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
    },
    handleDelete(row) {
      deleteSchedule(row.pk.split('schedule-')[1]).then(res => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    }
  }
}
</script>

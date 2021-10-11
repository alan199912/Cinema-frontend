<template>
  <div class="container">
    <h1 class="text-light mt-3">Schedules</h1>
    <Table
      title="Schedules"
      :section="false"
      :arraySection="schedules"
      @listSchedules="schedules = $event"
    />
  </div>
</template>

<style>
@import "~bootstrap-icons/font/bootstrap-icons.css";
</style>

<script>
import axios from "axios";
import Table from "../../components/Table.vue";

export default {
  name: "Schedules",
  components: { Table },
  data() {
    return {
      schedules: null,
    };
  },
  async mounted() {
    await axios
      .get(
        `http://localhost:8000/api/v1/getScheduleByMoVieId/${this.$route.params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        this.schedules = res.data.schedules;
        this.$store.state.schedules = this.schedules;
        this.$store.dispatch("setScheduleAction");
      })
      .catch((error) => console.log(error));
    console.log(this.$store.state.schedules);
    console.log(this.schedules);
  },
};
</script>

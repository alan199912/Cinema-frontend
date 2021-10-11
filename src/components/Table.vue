<template>
  <div>
    <table class="table caption-top bg-light">
      <caption class="text-light">
        List of
        {{
          title
        }}
        <div class="float-end">
          <button
            type="button"
            class="btn btn-success"
            @click="navitageToAddAction()"
          >
            Add {{ title }}
          </button>
        </div>
      </caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Time</th>
          <th scope="col" colspan="3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in arraySection" :key="item.id">
          <th scope="row">{{ index + 1 }}</th>
          <td v-if="!section">{{ new Date(item.time).toLocaleString() }}</td>
          <td v-if="section">{{ item.name }}</td>
          <td>
            <button
              class="btn btn-primary"
              @click="navitageToUpdateAction(item.id)"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
          </td>
          <td>
            <button class="btn btn-danger" @click="deleteAction(item.id)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
          <td v-if="section">
            <button class="btn btn-info">
              <i
                class="bi bi-calendar-plus"
                @click="navigateToSchedules(item.id)"
              ></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
@import "~bootstrap-icons/font/bootstrap-icons.css";
</style>

<script>
import axios from "axios";

export default {
  name: "Schedules",
  props: ["title", "section", "arraySection"],
  data() {
    return {};
  },
  methods: {
    navitageToAddAction() {
      if (this.section) {
        this.$router.push({ path: "/dashboard/add-movie" });
        return;
      }
      this.$router.push({
        path: `/dashboard/add-schedule/${this.$route.params.id}`,
      });
    },
    navitageToUpdateAction(id) {
      if (this.section) {
        this.$router.push({ path: `/dashboard/update-movie/${id}` });
        return;
      }
      this.$router.push({ path: `/dashboard/update-schedule/${id}` });
    },
    async deleteAction(id) {
      if (this.section) {
        await axios
          .delete(`http://localhost:8000/api/v1/deleteMovie/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
            },
          })
          .then((res) => {
            console.log(res.data.movie);

            if (res.data.status === "success") {
              this.isLoading = false;

              const moviesArr = this.$store.state.movies.filter(
                (movie) => movie.id !== res.data.movie.id
              );
              console.log(moviesArr);
              this.$store.state.movies = [...moviesArr];

              this.$store.dispatch("setMovieAction");
            }
          });
        return;
      }

      await axios
        .delete(`http://localhost:8000/api/v1/deleteSchedule/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
          },
        })
        .then((res) => {
          console.log(res.data.schedule);

          if (res.data.status === "success") {
            this.isLoading = false;

            const SchedulesArr = this.$store.state.schedules.filter(
              (schedule) => schedule.id !== res.data.schedule.id
            );
            console.log(SchedulesArr);
            this.$store.state.schedules = [...SchedulesArr];
            this.$emit("listSchedules", [...SchedulesArr]);

            this.$store.dispatch("setScheduleAction");
            return;
          }
        });
    },
    navigateToSchedules(id) {
      this.$router.push({ path: `/dashboard/schedules/${id}` });
    },
  },
};
</script>

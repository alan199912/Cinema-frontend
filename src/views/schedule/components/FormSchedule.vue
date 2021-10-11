<template>
  <div>
    <Loader v-if="isLoading" />
    <form v-if="!isLoading" class="border bg-light p-3">
      <meta name="csrf-token" content="{{ csrf_token() }}" />
      <div class="mb-3">
        <label for="cinema" class="form-label">Cinema</label>
        <select
          class="rounded-pill form-select"
          name="cinema"
          id="cinema"
          v-model="cinemaIdSelected"
        >
          <option disabled selected :value="null">Select a Cine zone</option>
          <option v-for="cinema in cinemas" :value="cinema.id" :key="cinema.id">
            {{ cinema.name }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label for="date" class="form-label">Date</label>
        <input
          type="datetime-local"
          class="form-control"
          v-model="time"
          id="date"
        />
      </div>
      <div class="d-grid gap-2 col-12 mx-auto">
        <button type="button" class="btn btn-primary" @click="actionSchedule()">
          {{ section ? "Save" : "Update" }}
        </button>
      </div>
    </form>
    <div v-if="isShowError">
      <Error :getError="getErrorMessage" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Loader from "../../../components/Loader.vue";
import Error from "../../../components/Error.vue";

export default {
  name: "FormMovie",
  props: ["section"],
  components: {
    Loader,
    Error,
  },
  data() {
    return {
      time: null,
      cinemaIdSelected: null,
      movieId: null,
      isLoading: false,
      isShowError: false,
      getErrorMessage: null,
    };
  },
  computed: {
    cinemas() {
      return this.$store.state.cinemas;
    },
  },
  methods: {
    async actionSchedule() {
      const body = {
        movie_id: this.movieId
          ? this.movieId
          : parseInt(this.$route.params.movie_id),
        cinema_id: this.cinemaIdSelected,
        time: moment(this.time).format("YYYY-MM-DD HH:mm:ss"),
      };

      console.log({ body, section: this.section });

      if (!this.cinemaIdSelected || !this.time) {
        this.isShowError = true;
        this.getErrorMessage = "Complete all the fields";

        setTimeout(() => {
          this.isShowError = false;
        }, 3000);
        return;
      }

      if (this.section) {
        this.addSchedule(body);
        return;
      }
      this.updateSchedule(body, this.$route.params.id);
    },
    async addSchedule(body) {
      await axios
        .post("http://localhost:8000/api/v1/addSchedule", body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
          },
        })
        .then((res) => {
          console.log(res.data.schedule);
          console.log(this.$store.state.schedules);

          if (res.data.status === "success") {
            this.isLoading = true;

            this.$store.state.schedules = [
              ...this.$store.state.schedules,
              res.data.schedule,
            ];

            this.$store.dispatch("setScheduleAction");

            this.$router.push({
              path: `/dashboard/schedules/${this.$route.params.movie_id}`,
            });
            return;
          } else {
            this.getErrorMessage = res.data.message;
            throw new Error();
          }
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
          this.isShowError = true;

          setTimeout(() => {
            this.isShowError = false;
          }, 3000);
        });
    },
    async updateSchedule(body, id) {
      await axios
        .put(`http://localhost:8000/api/v1/updateSchedule/${id}`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
          },
        })
        .then((res) => {
          console.log(this.$store.state.schedules);
          console.log(res.data.schedule);

          if (res.data.status === "success") {
            this.isLoading = false;

            const schedulesArr = this.$store.state.schedules.map((schedule) => {
              let oldArr = { ...schedule };

              if (oldArr.id === res.data.schedule.id) {
                oldArr = res.data.schedule;
              }

              return oldArr;
            });

            this.$store.state.schedules = [...schedulesArr];

            this.$store.dispatch("setScheduleAction");

            this.$router.push({
              path: `/dashboard/schedules/${this.movieId}`,
            });
            return;
          } else {
            this.getErrorMessage = res.data.message;
            throw new Error();
          }
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
          this.isShowError = true;

          setTimeout(() => {
            this.isShowError = false;
          }, 3000);
        });
    },
  },
  // created() {
  //   const [movie] = this.$store.state.movies.filter(
  //     (movie) => movie.id === parseInt(this.$route.params.movie_id)
  //   );
  //   if (!movie) {
  //     this.$router.push({ path: "/dashboard/movies" });
  //   }
  // },
  async mounted() {
    console.log(this.$store.state.schedules.length);
    if (this.$route.params.id) {
      await axios
        .get(
          `http://localhost:8000/api/v1/getScheduleById/${this.$route.params.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);

          this.cinemaIdSelected = res.data.schedule.cinema_id;
          this.time = res.data.schedule.time;
          this.movieId = res.data.schedule.movie_id;
        });
    }
  },
};
</script>

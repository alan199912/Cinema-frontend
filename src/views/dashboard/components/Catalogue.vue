<template>
  <div class="container mt-5" :class="{ backgroundComplete: cinemaIdSelected }">
    <h4 class="text-light text-start mb-3">Complete your ticket</h4>
    <!-- CINEMA CONTAINER -->
    <div class="border p-3 bg-light">
      <select class="rounded-pill form-select" v-model="cinemaIdSelected">
        <option disabled :value="null">Select a Cine zone</option>
        <option v-for="cinema in cinemas" :value="cinema.id" :key="cinema.id">
          {{ cinema.name }}
        </option>
      </select>
    </div>

    <!-- QUANTITY TICKETS -->
    <div class="mt-5 border p-3 bg-light">
      <div class="row">
        <div class="col-lg-6">
          <select class="rounded-pill form-select" v-model="order.quantity">
            <option disabled selected :value="null">Select the ticket</option>
            <option :value="1" v-if="cinemaIdSelected">One</option>
            <option :value="2" v-if="cinemaIdSelected">Two</option>
            <option :value="3" v-if="cinemaIdSelected">Three</option>
            <option :value="4" v-if="cinemaIdSelected">Four</option>
            <option :value="5" v-if="cinemaIdSelected">Five</option>
          </select>
        </div>
        <div class="col-lg-6 text-lg-end mt-2 mt-lg-0">
          <h3>Total {{ currency }}</h3>
        </div>
      </div>
    </div>

    <!-- MOVIES CONTAINER -->
    <div class="mt-5">
      <div class="row">
        <div class="col-lg-4" v-for="movie in catalogs" :key="movie.id">
          <div class="card mt-3">
            <img
              v-bind:src="movie.image"
              class="card-img-top"
              alt="img"
              style="height: 300px; object-fit: contain"
            />
            <div class="card-body">
              <h5 class="card-title">{{ movie.name }}</h5>
              <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="flush-headingOne">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      Description
                    </button>
                  </h2>
                  <div
                    id="flush-collapseOne"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div class="accordion-body">
                      {{ movie.description }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-3 bg-light">
                <select
                  class="rounded-pill form-select"
                  v-model="order.scheduleId"
                >
                  <option selected disabled :value="null">
                    Select schedule
                  </option>
                  <option
                    v-for="schedule in getSchedule(movie.id)"
                    :value="schedule"
                    :key="schedule.id"
                  >
                    {{ schedule.time }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BUTTON CONTAIER -->
    <div class="d-grid gap-2 col-12 px-auto py-5">
      <button
        class="btn btn-success btn-block"
        :disabled="!isReadyToBuy"
        @click="
          generatePurchaseOrder(
            $store.getters.getLoggedUser.id,
            order.scheduleId.id,
            order.quantity,
            totalPrice
          )
        "
      >
        Buy
      </button>
    </div>
  </div>
</template>

<style>
.backgroundComplete {
  height: 100% !important;
}
.description {
  overflow: hidden;
  white-space: nowrap;
  max-width: 500px;
  text-overflow: ellipsis;
}
</style>

<script>
import axios from "axios";

export default {
  name: "Catalogue",
  data() {
    return {
      movies: [],
      cinemas: [],
      cinemaIdSelected: null,
      order: {
        scheduleId: null,
        quantity: null,
      },
      loader: false,
    };
  },
  methods: {
    getSchedule(movieId) {
      const schedules = this.cinemas.find(
        (cinema) => cinema.id === this.cinemaIdSelected
      ).schedules;

      return schedules.filter((schedule) => schedule.movie_id === movieId);
    },
    async generatePurchaseOrder(user_id, schedule_id, quantity, total) {
      const body = {
        user_id,
        schedule_id,
        quantity,
        total,
      };

      console.log({ body });

      await axios
        .post("http://localhost:8000/api/v1/generatePurchaseOrder", body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
          },
        })
        .then((res) => {
          if (res.data.status === "success") {
            console.log(res.data);
            this.$router.push({ path: "/dashboard/tickets" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    catalogs() {
      if (!this.cinemaIdSelected) return [];

      const cinema = this.cinemas.find(
        (cinema) => cinema.id === this.cinemaIdSelected
      );

      const ids = cinema.schedules.map((schedule) => schedule.movie_id);

      console.log(this.movies.filter((movie) => ids.includes(movie.id)));

      return this.movies.filter((movie) => ids.includes(movie.id));
    },
    totalPrice() {
      if (!this.order.quantity) return 0;

      return (
        this.cinemas.find((cinema) => cinema.id === this.cinemaIdSelected)
          .price * this.order.quantity
      );
    },
    isReadyToBuy() {
      return this.order.scheduleId && this.order.quantity;
    },
    currency() {
      return this.totalPrice.toLocaleString("es-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
  async mounted() {
    await axios
      .get("http://localhost:8000/api/v1/getAllMovies", {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
        },
      })
      .then((res) => {
        console.log(res.data.movie);
        this.movies = res.data.movie;

        this.$store.state.movies = this.movies;
        this.$store.dispatch("setMovieAction");
      })
      .catch((error) => {
        console.log(error);
      });

    await axios
      .get("http://localhost:8000/api/v1/getAllCinemas", {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
        },
      })
      .then((res) => {
        console.log(res.data.cinemas);
        this.cinemas = res.data.cinemas;

        this.$store.state.cinemas = this.cinemas;
        this.$store.dispatch("setCinemaAction");
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

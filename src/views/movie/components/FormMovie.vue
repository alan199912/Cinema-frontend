<template>
  <div>
    <Loader v-if="isLoading" />
    <form v-if="!isLoading" class="border bg-light p-3">
      <meta name="csrf-token" content="{{ csrf_token() }}" />
      <div class="mb-3">
        <label for="image" class="form-label">Image</label>
        <input type="text" class="form-control" v-model="image" id="image" />
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" v-model="name" id="name" />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          class="form-control"
          name="description"
          id="description"
          cols="30"
          rows="15"
          v-model="description"
        ></textarea>
      </div>
      <div class="d-grid gap-2 col-12 mx-auto">
        <button type="button" class="btn btn-primary" @click="actionMovie()">
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
      image: null,
      name: null,
      description: null,
      isLoading: false,
      getErrorMessage: null,
    };
  },
  methods: {
    async actionMovie() {
      const body = {
        image: this.image,
        name: this.name,
        description: this.description,
      };

      console.log({ body, section: this.section });

      if (this.section) {
        this.addMovie(body);
        return;
      }
      this.updateMovie(body, this.$route.params.id);
    },
    async addMovie(body) {
      await axios
        .post("http://localhost:8000/api/v1/addMovie", body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
          },
        })
        .then((res) => {
          console.log(res.data);

          if (res.data.status === "success") {
            this.isLoading = true;

            this.$store.state.movies = [
              ...this.$store.state.movies,
              res.data.movie,
            ];

            this.$store.dispatch("setMovieAction");

            this.$router.push({ path: "/dashboard/movies" });
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
    async updateMovie(body, id) {
      await axios
        .put(`http://localhost:8000/api/v1/updateMovie/${id}`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
          },
        })
        .then((res) => {
          console.log(this.$store.state.movies);
          console.log(res.data.movie);

          if (res.data.status === "success") {
            this.isLoading = false;

            const moviesArr = this.$store.state.movies.map((movie) => {
              let oldArr = { ...movie };

              if (oldArr.id === res.data.movie.id) {
                oldArr = res.data.movie;
              }

              return oldArr;
            });

            this.$store.state.movies = [...moviesArr];

            this.$store.dispatch("setMovieAction");

            this.$router.push({ path: "/dashboard/movies" });
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
  async mounted() {
    if (this.$route.params.id) {
      await axios
        .get(
          `http://localhost:8000/api/v1/getMovieById/${this.$route.params.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);

          this.image = res.data.movie.image;
          this.name = res.data.movie.name;
          this.description = res.data.movie.description;
        });
    }
  },
};
</script>

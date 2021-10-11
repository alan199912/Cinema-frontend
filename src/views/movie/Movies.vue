<template>
  <div class="container">
    <h1 class="text-light mt-3">Movies</h1>
    <Table title="Movies" :section="true" :arraySection="movies" />
  </div>
</template>

<style>
@import "~bootstrap-icons/font/bootstrap-icons.css";
</style>

<script>
import Table from "../../components/Table.vue";

export default {
  name: "Movies",
  components: { Table },
  computed: {
    movies() {
      console.log(this.$store.state.movies);
      return this.$store.state.movies;
    },
  },
};
</script>

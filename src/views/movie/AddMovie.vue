<template>
  <div class="container mt-5">
    <h1 class="text-light">Add a movie</h1>
    <div class="row mt-3">
      <div class="offset-lg-3 col-lg-6">
        <FormMovie :section="true" />
      </div>
    </div>
  </div>
</template>

<script>
import FormMovie from "./components/FormMovie.vue";

export default {
  name: "AddMovie",
  components: {
    FormMovie,
  },
};
</script>

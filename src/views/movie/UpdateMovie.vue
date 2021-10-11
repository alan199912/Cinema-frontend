<template>
  <div class="container mt-5">
    <h1 class="text-light">Update a movie</h1>
    <div class="row mt-3">
      <div class="offset-lg-3 col-lg-6">
        <FormMovie :section="false" />
      </div>
    </div>
  </div>
</template>

<script>
import FormMovie from "./components/FormMovie.vue";

export default {
  name: "UpdateMovie",
  components: {
    FormMovie,
  },
};
</script>

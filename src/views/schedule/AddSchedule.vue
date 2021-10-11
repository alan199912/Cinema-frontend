<template>
  <div class="container mt-5">
    <h1 class="text-light">Add a Schedule</h1>
    <div class="row mt-3">
      <div class="offset-lg-3 col-lg-6">
        <FormSchedule :section="true" />
      </div>
    </div>
  </div>
</template>

<script>
import FormSchedule from "./components/FormSchedule.vue";

export default {
  name: "AddMovie",
  components: {
    FormSchedule,
  },
};
</script>

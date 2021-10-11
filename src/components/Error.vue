<template>
  <div>
    <div
      class="alert alert-danger alert-dismissible fade show mt-5"
      role="alert"
    >
      <strong>Error!</strong> {{ getError }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error",
  props: ["getError"],
};
</script>

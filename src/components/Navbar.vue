<template>
  <div>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <div class="container-fluid mx-5">
        <a class="navbar-brand" href="#">Cinema</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
            <li class="nav-item">
              <router-link
                class="nav-link active"
                aria-current="page"
                to="/dashboard/catalogue"
                >Catalogue</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link active"
                aria-current="page"
                to="/dashboard/tickets"
                >Your tickets</router-link
              >
            </li>
            <li class="nav-item" v-if="verifyRole">
              <router-link
                class="nav-link active"
                aria-current="page"
                to="/dashboard/movies"
                >Movies</router-link
              >
            </li>
            <!-- <li class="nav-item" v-if="verifyRole">
              <router-link
                class="nav-link active"
                aria-current="page"
                to="/dashboard/add-movie"
                >Add movie</router-link
              >
            </li> -->
          </ul>
          <button @click="logOut()" class="btn btn-danger">Log out</button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Navbar",
  computed: {
    verifyRole() {
      return this.$store.state.user.role_id === 1;
    },
  },
  methods: {
    async logOut() {
      await axios
        .post(
          "http://localhost:8000/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);

          if (res.data.status === "success") {
            localStorage.clear();
            this.$store.state.user = null;
            this.$store.state.token = null;
            this.$router.push({ path: "/" });
          }
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

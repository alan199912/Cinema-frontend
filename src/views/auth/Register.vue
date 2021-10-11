<template>
  <div class="container mt-5">
    <a :href="'/'" class="btn btn-secondary float-start position-relative">
      Back
    </a>
    <Loader v-if="isLoading" />
    <div v-if="!isLoading" class="row">
      <h2 class="text-light">Register</h2>
      <div class="col-lg-4 mt-5 offset-lg-4">
        <form class="border p-5 bg-light">
          <meta name="csrf-token" content="{{ csrf_token() }}" />
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              v-model="username"
              id="username"
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              class="form-control"
              v-model="email"
              id="email"
            />
          </div>
          <div class="mb-3">
            <label for="pass" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              v-model="password"
              id="password"
            />
          </div>
          <div class="d-grid gap-2 col-12 mx-auto">
            <button type="button" class="btn btn-primary" @click="register()">
              Register
            </button>
          </div>
        </form>
        <div v-if="isShowError">
          <Error :getError="getErrorMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "../../components/Loader.vue";
import Error from "../../components/Error.vue";
import axios from "axios";

export default {
  name: "Register",
  components: {
    Loader,
    Error,
  },
  data() {
    return {
      username: null,
      email: null,
      password: null,
      isLoading: false,
      getErrorMessage: null,
    };
  },
  methods: {
    async register() {
      this.isLoading = true;

      const body = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      console.log(body);

      await axios
        .post("http://localhost:8000/api/auth/register", body, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);

          if (res.data.status === "success") {
            this.isLoading = false;
            this.$router.push({ path: "/" });
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
};
</script>

<template>
  <div class="container">
    <Loader v-if="isLoading" />
    <div v-if="!isLoading" class="row">
      <h2 class="text-light">Login</h2>
      <div class="col-lg-4 mt-5 offset-lg-4">
        <form class="border bg-light p-5">
          <meta name="csrf-token" content="{{ csrf_token() }}" />
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
            />
          </div>

          <div class="d-grid gap-2 col-12 mx-auto">
            <button type="button" class="btn btn-primary" @click="login()">
              Login
            </button>
            <p>
              You dont have a account? click here
              <a class="text-decoration-none text-info mt-5" :href="'/register'"
                >Register</a
              >
            </p>
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
import Vuex from "vuex";

export default {
  name: "Login",
  components: {
    Loader,
    Error,
  },
  data() {
    return {
      email: null,
      password: null,
      isLoading: false,
      isShowError: false,
      getErrorMessage: null,
    };
  },
  computed: {
    ...Vuex.mapMutations(["loginUser", "setToken"]),
  },
  methods: {
    async login() {
      this.isLoading = true;

      const body = {
        email: this.email,
        password: this.password,
      };

      await axios
        .post("http://localhost:8000/api/auth/login", body, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status === "success") {
            this.$store.state.user = res.data.user;
            this.$store.dispatch("loginUserAction");

            this.$store.state.token = res.data.token.original.access_token;
            this.$store.dispatch("setTokenAction");

            localStorage.setItem("idUser", res.data.user.id);
            localStorage.setItem("TOKEN", res.data.token.original.access_token);

            this.$router.push("/dashboard/catalogue");
            this.isLoading = false;
            return;
          }

          this.getErrorMessage = res.data.message;
          throw new Error();
        })
        .catch((error) => {
          console.log(error.message);
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

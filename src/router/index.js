import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index.js";
import axios from "axios";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/auth/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/auth/Register.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../views/dashboard/Dashboard.vue"),
    children: [
      {
        path: "catalogue",
        name: "Catalogue",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/dashboard/components/Catalogue.vue"),
      },
      {
        path: "tickets",
        name: "Tickets",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/ticket/Tickets.vue"),
      },
      {
        path: "ticket-info/:id",
        name: "Ticket-info",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/ticket/Ticket-info.vue"),
      },
      {
        path: "movies",
        name: "Movies",
        meta: {
          requireRole: true,
        },
        component: () => import("../views/movie/Movies.vue"),
      },
      {
        path: "add-movie",
        name: "AddMovie",
        meta: {
          requireRole: true,
        },
        component: () => import("../views/movie/AddMovie.vue"),
      },
      {
        path: "update-movie/:id",
        name: "UpdateMovie",
        meta: {
          requireRole: true,
        },
        component: () => import("../views/movie/UpdateMovie.vue"),
      },
      {
        path: "schedules/:id",
        name: "Schedules",
        meta: {
          requireRole: true,
        },
        component: () => import("../views/schedule/Schedules.vue"),
      },
      {
        path: "add-schedule/:movie_id",
        name: "AddSchedule",
        meta: {
          requireRole: true,
        },
        component: () => import("../views/schedule/AddSchedule.vue"),
      },
      {
        path: "update-schedule/:id",
        name: "UpdateSchedule",
        meta: {
          requireRole: true,
        },
        component: () => import("../views/schedule/UpdateSchedule.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Login",
    component: () => import("../views/auth/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  to.matched.some((record) => console.log(record.meta.requireRole));

  const token = localStorage.getItem("TOKEN");

  if (token) {
    store.state.token = token;
    await axios
      .get("http://localhost:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        store.state.user = res.data;
        console.log(store.state.user);
        store.dispatch("loginUserAction");
      })
      .catch((error) => {
        console.log(error);
        store.state.user = null;
        store.state.token = null;
        localStorage.clear();
        this.$router.push("/");
      });
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.getLoggedUser && !token) {
      next({ path: "/" });
      return;
    }
  }

  if (to.matched.some((record) => record.meta.requireRole)) {
    if (store.getters.getLoggedUser.role_id !== 1) {
      next({ path: "/dashboard/catalogue" });
      return;
    }
  }
  next();
});

export default router;

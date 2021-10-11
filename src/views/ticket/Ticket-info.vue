<template>
  <div>
    <Loader v-if="isLoading" />
    <div v-if="!isLoading" class="container d-flex justify-content-center mt-5">
      <div class="card mb-3" style="max-width: 900px">
        <div class="row g-0">
          <div class="col-md-4 d-flex justify-content-center">
            <img
              v-bind:src="ticket.movie.image"
              class="img-fluid rounded-start"
              alt="image"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body mt-2">
              <h5 class="card-title">{{ ticket.movie.name }}</h5>
              <p class="card-text mt-3">
                {{ ticket.movie.description }}
              </p>
              <div class="d-flex justify-content-between mt-4">
                <p class="card-text">
                  <small class="text-muted"
                    >Cinema: {{ ticket.cinema.name }}</small
                  >
                </p>
                <p class="card-text">
                  <small class="text-muted"
                    >Order date :
                    {{
                      new Date(ticket.created_at).toLocaleDateString()
                    }}</small
                  >
                </p>
              </div>
              <div class="card">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    Schedule: {{ ticket.schedule.time }}
                  </li>
                  <li class="list-group-item">
                    Tickets: {{ ticket.quantity }}
                  </li>
                  <li class="list-group-item">Total: ${{ ticket.total }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "../../components/Loader.vue";

export default {
  name: "Ticket-info",
  components: {
    Loader,
  },
  data() {
    return {
      ticket: null,
      isLoading: false,
    };
  },
  computed: {
    currency() {
      return this.ticket.total.toLocaleString("es-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
  async beforeMount() {
    this.isLoading = true;
    await axios
      .get(
        `http://localhost:8000/api/v1/getOrderById/${this.$route.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.order);
        this.ticket = res.data.order;
        this.isLoading = false;
      });
  },
};
</script>

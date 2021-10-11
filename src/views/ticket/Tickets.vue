<template>
  <div>
    <h2 class="text-light">Tickets</h2>
    <div class="container">
      <div class="row mt-3">
        <div class="col-sm-6 mt-2" v-for="ticket in tickets" :key="ticket.id">
          <div class="card text-center">
            <div class="card-header">{{ ticket.cinema.name }}</div>
            <div class="card-body">
              <h5 class="card-title">{{ ticket.movie.name }}</h5>
              <p class="card-text">Quantity ticket: {{ ticket.quantity }}</p>
              <a
                class="btn btn-primary"
                :href="`/dashboard/ticket-info/${ticket.id}`"
                >See ticket</a
              >
            </div>
            <div class="card-footer text-muted">
              Schedule: {{ ticket.schedule.time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Tickets",
  data() {
    return {
      tickets: [],
    };
  },
  async beforeMount() {
    const idUser = localStorage.getItem("idUser");

    await axios
      .get(`http://localhost:8000/api/v1/getOrderByUser/${idUser}`, {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getTokenActive}`,
        },
      })
      .then((res) => {
        console.log(res.data.orders);
        this.tickets = res.data.orders;
      });
  },
};
</script>

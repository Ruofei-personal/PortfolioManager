const { createApp, computed, watch } = Vue;

createApp({
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      registerForm: {
        email: "",
        password: "",
      },
      assetForm: {
        name: "",
        quantity: 1,
        cost: 0,
      },
      portfolio: [],
      token: localStorage.getItem("pm_token") || "",
      userEmail: localStorage.getItem("pm_email") || "",
      chart: null,
    };
  },
  computed: {
    isAuthed() {
      return Boolean(this.token);
    },
    stats() {
      const total = this.portfolio.reduce((sum, item) => sum + item.totalCost, 0);
      const totalQty = this.portfolio.reduce((sum, item) => sum + item.quantity, 0);
      return {
        assetCount: this.portfolio.length,
        totalCost: this.currency(total || 0),
        averageCost: this.currency(totalQty ? total / totalQty : 0),
      };
    },
  },
  methods: {
    currency(value) {
      return `¥${Number(value).toFixed(2)}`;
    },
    async apiFetch(url, options = {}) {
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };
      if (this.token) headers.Authorization = `Bearer ${this.token}`;
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "请求失败" }));
        throw new Error(error.detail || error.message || "请求失败");
      }
      return response.json();
    },
    async login() {
      try {
        const result = await this.apiFetch("/api/login", {
          method: "POST",
          body: JSON.stringify({
            email: this.loginForm.email,
            password: this.loginForm.password,
          }),
        });
        this.token = result.token;
        this.userEmail = result.email;
        localStorage.setItem("pm_token", result.token);
        localStorage.setItem("pm_email", result.email);
        this.loginForm.email = "";
        this.loginForm.password = "";
        await this.loadPortfolio();
      } catch (error) {
        alert(error.message || "登录失败");
      }
    },
    async register() {
      try {
        await this.apiFetch("/api/register", {
          method: "POST",
          body: JSON.stringify({
            email: this.registerForm.email,
            password: this.registerForm.password,
          }),
        });
        this.registerForm.email = "";
        this.registerForm.password = "";
        alert("注册成功，请登录");
      } catch (error) {
        alert(error.message || "注册失败");
      }
    },
    async loadPortfolio() {
      if (!this.token) return;
      this.portfolio = await this.apiFetch("/api/portfolio");
    },
    async saveAsset() {
      if (!this.assetForm.name || this.assetForm.quantity <= 0 || this.assetForm.cost < 0) {
        alert("请输入有效的资产信息");
        return;
      }
      try {
        await this.apiFetch("/api/portfolio", {
          method: "POST",
          body: JSON.stringify({
            name: this.assetForm.name,
            quantity: Number(this.assetForm.quantity),
            cost: Number(this.assetForm.cost),
          }),
        });
        this.assetForm.name = "";
        this.assetForm.quantity = 1;
        this.assetForm.cost = 0;
        await this.loadPortfolio();
      } catch (error) {
        alert(error.message || "保存失败");
      }
    },
    async deleteAsset(id) {
      try {
        await this.apiFetch(`/api/portfolio/${id}`, { method: "DELETE" });
        await this.loadPortfolio();
      } catch (error) {
        alert(error.message || "删除失败");
      }
    },
    logout() {
      this.token = "";
      this.userEmail = "";
      localStorage.removeItem("pm_token");
      localStorage.removeItem("pm_email");
      this.portfolio = [];
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    },
    renderChart() {
      const ctx = document.getElementById("portfolioChart");
      if (!ctx) return;
      const labels = this.portfolio.map((item) => item.name);
      const values = this.portfolio.map((item) => item.totalCost);
      const colors = ["#5cf0ff", "#7c5cff", "#ff9f68", "#00d68f", "#ff6b6b", "#ffd93d"];

      if (this.chart) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = values;
        this.chart.update();
        return;
      }

      this.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#f5f7ff",
              },
            },
          },
          cutout: "65%",
        },
      });
    },
    async init() {
      if (!this.token) return;
      try {
        const profile = await this.apiFetch("/api/profile");
        this.userEmail = profile.email;
        localStorage.setItem("pm_email", profile.email);
        await this.loadPortfolio();
      } catch (error) {
        this.logout();
      }
    },
  },
  mounted() {
    this.init();
    watch(
      () => this.portfolio,
      () => this.$nextTick(() => this.renderChart()),
      { deep: true }
    );
  },
}).mount("#app");

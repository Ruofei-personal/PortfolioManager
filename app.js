const { createApp, computed, watch } = Vue;

createApp({
  data() {
    return {
      locale: localStorage.getItem("pm_locale") || (navigator.language.startsWith("zh") ? "zh-CN" : "en-US"),
      translations: {
        "zh-CN": {
          brandTitle: "Portfolio Manager",
          brandSubtitle: "你的持仓，轻松掌控",
          logout: "退出登录",
          welcomeBack: "欢迎回来",
          welcomeSubtitle: "登录后管理你的投资组合。",
          email: "邮箱",
          emailPlaceholder: "you@email.com",
          password: "密码",
          passwordPlaceholder: "••••••••",
          passwordMinPlaceholder: "至少 6 位",
          login: "登录",
          or: "或",
          createAccount: "创建账号",
          dataHint: "数据将保存在服务器 SQLite（示例）。",
          visualTitle: "酷炫数据可视化",
          visualSubtitle: "使用饼图快速洞察资产占比，了解平均成本、数量与总投入。",
          visualFeatureOne: "实时更新持仓",
          visualFeatureTwo: "自动计算平均成本",
          visualFeatureThree: "多资产占比展示",
          overviewTitle: "资产概览",
          greeting: "Hi, {email}",
          statAssets: "资产数",
          statTotalCost: "总投入",
          statAverageCost: "平均成本",
          formTitle: "新增/加仓",
          formSubtitle: "记录你的每一笔买入。",
          assetName: "资产名称",
          assetNamePlaceholder: "Apple / AAPL",
          category: "分类",
          quantity: "数量",
          totalCost: "买入总价 ({currency})",
          saveAsset: "保存持仓",
          tableTitle: "持仓明细",
          tableSubtitle: "点击删除移除资产。",
          searchPlaceholder: "搜索资产名称",
          filterCategory: "全部分类",
          filterAll: "全部",
          filterSort: "排序",
          sortRecent: "最近更新",
          sortName: "名称",
          sortTotalCost: "总投入",
          sortQuantity: "数量",
          clearFilters: "清除筛选",
          avgCostLabel: "平均成本 {value}",
          costPerShare: "成本/股",
          delete: "删除",
          emptyState: "暂无资产，先添加一笔持仓吧。",
          emptyStateFiltered: "没有匹配的资产，请调整筛选条件。",
          categoryStock: "股票",
          categoryCrypto: "虚拟币",
          loginFailed: "登录失败",
          loginSuccess: "登录成功",
          registerSuccess: "注册成功，请登录",
          registerFailed: "注册失败",
          invalidAsset: "请输入有效的资产信息",
          assetSaved: "持仓已保存",
          saveFailed: "保存失败",
          assetDeleted: "持仓已删除",
          deleteFailed: "删除失败",
          requestFailed: "请求失败",
          logoutSuccess: "已退出登录",
          loading: "加载中...",
          saving: "保存中...",
          deleting: "删除中...",
          assetNameError: "请输入资产名称",
          quantityError: "数量需大于 0",
          costError: "买入总价需大于或等于 0",
        },
        "en-US": {
          brandTitle: "Portfolio Manager",
          brandSubtitle: "Track your holdings with ease",
          logout: "Sign out",
          welcomeBack: "Welcome back",
          welcomeSubtitle: "Log in to manage your portfolio.",
          email: "Email",
          emailPlaceholder: "you@email.com",
          password: "Password",
          passwordPlaceholder: "••••••••",
          passwordMinPlaceholder: "At least 6 characters",
          login: "Sign in",
          or: "or",
          createAccount: "Create account",
          dataHint: "Data is stored on the server SQLite (demo).",
          visualTitle: "Beautiful data visualization",
          visualSubtitle: "Use the donut chart to see allocation, average cost, quantity, and total invested.",
          visualFeatureOne: "Real-time holdings updates",
          visualFeatureTwo: "Automatic average cost",
          visualFeatureThree: "Multi-asset allocation view",
          overviewTitle: "Portfolio overview",
          greeting: "Hi, {email}",
          statAssets: "Assets",
          statTotalCost: "Total invested",
          statAverageCost: "Average cost",
          formTitle: "Add / buy more",
          formSubtitle: "Log every buy in one place.",
          assetName: "Asset name",
          assetNamePlaceholder: "Apple / AAPL",
          category: "Category",
          quantity: "Quantity",
          totalCost: "Total cost ({currency})",
          saveAsset: "Save holding",
          tableTitle: "Holdings",
          tableSubtitle: "Click delete to remove assets.",
          searchPlaceholder: "Search by asset name",
          filterCategory: "All categories",
          filterAll: "All",
          filterSort: "Sort",
          sortRecent: "Most recent",
          sortName: "Name",
          sortTotalCost: "Total invested",
          sortQuantity: "Quantity",
          clearFilters: "Clear filters",
          avgCostLabel: "Avg cost {value}",
          costPerShare: "Cost/share",
          delete: "Delete",
          emptyState: "No assets yet. Add your first holding.",
          emptyStateFiltered: "No matching holdings. Update your filters to see results.",
          categoryStock: "Stocks",
          categoryCrypto: "Crypto",
          loginFailed: "Login failed",
          loginSuccess: "Signed in successfully",
          registerSuccess: "Registration successful. Please sign in.",
          registerFailed: "Registration failed",
          invalidAsset: "Please enter valid asset information",
          assetSaved: "Holding saved",
          saveFailed: "Save failed",
          assetDeleted: "Holding deleted",
          deleteFailed: "Delete failed",
          requestFailed: "Request failed",
          logoutSuccess: "Signed out",
          loading: "Loading...",
          saving: "Saving...",
          deleting: "Deleting...",
          assetNameError: "Please enter an asset name",
          quantityError: "Quantity must be greater than 0",
          costError: "Total cost must be at least 0",
        },
      },
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
        category: "stock",
        quantity: 1,
        cost: 0,
      },
      assetErrors: {
        name: "",
        quantity: "",
        cost: "",
      },
      categories: [
        { value: "stock", labelKey: "categoryStock" },
        { value: "crypto", labelKey: "categoryCrypto" },
      ],
      filters: {
        query: "",
        category: "all",
        sort: "recent",
      },
      portfolio: [],
      token: localStorage.getItem("pm_token") || "",
      userEmail: localStorage.getItem("pm_email") || "",
      chart: null,
      notice: {
        message: "",
        type: "info",
      },
      isLoading: {
        login: false,
        register: false,
        save: false,
        deletingId: null,
      },
    };
  },
  computed: {
    isAuthed() {
      return Boolean(this.token);
    },
    localeLabel() {
      return this.locale.startsWith("zh") ? "English" : "中文";
    },
    currencyCode() {
      return this.locale.startsWith("zh") ? "CNY" : "USD";
    },
    currencySymbol() {
      const parts = new Intl.NumberFormat(this.locale, {
        style: "currency",
        currency: this.currencyCode,
      }).formatToParts(0);
      return parts.find((part) => part.type === "currency")?.value || this.currencyCode;
    },
    stats() {
      const total = this.visiblePortfolio.reduce((sum, item) => sum + item.totalCost, 0);
      const totalQty = this.visiblePortfolio.reduce((sum, item) => sum + item.quantity, 0);
      return {
        assetCount: this.visiblePortfolio.length,
        totalCost: this.currency(total || 0),
        averageCost: this.currency(totalQty ? total / totalQty : 0),
      };
    },
    visiblePortfolio() {
      let list = [...this.portfolio];
      const query = this.filters.query.trim().toLowerCase();
      if (query) {
        list = list.filter((asset) => asset.name.toLowerCase().includes(query));
      }
      if (this.filters.category !== "all") {
        list = list.filter(
          (asset) => this.normalizedCategory(asset.category) === this.filters.category
        );
      }
      if (this.filters.sort === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.filters.sort === "totalCost") {
        list.sort((a, b) => b.totalCost - a.totalCost);
      } else if (this.filters.sort === "quantity") {
        list.sort((a, b) => b.quantity - a.quantity);
      }
      return list;
    },
    hasActiveFilters() {
      return (
        this.filters.query.trim().length > 0 ||
        this.filters.category !== "all" ||
        this.filters.sort !== "recent"
      );
    },
  },
  methods: {
    t(key, params = {}) {
      const dictionary = this.translations[this.locale] || this.translations["en-US"];
      const text = dictionary[key] || key;
      return Object.entries(params).reduce(
        (result, [paramKey, value]) => result.replaceAll(`{${paramKey}}`, value),
        text
      );
    },
    toggleLocale() {
      this.locale = this.locale.startsWith("zh") ? "en-US" : "zh-CN";
      localStorage.setItem("pm_locale", this.locale);
      this.updateDocumentLang();
    },
    updateDocumentLang() {
      document.documentElement.setAttribute("lang", this.locale);
    },
    categoryLabel(value) {
      if (value === "stock" || value === "股票") return this.t("categoryStock");
      if (value === "crypto" || value === "虚拟币") return this.t("categoryCrypto");
      return value;
    },
    normalizedCategory(value) {
      if (value === "stock" || value === "股票") return "stock";
      if (value === "crypto" || value === "虚拟币") return "crypto";
      return value;
    },
    currency(value) {
      const formatter = new Intl.NumberFormat(this.locale, {
        style: "currency",
        currency: this.currencyCode,
        maximumFractionDigits: 2,
      });
      return formatter.format(Number(value) || 0);
    },
    clearAssetError(field) {
      if (this.assetErrors[field]) {
        this.assetErrors[field] = "";
      }
    },
    async apiFetch(url, options = {}) {
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };
      if (this.token) headers.Authorization = `Bearer ${this.token}`;
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: this.t("requestFailed") }));
        throw new Error(error.detail || error.message || this.t("requestFailed"));
      }
      return response.json();
    },
    async login() {
      if (this.isLoading.login) return;
      this.isLoading.login = true;
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
        this.setNotice(this.t("loginSuccess"), "success");
      } catch (error) {
        this.setNotice(error.message || this.t("loginFailed"), "error");
      } finally {
        this.isLoading.login = false;
      }
    },
    async register() {
      if (this.isLoading.register) return;
      this.isLoading.register = true;
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
        this.setNotice(this.t("registerSuccess"), "success");
      } catch (error) {
        this.setNotice(error.message || this.t("registerFailed"), "error");
      } finally {
        this.isLoading.register = false;
      }
    },
    async loadPortfolio() {
      if (!this.token) return;
      this.portfolio = await this.apiFetch("/api/portfolio");
    },
    async saveAsset() {
      const errors = {
        name: "",
        quantity: "",
        cost: "",
      };
      if (!this.assetForm.name.trim()) {
        errors.name = this.t("assetNameError");
      }
      if (this.assetForm.quantity <= 0) {
        errors.quantity = this.t("quantityError");
      }
      if (this.assetForm.cost < 0) {
        errors.cost = this.t("costError");
      }
      this.assetErrors = errors;
      if (errors.name || errors.quantity || errors.cost) {
        this.setNotice(this.t("invalidAsset"), "error");
        return;
      }
      if (this.isLoading.save) return;
      this.isLoading.save = true;
      try {
        const saved = await this.apiFetch("/api/portfolio", {
          method: "POST",
          body: JSON.stringify({
            name: this.assetForm.name,
            category: this.assetForm.category,
            quantity: Number(this.assetForm.quantity),
            cost: Number(this.assetForm.cost),
          }),
        });
        this.assetForm.name = "";
        this.assetForm.category = "stock";
        this.assetForm.quantity = 1;
        this.assetForm.cost = 0;
        this.assetErrors = {
          name: "",
          quantity: "",
          cost: "",
        };
        const existingIndex = this.portfolio.findIndex((asset) => asset.id === saved.id);
        if (existingIndex >= 0) {
          this.portfolio.splice(existingIndex, 1);
        }
        this.portfolio.unshift(saved);
        this.setNotice(this.t("assetSaved"), "success");
      } catch (error) {
        this.setNotice(error.message || this.t("saveFailed"), "error");
      } finally {
        this.isLoading.save = false;
      }
    },
    async deleteAsset(id) {
      if (this.isLoading.deletingId) return;
      this.isLoading.deletingId = id;
      try {
        await this.apiFetch(`/api/portfolio/${id}`, { method: "DELETE" });
        this.portfolio = this.portfolio.filter((asset) => asset.id !== id);
        this.setNotice(this.t("assetDeleted"), "success");
      } catch (error) {
        this.setNotice(error.message || this.t("deleteFailed"), "error");
      } finally {
        this.isLoading.deletingId = null;
      }
    },
    async logout() {
      let hasError = false;
      if (this.token) {
        try {
          await this.apiFetch("/api/logout", { method: "POST" });
        } catch (error) {
          hasError = true;
          this.setNotice(error.message || this.t("requestFailed"), "error");
        }
      }
      this.token = "";
      this.userEmail = "";
      localStorage.removeItem("pm_token");
      localStorage.removeItem("pm_email");
      this.portfolio = [];
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      if (!hasError) {
        this.setNotice(this.t("logoutSuccess"), "info");
      }
    },
    setNotice(message, type = "info") {
      this.notice.message = message;
      this.notice.type = type;
    },
    generateChartColors(count) {
      if (!count) return [];
      return Array.from({ length: count }, (_, index) => {
        const hue = Math.round((360 / count) * index);
        return `hsl(${hue} 80% 65%)`;
      });
    },
    renderChart() {
      const ctx = document.getElementById("portfolioChart");
      if (!ctx) return;
      const dataSource = this.visiblePortfolio;
      const labels = dataSource.map((item) => item.name);
      const values = dataSource.map((item) => item.totalCost);
      const colors = this.generateChartColors(values.length);

      if (this.chart) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = values;
        this.chart.data.datasets[0].backgroundColor = colors;
        this.chart.update();
        return;
      }

      if (!values.length) {
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
    clearFilters() {
      this.filters = {
        query: "",
        category: "all",
        sort: "recent",
      };
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
    this.updateDocumentLang();
    this.init();
    watch(
      () => [this.portfolio, this.filters.query, this.filters.category, this.filters.sort],
      () => this.$nextTick(() => this.renderChart()),
      { deep: true }
    );
  },
}).mount("#app");

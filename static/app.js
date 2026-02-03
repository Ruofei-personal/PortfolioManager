const { createApp } = Vue;

createApp({
  data() {
    return {
      locale: localStorage.getItem("pm_locale") || (navigator.language.startsWith("zh") ? "zh-CN" : "en-US"),
      translations: {
        "zh-CN": {
          localeEnglish: "English",
          localeChinese: "中文",
          brandTitle: "Portfolio Manager",
          brandSubtitle: "你的持仓，轻松掌控",
          metaTitle: "Portfolio Manager",
          metaDescription: "Portfolio Manager 帮你追踪持仓、可视化占比，并轻松管理投资组合。",
          metaLocale: "zh_CN",
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
          visualFeatureTwo: "健康体检提示风险",
          visualFeatureThree: "目标仓位追踪与快捷视图",
          overviewTitle: "资产概览",
          greeting: "Hi, {email}",
          statAssets: "资产数",
          statTotalCost: "总投入",
          statAverageCost: "平均成本",
          actionsTitle: "组合操作",
          actionsSubtitle: "从你的持仓开始管理。",
          actionsHint: "添加持仓后，会在下方列表展示并自动统计。",
          addHolding: "添加持仓",
          refreshHoldings: "刷新持仓",
          mosaicTitle: "资产热力拼图",
          mosaicSubtitle: "按占比大小与盈亏颜色生成的迷你热区。",
          mosaicEmpty: "暂无可视化数据，添加持仓后自动生成。",
          formTitle: "新增持仓",
          formSubtitle: "只填必要信息即可。",
          assetName: "资产名称",
          assetNamePlaceholder: "Apple / AAPL",
          category: "分类",
          quantity: "数量",
          unitPrice: "单价 ({currency})",
          unitPriceSimple: "单价",
          totalCost: "买入总价 ({currency})",
          totalCostSimple: "买入总价",
          totalComputed: "总价（自动）",
          saveAsset: "保存持仓",
          updateAsset: "更新持仓",
          cancelEdit: "取消编辑",
          closeModal: "关闭",
          tableTitle: "持仓明细",
          tableSubtitle: "登录后只展示你的持仓。",
          tableAriaHoldings: "持仓列表",
          actions: "操作",
          searchPlaceholder: "搜索资产名称",
          filterCategory: "全部分类",
          filterAll: "全部",
          filterSort: "排序",
          sortRecent: "最近更新",
          sortName: "名称",
          sortTotalCost: "总投入",
          sortQuantity: "数量",
          filterRisk: "风险",
          clearFilters: "清除筛选",
          filterTag: "标签筛选",
          filterTagPlaceholder: "输入标签关键词",
          avgCostLabel: "平均成本 {value}",
          costPerShare: "成本/股",
          marketValue: "当前市值",
          profitLoss: "浮动盈亏",
          returnRate: "收益率",
          assetCurrency: "计价币种",
          currentPrice: "当前价格/成本",
          currentPricePlaceholder: "用于估算市值（可选）",
          riskLevel: "风险等级",
          riskLow: "低风险",
          riskMedium: "中风险",
          riskHigh: "高风险",
          strategy: "投资策略",
          strategyPlaceholder: "例如：定投/价值/趋势",
          sentiment: "情绪标签",
          sentimentPlaceholder: "例如：看多/观望/看空",
          assetTags: "标签",
          assetTagsPlaceholder: "用逗号分隔，例如：高风险, 长期",
          assetNote: "备注",
          assetNotePlaceholder: "比如：长期持有/短线策略",
          edit: "编辑",
          delete: "删除",
          emptyState: "暂无资产，先添加一笔持仓吧。",
          emptyStateFiltered: "没有匹配的资产，请调整筛选条件。",
          categoryStock: "股票",
          categoryCrypto: "虚拟币",
          categoryEtf: "ETF",
          loginFailed: "登录失败",
          loginSuccess: "登录成功",
          registerSuccess: "注册成功，请登录",
          registerFailed: "注册失败",
          invalidAsset: "请输入有效的资产信息",
          assetSaved: "持仓已保存",
          assetUpdated: "持仓已更新",
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
          unitPriceError: "单价需大于或等于 0",
          costError: "买入总价需大于或等于 0",
          insightsTitle: "趣味洞察中心",
          insightsSubtitle: "快速发现组合亮点与调整空间。",
          healthTitle: "组合体检",
          healthDiversification: "分散度",
          healthTopHolding: "最大持仓",
          healthCategoryMix: "资产覆盖",
          healthTipBalanced: "结构均衡",
          healthTipFocus: "集中度偏高",
          healthTipExpand: "尝试增加品类",
          targetTitle: "目标仓位追踪",
          targetSubtitle: "设置目标比例，自动提醒偏离幅度。",
          currentLabel: "当前",
          targetTotal: "目标合计 {total}%",
          targetDeltaOver: "超配 {value}%",
          targetDeltaUnder: "低配 {value}%",
          targetDeltaMatch: "已接近目标",
          performanceTitle: "收益走势看板",
          performanceSubtitle: "跟踪组合净值与收益变化。",
          performanceMetricsTitle: "进阶指标",
          performanceMetricsSubtitle: "基于历史快照估算波动与回撤。",
          performanceNoteNeutral: "完善当前价格以获得更准确的浮动收益。",
          performanceNotePositive: "当前组合保持正收益趋势。",
          performanceNoteNegative: "注意风险敞口，及时调整策略。",
          performanceVolatility: "波动率",
          performanceDrawdown: "最大回撤",
          performanceSharpe: "夏普比率",
          performanceWinRate: "上涨占比",
          metricUnavailable: "暂无",
          budgetTitle: "投入预算进度",
          budgetSubtitle: "设定目标预算，自动追踪完成度。",
          budgetTarget: "目标预算 ({currency})",
          budgetUsed: "已投入 {value}",
          budgetProgress: "完成度 {value}",
          budgetOver: "已超过目标预算，请注意资金节奏。",
          currencyTitle: "多币种与汇率",
          currencySubtitle: "设置展示币种并维护汇率。",
          displayCurrency: "展示币种",
          rateHint: "兑 USD",
          importTitle: "导入 / 导出",
          importSubtitle: "支持 CSV 批量导入与导出。",
          importHint: "CSV 列：name,category,quantity,cost,currency,currentPrice,riskLevel,strategy,sentiment,tags,note",
          exportCsv: "导出 CSV",
          exportFileName: "持仓.csv",
          importSuccess: "导入完成",
          importFailed: "导入失败",
          timelineTitle: "投资时间线",
          timelineSubtitle: "回看你的每次操作与变化。",
          timelineEmpty: "还没有操作记录",
          eventAdded: "新增持仓",
          eventUpdated: "更新持仓",
          eventDeleted: "删除持仓",
          eventImported: "批量导入",
          riskTitle: "风险热力图",
          riskSubtitle: "综合风险等级与策略分布。",
          riskScoreHint: "综合风险评分",
          strategyTitle: "策略分布",
          strategyEmpty: "暂无策略记录",
          presetTitle: "快捷视图",
          presetPlaceholder: "保存当前筛选为视图名称",
          presetSave: "保存视图",
          presetEmpty: "还没有保存视图",
          quickFiltersTitle: "快捷筛选",
          quickFilterReset: "重置筛选",
          tagInsightTitle: "标签热点",
          tagInsightSubtitle: "查看常用标签与投入占比。",
          tagInsightEmpty: "添加标签后，这里会显示热门标签",
          achievementTitle: "成就墙",
          achievementFirst: "首次建仓",
          achievementDiversified: "多元配置",
          achievementBalanced: "结构平衡",
          achievementNoteTaker: "勤记备注",
          achievementCollector: "组合扩张",
          achievementEmpty: "完成一次操作即可解锁成就",
        },
        "en-US": {
          localeEnglish: "English",
          localeChinese: "中文",
          brandTitle: "Portfolio Manager",
          brandSubtitle: "Track your holdings with ease",
          metaTitle: "Portfolio Manager",
          metaDescription:
            "Portfolio Manager helps you track holdings, visualize allocation, and manage investments with ease.",
          metaLocale: "en_US",
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
          visualFeatureTwo: "Portfolio health signals",
          visualFeatureThree: "Target tracking & quick views",
          overviewTitle: "Portfolio overview",
          greeting: "Hi, {email}",
          statAssets: "Assets",
          statTotalCost: "Total invested",
          statAverageCost: "Average cost",
          actionsTitle: "Portfolio actions",
          actionsSubtitle: "Keep your holdings up to date.",
          actionsHint: "Add a holding to see it in the list and summary.",
          addHolding: "Add holding",
          refreshHoldings: "Refresh holdings",
          mosaicTitle: "Allocation mosaic",
          mosaicSubtitle: "Tiles sized by weight and tinted by performance.",
          mosaicEmpty: "No data yet. Add holdings to generate the mosaic.",
          formTitle: "Add holding",
          formSubtitle: "Only the essentials.",
          assetName: "Asset name",
          assetNamePlaceholder: "Apple / AAPL",
          category: "Category",
          quantity: "Quantity",
          unitPrice: "Unit price ({currency})",
          unitPriceSimple: "Unit price",
          totalCost: "Total cost ({currency})",
          totalCostSimple: "Total cost",
          totalComputed: "Total (auto)",
          saveAsset: "Save holding",
          updateAsset: "Update holding",
          cancelEdit: "Cancel edit",
          closeModal: "Close",
          tableTitle: "Holdings",
          tableSubtitle: "Show only your holdings after login.",
          tableAriaHoldings: "Holdings table",
          actions: "Actions",
          searchPlaceholder: "Search by asset name",
          filterCategory: "All categories",
          filterAll: "All",
          filterSort: "Sort",
          sortRecent: "Most recent",
          sortName: "Name",
          sortTotalCost: "Total invested",
          sortQuantity: "Quantity",
          filterRisk: "Risk",
          clearFilters: "Clear filters",
          filterTag: "Tag filter",
          filterTagPlaceholder: "Search tags",
          avgCostLabel: "Avg cost {value}",
          costPerShare: "Cost/share",
          marketValue: "Market value",
          profitLoss: "P/L",
          returnRate: "Return",
          assetCurrency: "Currency",
          currentPrice: "Current price / basis",
          currentPricePlaceholder: "Optional for market value",
          riskLevel: "Risk level",
          riskLow: "Low risk",
          riskMedium: "Medium risk",
          riskHigh: "High risk",
          strategy: "Strategy",
          strategyPlaceholder: "e.g. DCA / Value / Trend",
          sentiment: "Sentiment",
          sentimentPlaceholder: "e.g. Bullish / Neutral / Bearish",
          assetTags: "Tags",
          assetTagsPlaceholder: "Comma-separated, e.g. high-risk, long-term",
          assetNote: "Notes",
          assetNotePlaceholder: "Example: long-term / swing trade",
          edit: "Edit",
          delete: "Delete",
          emptyState: "No assets yet. Add your first holding.",
          emptyStateFiltered: "No matching holdings. Update your filters to see results.",
          categoryStock: "Stocks",
          categoryCrypto: "Crypto",
          categoryEtf: "ETF",
          loginFailed: "Login failed",
          loginSuccess: "Signed in successfully",
          registerSuccess: "Registration successful. Please sign in.",
          registerFailed: "Registration failed",
          invalidAsset: "Please enter valid asset information",
          assetSaved: "Holding saved",
          assetUpdated: "Holding updated",
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
          unitPriceError: "Unit price must be at least 0",
          costError: "Total cost must be at least 0",
          insightsTitle: "Fun Insights Hub",
          insightsSubtitle: "Spot wins and gaps in your portfolio.",
          healthTitle: "Health check",
          healthDiversification: "Diversification",
          healthTopHolding: "Top holding",
          healthCategoryMix: "Category coverage",
          healthTipBalanced: "Balanced mix",
          healthTipFocus: "High concentration",
          healthTipExpand: "Add more categories",
          targetTitle: "Target allocation",
          targetSubtitle: "Set targets and monitor drift.",
          currentLabel: "Current",
          targetTotal: "Targets total {total}%",
          targetDeltaOver: "Over by {value}%",
          targetDeltaUnder: "Under by {value}%",
          targetDeltaMatch: "On target",
          performanceTitle: "Performance cockpit",
          performanceSubtitle: "Track portfolio value and returns.",
          performanceMetricsTitle: "Advanced metrics",
          performanceMetricsSubtitle: "Estimated from recent value snapshots.",
          performanceNoteNeutral: "Add current prices for more accurate returns.",
          performanceNotePositive: "Portfolio is trending positive.",
          performanceNoteNegative: "Review exposure and rebalance if needed.",
          performanceVolatility: "Volatility",
          performanceDrawdown: "Max drawdown",
          performanceSharpe: "Sharpe ratio",
          performanceWinRate: "Up days",
          metricUnavailable: "N/A",
          budgetTitle: "Budget progress",
          budgetSubtitle: "Set an investing target and track progress.",
          budgetTarget: "Budget target ({currency})",
          budgetUsed: "Invested {value}",
          budgetProgress: "Progress {value}",
          budgetOver: "You have exceeded your target budget.",
          currencyTitle: "Multi-currency center",
          currencySubtitle: "Choose display currency and maintain FX rates.",
          displayCurrency: "Display currency",
          rateHint: "to USD",
          importTitle: "Import / Export",
          importSubtitle: "Bulk import and export via CSV.",
          importHint: "CSV columns: name,category,quantity,cost,currency,currentPrice,riskLevel,strategy,sentiment,tags,note",
          exportCsv: "Export CSV",
          exportFileName: "portfolio.csv",
          importSuccess: "Import complete",
          importFailed: "Import failed",
          timelineTitle: "Investment timeline",
          timelineSubtitle: "Review every change you made.",
          timelineEmpty: "No events yet",
          eventAdded: "Added holding",
          eventUpdated: "Updated holding",
          eventDeleted: "Deleted holding",
          eventImported: "Bulk import",
          riskTitle: "Risk heatmap",
          riskSubtitle: "Risk levels plus strategy mix.",
          riskScoreHint: "Composite risk score",
          strategyTitle: "Strategy mix",
          strategyEmpty: "No strategies yet",
          presetTitle: "Quick views",
          presetPlaceholder: "Save current filters as a view",
          presetSave: "Save view",
          presetEmpty: "No saved views yet",
          quickFiltersTitle: "Quick filters",
          quickFilterReset: "Reset filters",
          tagInsightTitle: "Tag spotlight",
          tagInsightSubtitle: "See the most-used tags in your portfolio.",
          tagInsightEmpty: "Add tags to surface your top themes.",
          achievementTitle: "Achievements",
          achievementFirst: "First holding",
          achievementDiversified: "Diversified",
          achievementBalanced: "Balanced mix",
          achievementNoteTaker: "Notes champ",
          achievementCollector: "Growing stash",
          achievementEmpty: "Make a move to unlock achievements",
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
        unitPrice: "",
        currency: navigator.language.startsWith("zh") ? "CNY" : "USD",
        currentPrice: null,
        riskLevel: "medium",
        strategy: "",
        sentiment: "",
        tags: [],
        note: "",
      },
      assetErrors: {
        name: "",
        quantity: "",
        unitPrice: "",
      },
      categories: [
        { value: "stock", labelKey: "categoryStock" },
        { value: "crypto", labelKey: "categoryCrypto" },
        { value: "etf", labelKey: "categoryEtf" },
      ],
      portfolio: [],
      token: localStorage.getItem("pm_token") || "",
      userEmail: localStorage.getItem("pm_email") || "",
      editingId: null,
      isAssetModalOpen: false,
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
    isEditing() {
      return this.editingId !== null;
    },
    editingLabel() {
      return this.isEditing ? this.t("updateAsset") : this.t("saveAsset");
    },
    localeLabel() {
      return this.locale.startsWith("zh") ? this.t("localeEnglish") : this.t("localeChinese");
    },
    currencyCode() {
      return this.locale.startsWith("zh") ? "CNY" : "USD";
    },
    stats() {
      const total = this.visiblePortfolio.reduce((sum, item) => sum + (item.totalCost || 0), 0);
      const totalQty = this.visiblePortfolio.reduce((sum, item) => sum + item.quantity, 0);
      return {
        assetCount: this.visiblePortfolio.length,
        totalCost: this.currency(total || 0),
        averageCost: this.currency(totalQty ? total / totalQty : 0),
      };
    },
    visiblePortfolio() {
      return [...this.portfolio];
    },
    computedTotal() {
      const qty = Number(this.assetForm.quantity);
      const up = Number(this.assetForm.unitPrice);
      if (!qty || (this.assetForm.unitPrice !== "" && (isNaN(up) || up < 0))) return 0;
      return (qty * (this.assetForm.unitPrice === "" ? 0 : up)) || 0;
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
      this.updateDocumentMeta();
    },
    updateDocumentLang() {
      document.documentElement.setAttribute("lang", this.locale);
    },
    updateDocumentMeta() {
      document.title = this.t("metaTitle");
      const setMeta = (selector, content) => {
        const meta = document.querySelector(selector);
        if (meta) meta.setAttribute("content", content);
      };
      const description = this.t("metaDescription");
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:title"]', this.t("metaTitle"));
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[property="og:locale"]', this.t("metaLocale"));
      setMeta('meta[name="twitter:title"]', this.t("metaTitle"));
      setMeta('meta[name="twitter:description"]', description);
    },
    categoryLabel(value) {
      if (value === "stock" || value === "股票") return this.t("categoryStock");
      if (value === "crypto" || value === "虚拟币") return this.t("categoryCrypto");
      if (value === "etf" || value === "ETF") return this.t("categoryEtf");
      return value;
    },
    normalizedCategory(value) {
      if (value === "stock" || value === "股票") return "stock";
      if (value === "crypto" || value === "虚拟币") return "crypto";
      if (value === "etf" || value === "ETF") return "etf";
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
        unitPrice: "",
      };
      if (!this.assetForm.name.trim()) {
        errors.name = this.t("assetNameError");
      }
      if (this.assetForm.quantity <= 0) {
        errors.quantity = this.t("quantityError");
      }
      const unitPrice = Number(this.assetForm.unitPrice);
      if (unitPrice < 0 || (this.assetForm.unitPrice !== "" && isNaN(unitPrice))) {
        errors.unitPrice = this.t("unitPriceError");
      }
      this.assetErrors = errors;
      if (errors.name || errors.quantity || errors.unitPrice) {
        this.setNotice(this.t("invalidAsset"), "error");
        return;
      }
      if (this.isLoading.save) return;
      this.isLoading.save = true;
      try {
        const wasEditing = this.isEditing;
        const qty = Number(this.assetForm.quantity);
        const unitPrice = Number(this.assetForm.unitPrice) || 0;
        const payload = {
          name: this.assetForm.name,
          category: this.assetForm.category,
          quantity: qty,
          cost: qty * unitPrice,
          currency: this.assetForm.currency,
          currentPrice: this.assetForm.currentPrice ? Number(this.assetForm.currentPrice) : null,
          riskLevel: this.assetForm.riskLevel,
          strategy: this.assetForm.strategy.trim() || null,
          sentiment: this.assetForm.sentiment.trim() || null,
          tags: Array.isArray(this.assetForm.tags) ? this.assetForm.tags : [],
          note: this.assetForm.note.trim() || null,
        };
        const saved = await this.apiFetch(
          this.isEditing ? `/api/portfolio/${this.editingId}` : "/api/portfolio",
          {
            method: this.isEditing ? "PUT" : "POST",
            body: JSON.stringify(payload),
          }
        );
        const existingIndex = this.portfolio.findIndex((asset) => asset.id === saved.id);
        if (existingIndex >= 0) {
          this.portfolio.splice(existingIndex, 1, saved);
        } else {
          this.portfolio.unshift(saved);
        }
        this.resetAssetForm();
        this.closeAssetModal();
        this.setNotice(this.t(wasEditing ? "assetUpdated" : "assetSaved"), "success");
      } catch (error) {
        this.setNotice(error.message || this.t("saveFailed"), "error");
      } finally {
        this.isLoading.save = false;
      }
    },
    resetAssetForm() {
      this.assetForm = {
        name: "",
        category: "stock",
        quantity: 1,
        unitPrice: "",
        currency: this.locale.startsWith("zh") ? "CNY" : "USD",
        currentPrice: null,
        riskLevel: "medium",
        strategy: "",
        sentiment: "",
        tags: [],
        note: "",
      };
      this.assetErrors = {
        name: "",
        quantity: "",
        unitPrice: "",
      };
      this.editingId = null;
    },
    startEdit(asset) {
      this.editingId = asset.id;
      const qty = asset.quantity || 1;
      this.assetForm = {
        name: asset.name,
        category: this.normalizedCategory(asset.category),
        quantity: asset.quantity,
        unitPrice: qty ? (asset.totalCost / qty).toString() : "",
        currency: asset.currency || (this.locale.startsWith("zh") ? "CNY" : "USD"),
        currentPrice: asset.currentPrice ?? null,
        riskLevel: asset.riskLevel || "medium",
        strategy: asset.strategy || "",
        sentiment: asset.sentiment || "",
        tags: asset.tags || [],
        note: asset.note || "",
      };
      this.assetErrors = {
        name: "",
        quantity: "",
        unitPrice: "",
      };
      this.isAssetModalOpen = true;
    },
    cancelEdit() {
      this.resetAssetForm();
      this.closeAssetModal();
    },
    openAssetModal() {
      if (!this.isEditing) {
        this.resetAssetForm();
      }
      this.isAssetModalOpen = true;
    },
    closeAssetModal() {
      this.isAssetModalOpen = false;
      if (this.isEditing || this.assetForm.name) {
        this.resetAssetForm();
      }
    },
    async refreshPortfolio() {
      if (!this.token) return;
      try {
        await this.loadPortfolio();
      } catch (error) {
        this.setNotice(error.message || this.t("requestFailed"), "error");
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
      this.resetAssetForm();
      if (!hasError) {
        this.setNotice(this.t("logoutSuccess"), "info");
      }
    },
    setNotice(message, type = "info") {
      this.notice.message = message;
      this.notice.type = type;
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
    this.updateDocumentMeta();
    this.init();
  },
}).mount("#app");

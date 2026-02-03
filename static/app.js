const { createApp, computed, watch } = Vue;

const defaultFilters = {
  query: "",
  category: "all",
  sort: "recent",
  tag: "",
};

const loadStoredFilters = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("pm_filters") || "null");
    if (!stored || typeof stored !== "object") return { ...defaultFilters };
    const next = { ...defaultFilters, ...stored };
    if (!["all", "stock", "crypto", "etf"].includes(next.category)) {
      next.category = defaultFilters.category;
    }
    if (!["recent", "name", "totalCost", "quantity"].includes(next.sort)) {
      next.sort = defaultFilters.sort;
    }
    if (typeof next.query !== "string") {
      next.query = defaultFilters.query;
    }
    if (typeof next.tag !== "string") {
      next.tag = defaultFilters.tag;
    }
    return next;
  } catch (error) {
    return { ...defaultFilters };
  }
};

const defaultTargets = {
  stock: 60,
  crypto: 20,
  etf: 20,
};

const loadStoredTargets = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("pm_targets") || "null");
    if (!stored || typeof stored !== "object") return { ...defaultTargets };
    const next = { ...defaultTargets, ...stored };
    Object.keys(defaultTargets).forEach((key) => {
      const value = Number(next[key]);
      next[key] = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : defaultTargets[key];
    });
    return next;
  } catch (error) {
    return { ...defaultTargets };
  }
};

const loadStoredPresets = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("pm_view_presets") || "null");
    if (!Array.isArray(stored)) return [];
    return stored.filter((preset) => preset && typeof preset.name === "string" && preset.filters);
  } catch (error) {
    return [];
  }
};

const defaultRates = {
  USD: 1,
  CNY: 0.14,
  EUR: 1.08,
  JPY: 0.0067,
};

const loadStoredRates = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("pm_currency_rates") || "null");
    if (!stored || typeof stored !== "object") return { ...defaultRates };
    const next = { ...defaultRates, ...stored };
    Object.keys(next).forEach((code) => {
      const value = Number(next[code]);
      next[code] = Number.isFinite(value) && value > 0 ? value : defaultRates[code];
    });
    return next;
  } catch (error) {
    return { ...defaultRates };
  }
};

const loadStoredBudget = () => {
  const raw = Number(localStorage.getItem("pm_budget") || 0);
  return Number.isFinite(raw) && raw >= 0 ? raw : 0;
};

const loadStoredHistory = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("pm_value_history") || "null");
    if (!Array.isArray(stored)) return [];
    return stored.filter((entry) => entry && typeof entry.value === "number" && entry.timestamp);
  } catch (error) {
    return [];
  }
};

const loadStoredEvents = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("pm_events") || "null");
    if (!Array.isArray(stored)) return [];
    return stored.filter((entry) => entry && entry.id && entry.timestamp);
  } catch (error) {
    return [];
  }
};

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
          visualFeatureTwo: "健康体检提示风险",
          visualFeatureThree: "目标仓位追踪与快捷视图",
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
          updateAsset: "更新持仓",
          cancelEdit: "取消编辑",
          tableTitle: "持仓明细",
          tableSubtitle: "点击删除移除资产。",
          actions: "操作",
          searchPlaceholder: "搜索资产名称",
          filterCategory: "全部分类",
          filterAll: "全部",
          filterSort: "排序",
          sortRecent: "最近更新",
          sortName: "名称",
          sortTotalCost: "总投入",
          sortQuantity: "数量",
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
          performanceNoteNeutral: "完善当前价格以获得更准确的浮动收益。",
          performanceNotePositive: "当前组合保持正收益趋势。",
          performanceNoteNegative: "注意风险敞口，及时调整策略。",
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
          visualFeatureTwo: "Portfolio health signals",
          visualFeatureThree: "Target tracking & quick views",
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
          updateAsset: "Update holding",
          cancelEdit: "Cancel edit",
          tableTitle: "Holdings",
          tableSubtitle: "Click delete to remove assets.",
          actions: "Actions",
          searchPlaceholder: "Search by asset name",
          filterCategory: "All categories",
          filterAll: "All",
          filterSort: "Sort",
          sortRecent: "Most recent",
          sortName: "Name",
          sortTotalCost: "Total invested",
          sortQuantity: "Quantity",
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
          performanceNoteNeutral: "Add current prices for more accurate returns.",
          performanceNotePositive: "Portfolio is trending positive.",
          performanceNoteNegative: "Review exposure and rebalance if needed.",
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
        cost: 0,
        currency: "USD",
        currentPrice: null,
        riskLevel: "medium",
        strategy: "",
        sentiment: "",
        tags: "",
        note: "",
      },
      assetErrors: {
        name: "",
        quantity: "",
        cost: "",
      },
      categories: [
        { value: "stock", labelKey: "categoryStock" },
        { value: "crypto", labelKey: "categoryCrypto" },
        { value: "etf", labelKey: "categoryEtf" },
      ],
      currencyOptions: ["USD", "CNY", "EUR", "JPY"],
      currencyRates: loadStoredRates(),
      displayCurrency:
        localStorage.getItem("pm_display_currency") ||
        (navigator.language.startsWith("zh") ? "CNY" : "USD"),
      monthlyBudget: loadStoredBudget(),
      valueHistory: loadStoredHistory(),
      events: loadStoredEvents(),
      filters: loadStoredFilters(),
      portfolio: [],
      allocationTargets: loadStoredTargets(),
      presets: loadStoredPresets(),
      newPresetName: "",
      token: localStorage.getItem("pm_token") || "",
      userEmail: localStorage.getItem("pm_email") || "",
      chart: null,
      valueChart: null,
      editingId: null,
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
      return this.locale.startsWith("zh") ? "English" : "中文";
    },
    currencyCode() {
      return this.displayCurrency;
    },
    currencySymbol() {
      const parts = new Intl.NumberFormat(this.locale, {
        style: "currency",
        currency: this.currencyCode,
      }).formatToParts(0);
      return parts.find((part) => part.type === "currency")?.value || this.currencyCode;
    },
    stats() {
      const total = this.visiblePortfolio.reduce((sum, item) => sum + this.convertedCost(item), 0);
      const totalQty = this.visiblePortfolio.reduce((sum, item) => sum + item.quantity, 0);
      return {
        assetCount: this.visiblePortfolio.length,
        totalCost: this.currency(total || 0),
        averageCost: this.currency(totalQty ? total / totalQty : 0),
      };
    },
    allocationBreakdown() {
      const totals = this.visiblePortfolio.reduce(
        (acc, asset) => {
          const key = this.normalizedCategory(asset.category);
          if (!acc[key]) acc[key] = 0;
          acc[key] += this.convertedCost(asset);
          return acc;
        },
        { stock: 0, crypto: 0, etf: 0 }
      );
      const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
      return this.categories.map((category) => {
        const value = totals[category.value] || 0;
        const percent = total ? Math.round((value / total) * 100) : 0;
        const target = Number(this.allocationTargets[category.value]) || 0;
        const delta = percent - target;
        const deltaStatus = delta > 2 ? "over" : delta < -2 ? "under" : "match";
        let deltaLabel = this.t("targetDeltaMatch");
        if (deltaStatus === "over") {
          deltaLabel = this.t("targetDeltaOver", { value: Math.abs(delta) });
        } else if (deltaStatus === "under") {
          deltaLabel = this.t("targetDeltaUnder", { value: Math.abs(delta) });
        }
        return {
          key: category.value,
          label: this.t(category.labelKey),
          percent,
          target,
          deltaStatus,
          deltaLabel,
        };
      });
    },
    targetTotal() {
      return Object.values(this.allocationTargets).reduce((sum, value) => sum + Number(value || 0), 0);
    },
    healthChecks() {
      const total = this.visiblePortfolio.reduce((sum, item) => sum + this.convertedCost(item), 0);
      const categories = new Set(this.visiblePortfolio.map((asset) => this.normalizedCategory(asset.category)));
      const topHolding = this.visiblePortfolio.reduce(
        (max, item) => Math.max(max, total ? this.convertedCost(item) / total : 0),
        0
      );
      const diversificationScore = categories.size;
      const diversificationStatus = diversificationScore >= 2 ? "good" : "warn";
      const topHoldingStatus = topHolding > 0.5 ? "warn" : "good";
      const categoryStatus = categories.size >= 3 ? "good" : "warn";
      return [
        {
          label: this.t("healthDiversification"),
          value: `${diversificationScore}/3`,
          status: diversificationStatus,
          detail:
            diversificationStatus === "good" ? this.t("healthTipBalanced") : this.t("healthTipExpand"),
        },
        {
          label: this.t("healthTopHolding"),
          value: `${Math.round(topHolding * 100) || 0}%`,
          status: topHoldingStatus,
          detail: topHoldingStatus === "good" ? this.t("healthTipBalanced") : this.t("healthTipFocus"),
        },
        {
          label: this.t("healthCategoryMix"),
          value: categories.size ? `${Array.from(categories).length} ${this.t("category")}` : "0",
          status: categoryStatus,
          detail: categoryStatus === "good" ? this.t("healthTipBalanced") : this.t("healthTipExpand"),
        },
      ];
    },
    achievements() {
      const achievements = [];
      if (this.portfolio.length > 0) {
        achievements.push(this.t("achievementFirst"));
      }
      const categories = new Set(this.portfolio.map((asset) => this.normalizedCategory(asset.category)));
      if (categories.size >= 2) {
        achievements.push(this.t("achievementDiversified"));
      }
      const total = this.portfolio.reduce((sum, item) => sum + this.convertedCost(item), 0);
      const topHolding = this.portfolio.reduce(
        (max, item) => Math.max(max, total ? this.convertedCost(item) / total : 0),
        0
      );
      if (total && topHolding <= 0.5) {
        achievements.push(this.t("achievementBalanced"));
      }
      if (this.portfolio.some((asset) => asset.note && asset.note.trim().length > 0)) {
        achievements.push(this.t("achievementNoteTaker"));
      }
      if (this.portfolio.length >= 5) {
        achievements.push(this.t("achievementCollector"));
      }
      return achievements;
    },
    tagSpotlight() {
      const stats = new Map();
      this.portfolio.forEach((asset) => {
        (asset.tags || []).forEach((tag) => {
          const key = tag.toLowerCase();
          const entry = stats.get(key) || { label: tag, count: 0, totalCost: 0 };
          entry.count += 1;
          entry.totalCost += this.convertedCost(asset);
          stats.set(key, entry);
        });
      });
      return Array.from(stats.values())
        .sort((a, b) => b.totalCost - a.totalCost || b.count - a.count)
        .slice(0, 6)
        .map((entry) => ({
          ...entry,
          totalCostLabel: this.currency(entry.totalCost),
        }));
    },
    performanceStats() {
      const totalCost = this.portfolio.reduce((sum, asset) => sum + this.convertedCost(asset), 0);
      const totalValue = this.portfolio.reduce(
        (sum, asset) => sum + this.convertedMarketValue(asset),
        0
      );
      const profit = totalValue - totalCost;
      const returnRate = totalCost ? (profit / totalCost) * 100 : 0;
      const profitClass = profit >= 0 ? "positive" : "negative";
      let note = this.t("performanceNoteNeutral");
      if (profit > 0) {
        note = this.t("performanceNotePositive");
      } else if (profit < 0) {
        note = this.t("performanceNoteNegative");
      }
      return {
        marketValue: this.currency(totalValue),
        profit: this.currency(profit),
        returnRate: `${returnRate.toFixed(1)}%`,
        profitClass,
        note,
      };
    },
    budgetProgress() {
      if (!this.monthlyBudget) return 0;
      const totalCost = this.portfolio.reduce((sum, asset) => sum + this.convertedCost(asset), 0);
      return Math.min(150, Math.round((totalCost / this.monthlyBudget) * 100));
    },
    budgetProgressLabel() {
      return `${Math.round(this.budgetProgress)}%`;
    },
    budgetUsedLabel() {
      const totalCost = this.portfolio.reduce((sum, asset) => sum + this.convertedCost(asset), 0);
      return this.currency(totalCost);
    },
    eventTimeline() {
      return [...this.events]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 8)
        .map((event) => ({
          ...event,
          timeLabel: new Date(event.timestamp).toLocaleString(this.locale),
        }));
    },
    riskBreakdown() {
      const total = this.portfolio.length || 1;
      const counts = { low: 0, medium: 0, high: 0 };
      this.portfolio.forEach((asset) => {
        const level = asset.riskLevel || "medium";
        if (counts[level] !== undefined) counts[level] += 1;
      });
      return [
        { label: this.t("riskLow"), percent: Math.round((counts.low / total) * 100) },
        { label: this.t("riskMedium"), percent: Math.round((counts.medium / total) * 100) },
        { label: this.t("riskHigh"), percent: Math.round((counts.high / total) * 100) },
      ];
    },
    riskScoreLabel() {
      const scores = { low: 1, medium: 2, high: 3 };
      const total = this.portfolio.length || 1;
      const totalScore = this.portfolio.reduce(
        (sum, asset) => sum + (scores[asset.riskLevel] || 2),
        0
      );
      const normalized = Math.round((totalScore / (total * 3)) * 100);
      return `${normalized}/100`;
    },
    strategyBreakdown() {
      const counts = new Map();
      this.portfolio.forEach((asset) => {
        if (!asset.strategy) return;
        const label = asset.strategy.trim();
        if (!label) return;
        counts.set(label, (counts.get(label) || 0) + 1);
      });
      return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
    },
    achievementCards() {
      if (!this.portfolio.length) return [];
      const totalHoldings = this.portfolio.length;
      const withNotes = this.portfolio.filter((asset) => asset.note).length;
      const withTags = this.portfolio.filter((asset) => (asset.tags || []).length > 0).length;
      return [
        {
          label: this.t("achievementFirst"),
          subtitle: `${Math.min(totalHoldings, 1)}/1`,
          progress: Math.min(100, (totalHoldings / 1) * 100),
        },
        {
          label: this.t("achievementCollector"),
          subtitle: `${Math.min(totalHoldings, 10)}/10`,
          progress: Math.min(100, (totalHoldings / 10) * 100),
        },
        {
          label: this.t("achievementNoteTaker"),
          subtitle: `${Math.min(withNotes, 5)}/5`,
          progress: Math.min(100, (withNotes / 5) * 100),
        },
        {
          label: this.t("achievementDiversified"),
          subtitle: `${Math.min(withTags, 5)}/5`,
          progress: Math.min(100, (withTags / 5) * 100),
        },
      ];
    },
    canSavePreset() {
      return this.newPresetName.trim().length > 0;
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
      const tagQuery = this.filters.tag.trim().toLowerCase();
      if (tagQuery) {
        list = list.filter((asset) =>
          (asset.tags || []).some((tag) => tag.toLowerCase().includes(tagQuery))
        );
      }
      if (this.filters.sort === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.filters.sort === "totalCost") {
        list.sort((a, b) => this.convertedCost(b) - this.convertedCost(a));
      } else if (this.filters.sort === "quantity") {
        list.sort((a, b) => b.quantity - a.quantity);
      }
      return list;
    },
    hasActiveFilters() {
      return (
        this.filters.query.trim().length > 0 ||
        this.filters.category !== "all" ||
        this.filters.sort !== "recent" ||
        this.filters.tag.trim().length > 0
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
      if (value === "etf" || value === "ETF") return this.t("categoryEtf");
      return value;
    },
    normalizedCategory(value) {
      if (value === "stock" || value === "股票") return "stock";
      if (value === "crypto" || value === "虚拟币") return "crypto";
      if (value === "etf" || value === "ETF") return "etf";
      return value;
    },
    riskLabel(level) {
      const safeLevel = level || "medium";
      const key = `risk${safeLevel.charAt(0).toUpperCase()}${safeLevel.slice(1)}`;
      return this.t(key);
    },
    currency(value) {
      const formatter = new Intl.NumberFormat(this.locale, {
        style: "currency",
        currency: this.currencyCode,
        maximumFractionDigits: 2,
      });
      return formatter.format(Number(value) || 0);
    },
    rateToUsd(code) {
      return this.currencyRates[code] || defaultRates[code] || 1;
    },
    convertAmount(amount, fromCode, toCode) {
      const fromRate = this.rateToUsd(fromCode);
      const toRate = this.rateToUsd(toCode);
      if (!fromRate || !toRate) return amount;
      const amountUsd = amount * fromRate;
      return amountUsd / toRate;
    },
    convertedCost(asset) {
      return this.convertAmount(asset.totalCost, asset.currency || "USD", this.displayCurrency);
    },
    convertedMarketValue(asset) {
      const unitPrice = asset.currentPrice ?? asset.totalCost / asset.quantity;
      const value = unitPrice * asset.quantity;
      return this.convertAmount(value, asset.currency || "USD", this.displayCurrency);
    },
    parseTags(value) {
      if (!value) return [];
      const tags = value
        .split(/[,\|]/)
        .map((tag) => tag.trim())
        .filter(Boolean);
      return Array.from(new Set(tags.map((tag) => tag.toLowerCase()))).map(
        (tagLower) => tags.find((tag) => tag.toLowerCase() === tagLower) || tagLower
      );
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
      this.recordValueSnapshot();
      this.renderValueChart();
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
        const wasEditing = this.isEditing;
        const payload = {
          name: this.assetForm.name,
          category: this.assetForm.category,
          quantity: Number(this.assetForm.quantity),
          cost: Number(this.assetForm.cost),
          currency: this.assetForm.currency,
          currentPrice: this.assetForm.currentPrice ? Number(this.assetForm.currentPrice) : null,
          riskLevel: this.assetForm.riskLevel,
          strategy: this.assetForm.strategy.trim() || null,
          sentiment: this.assetForm.sentiment.trim() || null,
          tags: this.parseTags(this.assetForm.tags),
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
        this.addEvent(wasEditing ? "eventUpdated" : "eventAdded", saved);
        this.recordValueSnapshot();
        this.renderValueChart();
        this.resetAssetForm();
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
        cost: 0,
        currency: "USD",
        currentPrice: null,
        riskLevel: "medium",
        strategy: "",
        sentiment: "",
        tags: "",
        note: "",
      };
      this.assetErrors = {
        name: "",
        quantity: "",
        cost: "",
      };
      this.editingId = null;
    },
    startEdit(asset) {
      this.editingId = asset.id;
      this.assetForm = {
        name: asset.name,
        category: this.normalizedCategory(asset.category),
        quantity: asset.quantity,
        cost: asset.totalCost,
        currency: asset.currency || "USD",
        currentPrice: asset.currentPrice ?? null,
        riskLevel: asset.riskLevel || "medium",
        strategy: asset.strategy || "",
        sentiment: asset.sentiment || "",
        tags: (asset.tags || []).join(", "),
        note: asset.note || "",
      };
      this.assetErrors = {
        name: "",
        quantity: "",
        cost: "",
      };
    },
    cancelEdit() {
      this.resetAssetForm();
    },
    async deleteAsset(id) {
      if (this.isLoading.deletingId) return;
      this.isLoading.deletingId = id;
      try {
        await this.apiFetch(`/api/portfolio/${id}`, { method: "DELETE" });
        const removed = this.portfolio.find((asset) => asset.id === id);
        this.portfolio = this.portfolio.filter((asset) => asset.id !== id);
        if (removed) {
          this.addEvent("eventDeleted", removed);
        }
        this.recordValueSnapshot();
        this.renderValueChart();
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
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      if (this.valueChart) {
        this.valueChart.destroy();
        this.valueChart = null;
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
      const values = dataSource.map((item) => this.convertedCost(item));
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
    renderValueChart() {
      const ctx = document.getElementById("valueChart");
      if (!ctx) return;
      const labels = this.valueHistory.map((entry) =>
        new Date(entry.timestamp).toLocaleDateString(this.locale, { month: "short", day: "numeric" })
      );
      const values = this.valueHistory.map((entry) => entry.value);
      if (this.valueChart) {
        this.valueChart.data.labels = labels;
        this.valueChart.data.datasets[0].data = values;
        this.valueChart.update();
        return;
      }
      if (!values.length) return;
      this.valueChart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              data: values,
              fill: true,
              borderColor: "#5cf0ff",
              backgroundColor: "rgba(92, 240, 255, 0.15)",
              tension: 0.35,
              pointRadius: 2,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { ticks: { color: "#b1b7d1" } },
            y: { ticks: { color: "#b1b7d1" } },
          },
        },
      });
    },
    recordValueSnapshot() {
      const totalValue = this.portfolio.reduce(
        (sum, asset) => sum + this.convertedMarketValue(asset),
        0
      );
      const now = Date.now();
      const last = this.valueHistory[this.valueHistory.length - 1];
      if (last && now - last.timestamp < 1000 * 60 * 60 * 2) {
        return;
      }
      this.valueHistory.push({ id: `${now}`, timestamp: now, value: totalValue });
      if (this.valueHistory.length > 30) {
        this.valueHistory.shift();
      }
    },
    addEvent(key, asset) {
      const now = Date.now();
      this.events.unshift({
        id: `${now}-${Math.random().toString(16).slice(2, 6)}`,
        timestamp: now,
        title: this.t(key),
        detail: `${asset.name} · ${this.currency(this.convertedCost(asset))}`,
      });
      if (this.events.length > 40) {
        this.events.pop();
      }
    },
    handleImportFile(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const rows = this.parseCsv(String(reader.result || ""));
          for (const row of rows) {
            const payload = {
              name: row.name,
              category: row.category || "stock",
              quantity: Number(row.quantity || 0),
              cost: Number(row.cost || 0),
              currency: row.currency || "USD",
              currentPrice: row.currentPrice ? Number(row.currentPrice) : null,
              riskLevel: row.riskLevel || "medium",
              strategy: row.strategy || null,
              sentiment: row.sentiment || null,
              tags: this.parseTags(row.tags || ""),
              note: row.note || null,
            };
            await this.apiFetch("/api/portfolio", {
              method: "POST",
              body: JSON.stringify(payload),
            });
          }
          await this.loadPortfolio();
          this.addEvent("eventImported", { name: this.t("importTitle"), totalCost: 0, currency: "USD" });
          this.setNotice(this.t("importSuccess"), "success");
        } catch (error) {
          this.setNotice(error.message || this.t("importFailed"), "error");
        } finally {
          if (this.$refs.importFile) {
            this.$refs.importFile.value = "";
          }
        }
      };
      reader.readAsText(file);
    },
    parseCsv(raw) {
      const lines = raw.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return [];
      const headers = lines[0].split(",").map((header) => header.trim());
      return lines.slice(1).map((line) => {
        const values = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i += 1) {
          const char = line[i];
          if (char === "\"") {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            values.push(current);
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current);
        return headers.reduce((acc, header, index) => {
          acc[header] = values[index]?.replace(/^\"|\"$/g, "").trim() || "";
          return acc;
        }, {});
      });
    },
    exportCsv() {
      if (!this.portfolio.length) return;
      const headers = [
        "name",
        "category",
        "quantity",
        "cost",
        "currency",
        "currentPrice",
        "riskLevel",
        "strategy",
        "sentiment",
        "tags",
        "note",
      ];
      const rows = this.portfolio.map((asset) => [
        asset.name,
        asset.category,
        asset.quantity,
        asset.totalCost,
        asset.currency,
        asset.currentPrice ?? "",
        asset.riskLevel,
        asset.strategy ?? "",
        asset.sentiment ?? "",
        (asset.tags || []).join("|"),
        asset.note ?? "",
      ]);
      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "portfolio.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    clearFilters() {
      this.filters = {
        query: "",
        category: "all",
        sort: "recent",
        tag: "",
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
    savePreset() {
      const name = this.newPresetName.trim();
      if (!name) return;
      const preset = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        name,
        filters: { ...this.filters },
      };
      this.presets.unshift(preset);
      this.newPresetName = "";
    },
    applyPreset(preset) {
      this.filters = { ...preset.filters };
    },
    removePreset(presetId) {
      this.presets = this.presets.filter((preset) => preset.id !== presetId);
    },
  },
  mounted() {
    this.updateDocumentLang();
    this.init();
    watch(
      () => [
        this.portfolio,
        this.filters.query,
        this.filters.category,
        this.filters.sort,
        this.displayCurrency,
        this.currencyRates,
      ],
      () => this.$nextTick(() => this.renderChart()),
      { deep: true }
    );
    watch(
      () => [this.portfolio, this.displayCurrency, this.currencyRates],
      () => this.$nextTick(() => this.renderValueChart()),
      { deep: true }
    );
    watch(
      () => this.filters,
      (filters) => {
        localStorage.setItem("pm_filters", JSON.stringify(filters));
      },
      { deep: true }
    );
    watch(
      () => this.allocationTargets,
      (targets) => {
        localStorage.setItem("pm_targets", JSON.stringify(targets));
      },
      { deep: true }
    );
    watch(
      () => this.presets,
      (presets) => {
        localStorage.setItem("pm_view_presets", JSON.stringify(presets));
      },
      { deep: true }
    );
    watch(
      () => this.displayCurrency,
      (currency) => {
        localStorage.setItem("pm_display_currency", currency);
      }
    );
    watch(
      () => this.currencyRates,
      (rates) => {
        localStorage.setItem("pm_currency_rates", JSON.stringify(rates));
      },
      { deep: true }
    );
    watch(
      () => this.monthlyBudget,
      (budget) => {
        localStorage.setItem("pm_budget", String(budget || 0));
      }
    );
    watch(
      () => this.valueHistory,
      (history) => {
        localStorage.setItem("pm_value_history", JSON.stringify(history));
      },
      { deep: true }
    );
    watch(
      () => this.events,
      (events) => {
        localStorage.setItem("pm_events", JSON.stringify(events));
      },
      { deep: true }
    );
  },
}).mount("#app");

const { createApp, ref } = Vue;

const app = createApp({
  setup() {
    const loggedIn = ref(false);
    const currentUser = ref("");

    // Check for existing session on load
    const token = localStorage.getItem("jwt_token");
    const username = localStorage.getItem("username");
    if (token && username) {
      loggedIn.value = true;
      currentUser.value = username;
    }

    const handleLogin = (username) => {
      loggedIn.value = true;
      currentUser.value = username;
    };

    const handleLogout = () => {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("username");
      loggedIn.value = false;
      currentUser.value = "";
    };

    return {
      loggedIn,
      currentUser,
      handleLogin,
      handleLogout,
    };
  },
});

// --- Configuración PrimeVue ---
const PrimeVueConfigPlugin = PrimeVue && PrimeVue.Config;
const ToastService = PrimeVue && PrimeVue.ToastService;
const ConfirmationService = PrimeVue && PrimeVue.ConfirmationService;

if (
  PrimeVueConfigPlugin &&
  typeof PrimeVueConfigPlugin.install === "function"
) {
  app.use(PrimeVueConfigPlugin, {
    theme: {
      preset: PrimeVue.Themes && (PrimeVue.Themes.Aura || PrimeVue.Themes.aura),
    },
  });
}
if (ToastService) {
  app.use(ToastService);
}
if (ConfirmationService) {
  app.use(ConfirmationService);
}

// --- Registrar Componentes ---
// Componentes de PrimeVue
if (PrimeVue) {
  app.component("p-button", PrimeVue.Button);
  app.component("p-inputtext", PrimeVue.InputText);
  app.component("p-password", PrimeVue.Password);
  app.component("p-toast", PrimeVue.Toast);
  app.component("p-dialog", PrimeVue.Dialog);
  app.component("p-progressspinner", PrimeVue.ProgressSpinner);
  app.component("p-textarea", PrimeVue.Textarea);
  app.component("p-inputnumber", PrimeVue.InputNumber);
  app.component("p-fileupload", PrimeVue.FileUpload);
  app.component("p-inputgroup", PrimeVue.InputGroup);
  app.component("p-inputgroupaddon", PrimeVue.InputGroupAddon);
  app.component("p-confirmdialog", PrimeVue.ConfirmDialog);
  app.component("p-dropdown", PrimeVue.Dropdown);
  app.component("p-checkbox", PrimeVue.Checkbox);
  app.component("p-slider", PrimeVue.Slider);
  app.component("p-toolbar", PrimeVue.Toolbar);
  app.component("p-accordion", PrimeVue.Accordion);
  app.component("p-accordiontab", PrimeVue.AccordionTab);
}

// Mis componentes
app.component("login-register-form", LoginRegisterForm);
app.component("uma-catalog", UmaCatalog);
app.component("uma-card", UmaCard);
app.component("add-uma-form", AddUmaForm);

app.mount("#app");

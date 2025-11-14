const LoginRegisterForm = {
  template: "#login-register-form-template",
  emits: ["login-success"],
  setup(props, { emit }) {
    const { ref, reactive } = Vue;
    const toast = PrimeVue.useToast();

    const registerForm = reactive({ username: "", password: "", confirmPassword: "" });
    const loginForm = reactive({ username: "", password: "" });

    const error = ref("");
    const message = ref("");
    const activeTab = ref("login");

    const clearStatus = () => {
      error.value = "";
      message.value = "";
    };

    const switchTab = (tab) => {
      if (activeTab.value === tab) return;
      activeTab.value = tab;
      clearStatus();
    };

    const register = async () => {
      if (registerForm.password !== registerForm.confirmPassword) {
        toast.add({
          severity: "error",
          summary: "Error de Registro",
          detail: "Las contraseñas no coinciden.",
          life: 3000,
        });
        return;
      }

      clearStatus();
      try {
        const res = await fetch(
          `${window.APP_CONFIG.API_BASE_URL}/api/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registerForm),
          }
        );

        if (res.status === 201) {
          toast.add({
            severity: "success",
            summary: "Registro Exitoso",
            detail: "Ahora puedes iniciar sesión.",
            life: 3000,
          });
          registerForm.username = "";
          registerForm.password = "";
          switchTab("login");
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.message || `Request failed with status ${res.status}`
          );
        }

        toast.add({
          severity: "success",
          summary: "Registro Exitoso",
          detail: data.message || "¡Registro completado!",
          life: 3000,
        });
      } catch (e) {
        toast.add({
          severity: "error",
          summary: "Error de Registro",
          detail: e.message,
          life: 3000,
        });
      }
    };

    const login = async () => {
      try {
        const res = await fetch(
          `${window.APP_CONFIG.API_BASE_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginForm),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || res.statusText);
        }
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("username", loginForm.username);
        toast.add({
          severity: "success",
          summary: "Éxito",
          detail: "¡Bienvenido de nuevo!",
          life: 2000,
        });
        emit("login-success", loginForm.username);
      } catch (e) {
        toast.add({
          severity: "error",
          summary: "Error de Login",
          detail: e.message,
          life: 3000,
        });
      }
    };

    return {
      registerForm,
      loginForm,
      activeTab,
      switchTab,
      register,
      login,
    };
  },
};

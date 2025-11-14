const AddUmaForm = {
  template: "#add-uma-form-template",
  emits: ["uma-added"],
  props: {
    umaData: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { ref, reactive, watchEffect } = Vue;
    const toast = PrimeVue.useToast();

    const getInitialState = () => ({
      name: "",
      description: "",
      rarity: "R", 
      speed: 1,
      stamina: 1,
      power: 1,
      guts: 1,
      intelligence: 1,
      image: null,
    });

    const form = reactive(getInitialState());
    const rarityOptions = ref(["R", "SR", "SSR"]);
    const submitting = ref(false);

    // Watch for incoming prop and fill/reset form
    watchEffect(() => {
      const initialState = getInitialState();
      if (props.umaData) {
        // Edit mode: Assign existing data
        Object.assign(form, initialState, props.umaData, { image: null });
      } else {
        // Create mode: Reset to initial state
        Object.assign(form, initialState);
      }
    });

    const onFileSelect = (event) => {
      form.image = event.files[0];
    };

    const handleSubmit = async () => {
      toast.add({
        severity: "info",

        summary: "Procesando",

        detail: "Enviando formulario...",

        life: 1000,
      });

      submitting.value = true;

      try {
        const formData = new FormData();

        Object.keys(form).forEach((key) => {
          if (key === "image" && form.image === null) return;

          if (form[key] !== null) {
            formData.append(key, form[key]);
          }
        });

        if (props.umaData) {
          // Update mode

          await updateUma(props.umaData.id, formData);

          toast.add({
            severity: "success",

            summary: "Éxito",

            detail: "Uma actualizada.",

            life: 3000,
          });
        } else {
          // Create mode

          await createUma(formData);

          toast.add({
            severity: "success",

            summary: "Éxito",

            detail: "Uma añadida al catálogo.",

            life: 3000,
          });
        }

        emit("uma-added"); // Re-used event to refresh list
      } catch (error) {
        toast.add({
          severity: "error",

          summary: "Error",

          detail: error.message || "No se pudo guardar la Uma.",

          life: 3000,
        });
      } finally {
        submitting.value = false;
      }
    };

    const clampStat = (statName) => {
      let value = form[statName];

      if (value < 1) {
        form[statName] = 1;
      } else if (value > 1200) {
        form[statName] = 1200;
      }
    };

    return {
      form,

      rarityOptions,

      submitting,

      onFileSelect,

      handleSubmit,

      clampStat,
    };
  },
};

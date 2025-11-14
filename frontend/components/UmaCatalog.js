const UmaCatalog = {
  template: "#uma-catalog-template",
  props: {
    currentUser: {
      type: String,
      required: true,
    },
  },
  emits: ["logout"],
  setup() {
    const { ref, reactive, computed, onMounted } = Vue;
    const toast = PrimeVue.useToast();
    const confirm = PrimeVue.useConfirm();

    // Data
    const umas = ref([]);
    const loading = ref(false);

    // Dialogs
    const showAddDialog = ref(false);
    const umaToEdit = ref(null);

    // Filters
    const searchQuery = ref("");
    const selectedRarities = ref([]);
    const rarityOptions = ref(["R", "SR", "SSR"]);
    const statsRange = reactive({
      speed: [1, 1200],
      stamina: [1, 1200],
      power: [1, 1200],
      guts: [1, 1200],
      intelligence: [1, 1200],
    });

    const filteredUmas = computed(() => {
      let filtered = umas.value;

      // Search query filter
      if (searchQuery.value) {
        const lowerCaseQuery = searchQuery.value.toLowerCase();
        filtered = filtered.filter(uma => 
          uma.name.toLowerCase().startsWith(lowerCaseQuery)
        );
      }

      // Rarity filter
      if (selectedRarities.value.length > 0) {
        filtered = filtered.filter((uma) =>
          selectedRarities.value.includes(uma.rarity)
        );
      }

      // Stats range filter
      for (const stat in statsRange) {
        const [min, max] = statsRange[stat];
        filtered = filtered.filter(
          (uma) => uma[stat] >= min && uma[stat] <= max
        );
      }

      return filtered;
    });

    const dialogTitle = computed(() => {
      return umaToEdit.value ? "Editar Uma" : "Añadir Nueva Uma";
    });

    const onDialogClose = (value) => {
      if (!value) {
        umaToEdit.value = null;
      }
      showAddDialog.value = value;
    };

    const fetchUmas = async () => {
      loading.value = true;
      try {
        umas.value = await getUmas();
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar las Umas.",
          life: 3000,
        });
      } finally {
        loading.value = false;
      }
    };

    const onUmaSaved = () => {
      onDialogClose(false);
      fetchUmas();
    };

    const handleEditRequest = (uma) => {
      umaToEdit.value = uma;
      showAddDialog.value = true;
    };

    const handleDeleteRequest = (umaId) => {
      confirm.require({
        message: "¿Estás seguro de que quieres eliminar esta Uma?",
        header: "Confirmación de Eliminación",
        icon: "pi pi-info-circle",
        acceptClass: "p-button-danger",
        accept: async () => {
          try {
            await deleteUma(umaId);
            toast.add({
              severity: "success",
              summary: "Eliminada",
              detail: "La Uma ha sido eliminada.",
              life: 3000,
            });
            fetchUmas();
          } catch (error) {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: "No se pudo eliminar la Uma.",
              life: 3000,
            });
          }
        },
      });
    };

    onMounted(fetchUmas);

    return {
      umas,
      loading,
      showAddDialog,
      umaToEdit,
      dialogTitle,
      searchQuery,
      selectedRarities,
      rarityOptions,
      statsRange,
      filteredUmas,
      onUmaSaved,
      handleDeleteRequest,
      handleEditRequest,
      onDialogClose,
    };
  },
};

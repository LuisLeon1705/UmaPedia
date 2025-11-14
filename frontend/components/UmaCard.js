const UmaCard = {
  template: "#uma-card-template",
  props: {
    uma: {
      type: Object,
      required: true,
    },
  },
  emits: ['delete-request', 'edit-request'],
  setup(props) {
    const { computed } = Vue;
    const { API_BASE_URL } = window.APP_CONFIG;

    const imageUrl = computed(() => {
      if (!props.uma.image_url) {
        // Return a placeholder image if no image is available
        return `https://via.placeholder.com/400x200.png?text=${props.uma.name}`;
      }
      // The backend provides a path like 'storage\image.png'.
      // It needs to be converted to a full URL like 'http://localhost:3000/storage/image.png'
      const imagePath = props.uma.image_url.replace(/\\/g, "/");
      return `${API_BASE_URL}/${imagePath}`;
    });

    return {
      imageUrl,
    };
  },
};
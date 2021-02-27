const GLOBAL_PARAMS = {
  getCustomerUrlPost : "https://api.gplatform.org/sol/api",
  isLogging: true,
}

// Body templates to request API (only for reference)
const apiBodyTemplates = {
  find_client: {
    method: 'find_client',
    data: {
      client_id: '',
      is_create_if_not_found: true,
    },
  },
  make_buy_tx: {
    method: 'make_buy_tx',
    data: {
      client_id: '',
      spend: 0,
      spend_sign: '',
      items: [],
      commit: false
    },
  },
};

export { GLOBAL_PARAMS }
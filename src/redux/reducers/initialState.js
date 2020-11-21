const initialState = {
  errors: [],
  entities: {
    currentEntity: {
      id: null,
      type: null
    },
    showMenuTree: false
  },
  states: {
    states: [],
    bboxes: {},
    districtsByState: {}
  },
  legislators: {
    legislators: [],
    legislatorsByState: {},
  },
};

export default initialState;

export function getUSStateJsonData(states) {
  // console.log('states: ', states);
  const USStates = states.map(state => {
    return {
      attributes: {
        value: state.USPS,
        label: state.Name
      },
      type: 'state'
    }
  });
  return ({
    meta: {
      total: USStates.length
    },
    data: USStates.sort((a,b) => a.attributes.label - b.attributes.label)
  });
}

export function getCongressionalDistrictJsonData(districts, USState) {
  const districtsForUSState = districts[USState].map(district => {
    return {
      attributes: {
        value: district,
        label: `District ${district}`
      },
      type: 'district'
    }
  });
  return ({
    meta: {
      total: districtsForUSState.length
    },
    data: districtsForUSState.sort((a,b) => a.attributes.value - b.attributes.value)
  });
}
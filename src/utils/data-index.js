export const getLegislatorsByState = (legislators) => {
  const index = {};
  legislators.forEach(legislator => {
    const {first, last, middle, official_full} = legislator.bio[0];
    legislator.name = {first, last, middle, official_full};
    const {term} = legislator;
    const { state, type, state_rank, district } = term[0];
    index[state] = index[state] || {};
    index[state][type] = index[state][type] || {};

    if (type === 'sen') {
      index[state][type][state_rank] = {
        bioguide_id: legislator.bioguide_id,
        name: legislator.name,
        bio: legislator.bio[0],
        terms: legislator.term,
        id: legislator.ids[0]
      };
    }
    if (type === 'rep') {
      index[state][type][district] = {
        bioguide_id: legislator.bioguide_id,
        name: legislator.name,
        bio: legislator.bio[0],
        terms: legislator.term,
        id: legislator.ids[0]
      };
    }
  })
  // console.log(index);
  return index;
};

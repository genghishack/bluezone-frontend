const local = {
  mapbox: {
    accessToken: "pk.eyJ1IjoiZ2VuZ2hpc2hhY2siLCJhIjoiZ2x6WjZhbyJ9.P8at90QQiy0C8W_mc21w6Q",
    // style: "mapbox://styles/genghishack/cjga1amoc2xx02ro7nzpv1e7s", // 2017 congress map
    // style: "mapbox://styles/genghishack/cjnjjdyk64avs2rqgldz3j2ok", // 2018 congress map
    style: "mapbox://styles/genghishack/cjftwwb9b8kw32sqpariydkrk", // basic
    layerIds: ['districts_hover'],
  },
  apiGateway: {
    REGION: 'us-west-2',
    URL: 'https://ojt69rmw6b.execute-api.us-west-2.amazonaws.com/dev'
  },
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_vgch3ExSV',
    APP_CLIENT_ID: '7epugdlt3hu96s324mk2rl1gba',
    IDENTITY_POOL_ID: ''
  }
};

const dev = {
  mapbox: {
    accessToken: "pk.eyJ1IjoiZ2VuZ2hpc2hhY2siLCJhIjoiZ2x6WjZhbyJ9.P8at90QQiy0C8W_mc21w6Q",
    // style: "mapbox://styles/genghishack/cjga1amoc2xx02ro7nzpv1e7s", // 2017 congress map
    // style: "mapbox://styles/genghishack/cjnjjdyk64avs2rqgldz3j2ok", // 2018 congress map
    style: "mapbox://styles/genghishack/cjftwwb9b8kw32sqpariydkrk", // basic
    layerIds: ['districts_hover'],
  },
  apiGateway: {
    REGION: 'us-west-2',
    URL: 'https://ojt69rmw6b.execute-api.us-west-2.amazonaws.com/dev'
  },
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_vgch3ExSV',
    APP_CLIENT_ID: '7epugdlt3hu96s324mk2rl1gba',
    IDENTITY_POOL_ID: ''
  }
};

const test = {
  mapbox: {
    accessToken: "pk.eyJ1IjoiZ2VuZ2hpc2hhY2siLCJhIjoiZ2x6WjZhbyJ9.P8at90QQiy0C8W_mc21w6Q",
    // style: "mapbox://styles/genghishack/cjga1amoc2xx02ro7nzpv1e7s", // 2017 congress map
    // style: "mapbox://styles/genghishack/cjnjjdyk64avs2rqgldz3j2ok", // 2018 congress map
    style: "mapbox://styles/genghishack/cjftwwb9b8kw32sqpariydkrk", // basic
    layerIds: ['districts_hover'],
  },
  apiGateway: {
    REGION: 'us-west-2',
    URL: 'https://ojt69rmw6b.execute-api.us-west-2.amazonaws.com/dev'
  },
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_vgch3ExSV',
    APP_CLIENT_ID: '7epugdlt3hu96s324mk2rl1gba',
    IDENTITY_POOL_ID: ''
  }
};

const prod = {
  mapbox: {
    accessToken: "pk.eyJ1IjoiZ2VuZ2hpc2hhY2siLCJhIjoiZ2x6WjZhbyJ9.P8at90QQiy0C8W_mc21w6Q",
    // style: "mapbox://styles/genghishack/cjga1amoc2xx02ro7nzpv1e7s", // 2017 congress map
    // style: "mapbox://styles/genghishack/cjnjjdyk64avs2rqgldz3j2ok", // 2018 congress map
    style: "mapbox://styles/genghishack/cjftwwb9b8kw32sqpariydkrk", // basic
    layerIds: ['districts_hover'],
  },
  apiGateway: {
    REGION: 'us-west-2',
    URL: 'https://ojt69rmw6b.execute-api.us-west-2.amazonaws.com/dev'
  },
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_vgch3ExSV',
    APP_CLIENT_ID: '7epugdlt3hu96s324mk2rl1gba',
    IDENTITY_POOL_ID: ''
  }
};

let config = local;

switch (process.env.REACT_APP_STAGE) {
  case 'prod':
    config = prod;
    break;
  case 'test':
    config = test;
    break;
  case 'dev':
    config = dev;
    break;
  default:
    config = local;
    break;
}

export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};

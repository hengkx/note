import Mock from 'mockjs';

const Random = Mock.Random;// eslint-disable-line no-unused-vars

function getParamsMockObj(params) {
  const paramsObj = {};
  params.forEach(item => {
    let value;
    if (!item.rule) {
      if (item.type === 'String') {
        value = Mock.Random.string();
      } else if (item.type === '[String]') {
        value = [Mock.Random.string(), Mock.Random.string(), Mock.Random.string()];
      } else if (item.type === 'Number') {
        value = Math.random();
      } else if (item.type === 'Boolean') {
        value = Mock.Random.pick([true, false]);
      } else if (item.type === '[Boolean]') {
        const arr = [];
        let i = 0;
        while (i < 3) {
          arr.push(Mock.Random.pick([true, false]));
          i += 1;
        }
        value = arr;
      }
    } else {
      try {
        value = eval(item.rule);
      } catch (error) {
        console.log(error);
      }
    }
    if (item.type.indexOf('Object') !== -1 && item.children) {
      if (item.type === '[Object]') {
        const arr = [];
        let i = 0;
        while (i < 3) {
          arr.push(getParamsMockObj(item.children));
          i += 1;
        }
        value = arr;
      } else {
        value = getParamsMockObj(item.children);
      }
    }
    paramsObj[item.name] = value;
  });
  return paramsObj;
}

export default getParamsMockObj;

let data: ConfigCenterDataAPI.LeagueTagType[] = [];
import {
  ESPORT_ID_MAP,
  SPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';

for (let i = 0; i < 50; i++) {
  data.push({
    id: i,
    text: `text${i}`,
    category: SPORT_CATEGORY[i % 3].value,
    sportId:
      i % 3 === 1 ? ESPORT_ID_MAP[i % 20].value : SPORT_ID_MAP[i % 9].value
  });
}

const getLeagueTagList = (
  fetchProps: ConfigCenterDataAPI.LeagueTagListFetchProps
) => {
  return new Promise<ConfigCenterDataAPI.ListLeagueTagRes>(
    (resolve, reject) => {
      setTimeout(() => {
        const { pageSize, pageNum } = fetchProps;
        if (data.length < pageSize * (pageNum - 1)) {
          reject('There are no histories match');
        }
        const list = [...data]
          .reverse()
          .filter(
            (_, index) =>
              index >= pageSize * (pageNum - 1) && index < pageSize * pageNum
          );
        resolve({
          code: 0,
          data: {
            list,
            total: data.length,
            pageSize,
            pageNum
          },
          msg: '成功获取标签目录'
        });
      }, 1000);
    }
  );
};

const searchLeagueTagList = (
  fetchProps: ConfigCenterDataAPI.LeagueTagType
) => {
  return new Promise<ConfigCenterDataAPI.SearchLeagueTagRes>(
    (resolve, reject) => {
      setTimeout(() => {
        const { categoryId, sportId } = fetchProps;
        if (!Number.isInteger(sportId) || !Number.isInteger(sportId)) {
          reject();
        }
        const list = data.filter(
          item => item.categoryId === categoryId && item.sportId === sportId
        );
        resolve({
          code: 0,
          data: list,
          msg: '成功获取标签目录'
        });
      }, 1000);
    }
  );
};

const updateLeagueTag = (dataProp: ConfigCenterDataAPI.LeagueTagType) => {
  return new Promise<ConfigCenterDataAPI.LeagueTagRes>((resolve, reject) => {
    setTimeout(() => {
      const { id } = dataProp;
      if (data.findIndex(item => item.id === id) < 0) {
        reject('There are no histories match');
      }
      data = data.map(item => (item.id === id ? dataProp : item));
      resolve({
        code: 0,
        data: dataProp,
        msg: '成功更新标签信息'
      });
    }, 1000);
  });
};
const createLeagueTag = (dataProp: ConfigCenterDataAPI.LeagueTagType) => {
  return new Promise<ConfigCenterDataAPI.LeagueTagRes>((resolve, reject) => {
    setTimeout(() => {
      const newData = { ...dataProp, id: data[data.length - 1].id + 1 };
      data.push(newData);
      // data = [newData, ...data];
      resolve({
        code: 0,
        data: newData,
        msg: '成功创建标签'
      });
    }, 1000);
  });
};

const deleteLeagueTag = (dataProp: ConfigCenterDataAPI.LeagueTagType) => {
  return new Promise<ConfigCenterDataAPI.LeagueTagRes>((resolve, reject) => {
    setTimeout(() => {
      const { id } = dataProp;
      data = data.filter(item => item.id !== id);
      resolve({
        code: 0,
        data: null,
        msg: '成功删除标签'
      });
    }, 1000);
  });
};

const mockAPI = {
  getLeagueTagList,
  searchLeagueTagList,
  updateLeagueTag,
  createLeagueTag,
  deleteLeagueTag
};

export default mockAPI;

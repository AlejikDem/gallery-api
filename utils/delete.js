export const makeDeletePhotosParams = (photos, deleteParams) => {
  return Object.assign({}, deleteParams, {
    Delete: {
      Objects: photos.map(photo => {
        const { session } = photo;
        const sessionName = session ? session.name + '/' : '';
        const Key = `${sessionName}${photo.name}`;

        return {
          Key,
        };
      }),
    },
  });
};

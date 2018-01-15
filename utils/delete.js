export const makeDeletePhotosParams = (
  photos,
  deleteParams,
  sessionName = '',
) => {
  if (sessionName) sessionName = sessionName + '/';

  return Object.assign({}, deleteParams, {
    Delete: {
      Objects: photos.map(photo => {
        if (!sessionName && photo.session) {
          sessionName = photo.session.name + '/';
        }
        const Key = `${sessionName}${photo.name}`;
        return {
          Key,
        };
      }),
    },
  });
};

import s3 from '../aws';

export const copyPhotos = (
  photos,
  newSessionName,
  copyParams,
  oldSessionName = '',
) => {
  if (oldSessionName) oldSessionName += '/';

  return Promise.all(
    photos.map(photo => {
      if (!oldSessionName && photo.session) {
        oldSessionName = photo.session.name + '/';
      }

      const params = Object.assign({}, copyParams, {
        CopySource: `/${copyParams.Bucket}/${oldSessionName}${photo.name}`,
        Key: `${newSessionName}/${photo.name}`,
      });

      return s3.copyObject(params).promise();
    }),
  );
};

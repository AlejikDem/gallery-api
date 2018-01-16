/* global Promise */
import s3 from '../aws';

export const copyPhotos = (photos, newSession, copyParams) => {
  return Promise.all(
    photos.map(photo => {
      const oldSessionName = photo.session ? photo.session.name + '/' : '';

      const params = Object.assign({}, copyParams, {
        CopySource: `/${copyParams.Bucket}/${oldSessionName}${photo.name}`,
        Key: `${newSession.name}/${photo.name}`,
      });
      return s3.copyObject(params).promise();
    }),
  );
};

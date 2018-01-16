/* global Promise */
import shortid from 'shortid';
import s3 from '../aws';

export const prepareFilesForUpload = (files, session) => {
  const sessionName = session ? session.name + '/' : '';
  return files.map(photo => {
    const uniqId = shortid.generate();
    const fileName = photo.originalname;
    const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
    const newName = `${uniqId}.${extension}`;
    const path = sessionName + newName;

    return {
      name: newName,
      extension,
      key: path,
      buffer: photo.buffer,
    };
  });
};

export const prepareFilesForSave = (files, category, session) =>
  files.map(file => ({
    name: file.name,
    category: category && category._id,
    session: session && session._id,
  }));

export const getContentType = extension => {
  switch (extension) {
    case 'jpg':
      return 'image/jpg';
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'image/jpg';
  }
};

export const uploadPhotos = (files, uploadParams) => {
  return Promise.all(
    files.map(file => {
      const params = Object.assign({}, uploadParams, {
        Key: file.key,
        Body: file.buffer,
        ContentType: getContentType(file.extension),
      });

      return s3.putObject(params).promise();
    }),
  );
};

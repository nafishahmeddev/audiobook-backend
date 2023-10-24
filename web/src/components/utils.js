
export const getFileSizeMB = (size) => {
    return size / 1000 / 1000;
  };
  
  export const checkType = (file, types) => {
    const extension = file.name.split('.').pop();
    const loweredTypes = types.map((type) => type.toLowerCase());
    return loweredTypes.includes(extension.toLowerCase());
  };
  
  export const acceptedExt = (types) => {
    if (types === undefined) return '';
    return types.map((type) => `.${type.toLowerCase()}`).join(',');
  };
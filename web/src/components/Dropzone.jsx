import {
  Description
} from './style';

export default function Dropzone(currFile, uploaded, typeError, disabled, label) {
  return typeError ? (
    <span>File type/size error, Hovered on types!</span>
  ) : (
    <Description>
      {disabled ? (
        <span>Chapter Adding disabled</span>
      ) : !currFile && !uploaded ? (
        <>
          {label ? (
            <>
              <span>{label.split(' ')[0]}</span>{' '}
              {label.substr(label.indexOf(' ') + 1)}
            </>
          ) : (
            <>
              <span>Add</span> or drop chapters right here
            </>
          )}
        </>
      ) : (
        <>
          <span>Chapters Added Successfully!</span><br /> Add another?
        </>
      )}
    </Description>
  );
}
export type APIErrorResult = Array<FieldError>;

export type FieldError = {
  message: string;
  field: string;
};

export function errorMaker(msg: string, field: string, ...strings: any[]) {
  const arrayErrors: Array<FieldError> = [];
  arrayErrors.push({
    message: msg,
    field: field,
  });
  if (strings.length > 0) {
    for (let i = 0; i > strings.length; i + 2) {
      arrayErrors.push({
        message: strings[i],
        field: strings[i + 1],
      });
    }
  }
  return { errorsMessages: arrayErrors };
}

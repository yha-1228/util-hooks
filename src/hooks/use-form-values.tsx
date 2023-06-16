import React from 'react';

type FieldElement = HTMLInputElement | HTMLSelectElement;

export type ValuesErrors<Values> = Partial<Record<keyof Values, string>>;

type UseFormValuesOptions<Values extends object> = {
  initialValues: Values;
  validator: (values: Values) => ValuesErrors<Values>;
};

type UseFormValuesResult<Values extends object> = {
  values: Values;
  fieldProps: (field: keyof Values) => {
    name: keyof Values;
    onChange: (e: React.ChangeEvent<FieldElement>) => void;
    value: Values[keyof Values];
  };
  errors: ValuesErrors<Values>;
  hasError: boolean;
};

export function useFormValues<Values extends object>(
  options: UseFormValuesOptions<Values>
): UseFormValuesResult<Values> {
  const { initialValues, validator } = options;
  const [values, setValues] = React.useState(initialValues);
  const errors = validator(values);

  const handleChange = (e: React.ChangeEvent<FieldElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fieldProps = (field: keyof Values) => {
    return {
      name: field,
      onChange: handleChange,
      value: values[field],
    };
  };

  return {
    values,
    fieldProps,
    errors,
    hasError: Object.values(errors).length > 0,
  };
}

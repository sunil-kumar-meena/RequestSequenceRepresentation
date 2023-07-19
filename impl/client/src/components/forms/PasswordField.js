import { FormField } from './FormField'

export const PasswordField = ({
  label,
  field: { name, value, ...fieldProps },
  form,
  required,
  ...props
}) => {
  return (
    <FormField id={name} label={label} required={required} formProps={form}>
      <input
        type="password"
        id={name}
        name={name}
        value={value}
        {...fieldProps}
        {...props}
      />
    </FormField>
  )
}

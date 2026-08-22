import React, { ReactNode, FormHTMLAttributes } from 'react';
import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

type FormProviderProps = {
  methods: UseFormReturn<any>;
  children: ReactNode;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
  formProps?: FormHTMLAttributes<HTMLFormElement>;
  className?:string;
};

export default function FormProvider({
  methods,
  children,
  onSubmit,
  formProps,
  className = '',
}: FormProviderProps) {
  return (
    <Form {...methods}>
      <form
        onSubmit={onSubmit}
        {...formProps}
        className={className || formProps?.className}
      >
        {children}
      </form>
    </Form>
  );
}
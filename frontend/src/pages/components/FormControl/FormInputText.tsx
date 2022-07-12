import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Button, Stack, TextField } from '@mui/material';
import { FormInputProps } from './FormInputProps';

export function FormInputText({ name, label }: FormInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue = ''
      render={
        ({ onChange, value, ref }) => (
          <TextField
            helperText={error ? error.message : null}
            size="small"
            onChange={onChange}
            value={value}
            fullWidth
            label={label}
            variant="outlined"
          />
        )
      }

    />
  )
}

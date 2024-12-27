import * as React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Control, FieldValues, Path } from 'react-hook-form';

// ジェネリック型 T を使って、フォームの型に応じたフィールドを柔軟にサポート
interface EmailFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>; // 親から明示的に "email" を渡すようにする
}

function EmailField<T extends FieldValues>({ control, name }: EmailFieldProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-slate-600">メールアドレス</FormLabel>
          <FormControl>
            <input
              type="text"
              placeholder="test@test.com"
              className="w-full p-2 border rounded-md text-base focus:outline-none focus:ring-0 focus:ring-offset-0"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default EmailField;
